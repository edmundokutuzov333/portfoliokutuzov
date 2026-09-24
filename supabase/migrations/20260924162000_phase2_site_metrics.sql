create table if not exists public.site_metrics (
  id uuid primary key default gen_random_uuid(),
  metric_key text not null unique,
  value text,
  value_pt text,
  label text not null,
  label_pt text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_metrics enable row level security;

drop policy if exists "public read active site_metrics" on public.site_metrics;
drop policy if exists "admins read site_metrics" on public.site_metrics;
drop policy if exists "admins insert site_metrics" on public.site_metrics;
drop policy if exists "admins update site_metrics" on public.site_metrics;
drop policy if exists "admins delete site_metrics" on public.site_metrics;

create policy "public read active site_metrics"
  on public.site_metrics for select to anon, authenticated
  using (is_active = true);

create policy "admins read site_metrics"
  on public.site_metrics for select to authenticated
  using (is_admin());

create policy "admins insert site_metrics"
  on public.site_metrics for insert to authenticated
  with check (admin_has_permission('content.write'::text));

create policy "admins update site_metrics"
  on public.site_metrics for update to authenticated
  using (admin_has_permission('content.write'::text))
  with check (admin_has_permission('content.write'::text));

create policy "admins delete site_metrics"
  on public.site_metrics for delete to authenticated
  using (admin_has_permission('content.write'::text));

create index if not exists idx_site_metrics_active_order
  on public.site_metrics (is_active, sort_order);

