-- Phase 13: grounded AI knowledge, conversation logs and RAG retrieval.
-- Additive and reversible. Not applied to production in this phase because R1 backup
-- evidence remains BLOCKED-EXTERNAL.
--
-- vector is created only if it is not already installed. The extension is shared
-- infrastructure and is deliberately retained by the rollback.

create extension if not exists vector;

create table if not exists public.knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  source_table text not null check (source_table in ('case_studies','services','credentials','faq')),
  source_id uuid,
  source_key text not null,
  source_title text not null,
  source_url text not null,
  lang text not null default 'en' check (lang in ('en','pt-PT')),
  content text not null,
  content_hash text not null,
  embedding vector(768),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_key, lang, content_hash)
);

create index if not exists knowledge_chunks_source_idx
  on public.knowledge_chunks (source_table, source_key, lang);

create index if not exists knowledge_chunks_hash_idx
  on public.knowledge_chunks (content_hash);

create index if not exists knowledge_chunks_embedding_idx
  on public.knowledge_chunks using hnsw (embedding vector_cosine_ops);

alter table public.knowledge_chunks enable row level security;

drop policy if exists "knowledge chunks admin read" on public.knowledge_chunks;
create policy "knowledge chunks admin read"
  on public.knowledge_chunks
  for select
  to authenticated
  using (public.is_admin());

create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  session_hash text not null unique,
  lang text not null default 'en' check (lang in ('en','pt-PT')),
  pathname text,
  intent text,
  last_model text,
  handoff_status text not null default 'none',
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_conversations_updated_idx
  on public.ai_conversations (updated_at desc);

alter table public.ai_conversations enable row level security;

drop policy if exists "ai conversations admin read" on public.ai_conversations;
create policy "ai conversations admin read"
  on public.ai_conversations
  for select
  to authenticated
  using (public.is_admin());

create table if not exists public.ai_messages (
  id bigint generated always as identity primary key,
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant','tool')),
  content text not null,
  source_citations jsonb not null default '[]'::jsonb,
  tool_names jsonb not null default '[]'::jsonb,
  token_estimate integer,
  created_at timestamptz not null default now()
);

create index if not exists ai_messages_conversation_idx
  on public.ai_messages (conversation_id, created_at desc);

alter table public.ai_messages enable row level security;

drop policy if exists "ai messages admin read" on public.ai_messages;
create policy "ai messages admin read"
  on public.ai_messages
  for select
  to authenticated
  using (public.is_admin());

create or replace function public.match_knowledge_chunks(
  query_embedding vector(768),
  match_count integer default 6,
  filter_lang text default null
)
returns table (
  id uuid,
  source_table text,
  source_id uuid,
  source_title text,
  source_url text,
  lang text,
  content text,
  similarity double precision
)
language sql
stable
security definer
set search_path = public
as $$
  select
    kc.id,
    kc.source_table,
    kc.source_id,
    kc.source_title,
    kc.source_url,
    kc.lang,
    kc.content,
    1 - (kc.embedding <=> query_embedding) as similarity
  from public.knowledge_chunks kc
  where kc.is_published
    and kc.embedding is not null
    and (filter_lang is null or kc.lang = filter_lang)
  order by kc.embedding <=> query_embedding
  limit greatest(1, least(match_count, 12));
$$;

revoke all on function public.match_knowledge_chunks(vector(768), integer, text) from public, anon, authenticated;
grant execute on function public.match_knowledge_chunks(vector(768), integer, text) to service_role;

revoke all on table public.knowledge_chunks from anon;
revoke all on table public.ai_conversations from anon;
revoke all on table public.ai_messages from anon;
