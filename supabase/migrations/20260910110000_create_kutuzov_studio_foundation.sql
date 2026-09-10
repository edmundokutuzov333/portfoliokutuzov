-- Kutuzov Studio foundation: anonymous-friendly draft storage with a future-proof vector document.
-- Public clients may create drafts, but cannot read or mutate rows through the public API.
-- Administrative access remains server-side through the existing protected admin infrastructure.

create table if not exists public.studio_cards (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  name text not null default '',
  role text not null default '',
  company text not null default '',
  email text not null default '',
  phone text not null default '',
  website text not null default '',
  design_document jsonb not null,
  status text not null default 'draft' check (status in ('draft', 'saved', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists studio_cards_created_at_idx on public.studio_cards (created_at desc);
create index if not exists studio_cards_session_id_idx on public.studio_cards (session_id);
create index if not exists studio_cards_status_idx on public.studio_cards (status);

create or replace function public.set_studio_card_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists studio_cards_updated_at on public.studio_cards;
create trigger studio_cards_updated_at
before update on public.studio_cards
for each row execute function public.set_studio_card_updated_at();

alter table public.studio_cards enable row level security;

-- The public Studio only needs to create a draft. Read/update access is deliberately
-- kept out of the anon role until a server-mediated session token is introduced.
drop policy if exists "studio cards anon insert" on public.studio_cards;
create policy "studio cards anon insert"
on public.studio_cards
for insert
to anon
with check (
  status = 'draft'
  and length(session_id) between 20 and 128
  and jsonb_typeof(design_document) = 'object'
);

drop policy if exists "studio cards authenticated own access" on public.studio_cards;
create policy "studio cards authenticated own access"
on public.studio_cards
for all
to authenticated
using (auth.uid()::text = session_id)
with check (auth.uid()::text = session_id);

-- Private object bucket reserved for future server-mediated asset uploads.
insert into storage.buckets (id, name, public)
values ('studio-assets', 'studio-assets', false)
on conflict (id) do update set public = excluded.public;

-- Authenticated ownership policy for the future signed-in/ephemeral-auth flow.
drop policy if exists "studio assets authenticated read" on storage.objects;
create policy "studio assets authenticated read"
on storage.objects
for select
to authenticated
using (bucket_id = 'studio-assets' and owner_id = auth.uid()::text);

drop policy if exists "studio assets authenticated insert" on storage.objects;
create policy "studio assets authenticated insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'studio-assets');

drop policy if exists "studio assets authenticated update" on storage.objects;
create policy "studio assets authenticated update"
on storage.objects
for update
to authenticated
using (bucket_id = 'studio-assets' and owner_id = auth.uid()::text)
with check (bucket_id = 'studio-assets' and owner_id = auth.uid()::text);

drop policy if exists "studio assets authenticated delete" on storage.objects;
create policy "studio assets authenticated delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'studio-assets' and owner_id = auth.uid()::text);
