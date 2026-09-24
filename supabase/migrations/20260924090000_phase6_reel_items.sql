-- Phase 6: Selected Portfolio Reel
-- Additive only. Do not apply to production until the Phase 1 backup is externally confirmed.

create table if not exists public.reel_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client text,
  discipline text,
  year int,
  cover_media_url text not null,
  cover_media_type text not null check (cover_media_type in ('image','video')),
  poster_url text,
  dominant_color text,
  accent_color text,
  case_slug text,
  display_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.reel_items enable row level security;

create policy reel_items_read_public
  on public.reel_items
  for select
  using (is_published or public.is_admin());

create policy reel_items_write_admin
  on public.reel_items
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Seed only from existing real project media.
-- Current truth-terrain has zero project cover/gallery media, so this insert is expected
-- to create zero rows until real media exists. No synthetic URLs are introduced.
insert into public.reel_items (
  title,
  client,
  discipline,
  year,
  cover_media_url,
  cover_media_type,
  poster_url,
  dominant_color,
  case_slug,
  display_order,
  is_published
)
select
  p.title,
  p.client_name,
  p.category,
  nullif(p.year, '')::int,
  p.cover_url,
  case when p.video_url is not null then 'video' else 'image' end,
  coalesce(p.gallery_meta -> 0 ->> 'url', p.cover_url),
  case
    when p.palette ~* '#[0-9a-f]{6}' then
      substring(p.palette from '#[0-9a-f]{6}')
    else null
  end,
  nullif(trim(p.slug), ''),
  p.sort_order,
  p.is_published
from public.projects p
where p.is_published = true
  and p.cover_url is not null;

create index if not exists reel_items_public_order_idx
  on public.reel_items (is_published, display_order);

create index if not exists reel_items_case_slug_idx
  on public.reel_items (case_slug);

create table if not exists public.reel_analytics (
  id bigint generated always as identity primary key,
  item_id uuid references public.reel_items(id) on delete cascade,
  event text not null check (event in ('view', 'hover', 'open', 'cinema')),
  session_hash text,
  created_at timestamptz not null default now()
);

alter table public.reel_analytics enable row level security;

create policy reel_analytics_read_admin
  on public.reel_analytics
  for select
  to authenticated
  using (public.is_admin());

create index if not exists reel_analytics_created_idx
  on public.reel_analytics (created_at desc);

create index if not exists reel_analytics_item_event_idx
  on public.reel_analytics (item_id, event, created_at desc);

-- There is deliberately no public INSERT policy. The Phase 6 server route is
-- feature-gated by REEL_ANALYTICS_ENABLED and uses the server-only service role.
