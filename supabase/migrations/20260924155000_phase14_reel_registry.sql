-- Phase 14: materialized Reel CMS registry + analytics store.
-- Seed is deterministic from the current projects source and is only executed when the migration is applied after R1 backup.

create table if not exists public.reel_items (
  id uuid primary key default gen_random_uuid(),
  source_project_id uuid unique references public.projects(id) on delete cascade,
  title text not null,
  client text,
  discipline text,
  year integer,
  cover_media_url text not null,
  cover_media_type text not null check (cover_media_type in ('image','video')),
  poster_url text,
  dominant_color text,
  accent_color text,
  case_slug text,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.reel_items enable row level security;
drop policy if exists "public read published reel" on public.reel_items;
create policy "public read published reel" on public.reel_items for select to anon, authenticated using (is_published or public.is_admin());
drop policy if exists "admin manage reel" on public.reel_items;
create policy "admin manage reel" on public.reel_items for all to authenticated using (public.admin_has_permission('content.write')) with check (public.admin_has_permission('content.write'));

insert into public.reel_items (id, source_project_id, title, client, discipline, year, cover_media_url, cover_media_type, poster_url, dominant_color, case_slug, display_order, is_published)
select p.id, p.id, p.title, p.client_name, p.category,
  case when p.year ~ '^[0-9]{4}$' then p.year::integer else null end,
  p.cover_url, case when p.video_url is not null then 'video' else 'image' end, p.cover_url,
  null, p.slug, coalesce(p.sort_order, 0), p.is_published
from public.projects p
where p.cover_url is not null
on conflict (source_project_id) do nothing;

create table if not exists public.reel_analytics (
  id bigint generated always as identity primary key,
  item_id uuid references public.reel_items(id) on delete cascade,
  event text not null check (event in ('view','hover','open','cinema')),
  session_hash text,
  created_at timestamptz not null default now()
);
alter table public.reel_analytics enable row level security;
drop policy if exists "admin read reel analytics" on public.reel_analytics;
create policy "admin read reel analytics" on public.reel_analytics for select to authenticated using (public.admin_has_permission('system.audit.read'));

create trigger trg_reel_items_updated before update on public.reel_items for each row execute function set_updated_at();
create trigger trg_reel_analytics_audit after insert or delete or update on public.reel_analytics for each row execute function capture_admin_audit();
create trigger trg_reel_items_audit after insert or delete or update on public.reel_items for each row execute function capture_admin_audit();
create index if not exists reel_items_display_order_idx on public.reel_items(display_order);
create index if not exists reel_analytics_created_at_idx on public.reel_analytics(created_at desc);
