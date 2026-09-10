-- Phase 3: turn projects into structured editorial entities without introducing a new CMS.
-- The migration is intentionally additive and idempotent.

create table if not exists public.project_sections (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade,
  section_type text not null check (section_type in ('context','challenge','direction','execution','outcome','custom')),
  heading text, body text, sort_order integer not null default 0, is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade,
  media_type text not null check (media_type in ('image','video','embed')), url text not null, poster_url text, alt text,
  caption text, width integer, height integer, sort_order integer not null default 0, is_featured boolean not null default false,
  is_published boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.project_metrics (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade,
  label text not null, value text not null, sort_order integer not null default 0, created_at timestamptz not null default now()
);
create table if not exists public.project_credits (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade,
  role text not null, name text not null, organization text, sort_order integer not null default 0, created_at timestamptz not null default now()
);
create table if not exists public.project_relations (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade,
  related_project_id uuid not null references public.projects(id) on delete cascade,
  relation_type text not null default 'related' check (relation_type in ('related','next','previous','same_client','same_discipline')),
  sort_order integer not null default 0, unique(project_id, related_project_id, relation_type)
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  page text,
  element text,
  x numeric,
  y numeric,
  viewport_width integer,
  viewport_height integer,
  device text,
  session_id text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists analytics_events_action_created_idx on public.analytics_events(action, created_at desc);
create index if not exists analytics_events_page_created_idx on public.analytics_events(page, created_at desc);

create index if not exists project_sections_project_order_idx on public.project_sections(project_id, sort_order);
create index if not exists project_media_project_order_idx on public.project_media(project_id, sort_order);
create index if not exists project_metrics_project_order_idx on public.project_metrics(project_id, sort_order);
create index if not exists project_credits_project_order_idx on public.project_credits(project_id, sort_order);
create index if not exists project_relations_project_order_idx on public.project_relations(project_id, relation_type, sort_order);

alter table public.briefing_submissions add column if not exists lead_score integer;
alter table public.briefing_submissions add column if not exists lead_tier text check (lead_tier is null or lead_tier in ('low','qualified','priority'));
alter table public.briefing_submissions add column if not exists lead_signals jsonb not null default '[]'::jsonb;
alter table public.briefing_submissions add column if not exists landing_page text;
alter table public.briefing_submissions add column if not exists source_case_slug text;
create index if not exists briefing_submissions_lead_tier_idx on public.briefing_submissions(lead_tier, created_at desc);
create index if not exists briefing_submissions_source_case_idx on public.briefing_submissions(source_case_slug);

alter table public.project_sections enable row level security;
alter table public.project_media enable row level security;
alter table public.project_metrics enable row level security;
alter table public.project_credits enable row level security;
alter table public.project_relations enable row level security;
alter table public.analytics_events enable row level security;

create policy "Published project sections are public" on public.project_sections for select using (
  is_published and exists (select 1 from public.projects p where p.id = project_sections.project_id and p.is_published = true)
);
create policy "Published project media are public" on public.project_media for select using (
  is_published and exists (select 1 from public.projects p where p.id = project_media.project_id and p.is_published = true)
);
create policy "Project metrics are public for published projects" on public.project_metrics for select using (
  exists (select 1 from public.projects p where p.id = project_metrics.project_id and p.is_published = true)
);
create policy "Project credits are public for published projects" on public.project_credits for select using (
  exists (select 1 from public.projects p where p.id = project_credits.project_id and p.is_published = true)
);
create policy "Project relations are public for published projects" on public.project_relations for select using (
  exists (select 1 from public.projects p where p.id = project_relations.project_id and p.is_published = true)
  and exists (select 1 from public.projects p where p.id = project_relations.related_project_id and p.is_published = true)
);
create policy "Public analytics inserts" on public.analytics_events for insert with check (
  length(action) between 1 and 64 and (page is null or length(page) <= 300) and (element is null or length(element) <= 120)
);
