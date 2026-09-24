-- Phase 14: structured empty-safe CMS registries for FAQ, testimonials and site metrics.
-- Additive/reversible. Empty tables remain hidden from the public until populated.

create table if not exists public.faq_entries (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  question_pt text,
  answer_pt text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  quote_pt text,
  person text not null,
  role text,
  company text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_metrics (
  id uuid primary key default gen_random_uuid(),
  metric_key text not null unique,
  value text,
  value_pt text,
  label text not null,
  label_pt text,
  sort_order integer not null default 0,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.faq_entries enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_metrics enable row level security;

drop policy if exists "public read published faq" on public.faq_entries;
create policy "public read published faq" on public.faq_entries for select to anon, authenticated using (is_published);
drop policy if exists "admin manage faq" on public.faq_entries;
create policy "admin manage faq" on public.faq_entries for all to authenticated using (public.admin_has_permission('content.write')) with check (public.admin_has_permission('content.write'));

drop policy if exists "public read published testimonials" on public.testimonials;
create policy "public read published testimonials" on public.testimonials for select to anon, authenticated using (is_published);
drop policy if exists "admin manage testimonials" on public.testimonials;
create policy "admin manage testimonials" on public.testimonials for all to authenticated using (public.admin_has_permission('content.write')) with check (public.admin_has_permission('content.write'));

drop policy if exists "public read active site metrics" on public.site_metrics;
create policy "public read active site metrics" on public.site_metrics for select to anon, authenticated using (is_active);
drop policy if exists "admin manage site metrics" on public.site_metrics;
create policy "admin manage site metrics" on public.site_metrics for all to authenticated using (public.admin_has_permission('content.write')) with check (public.admin_has_permission('content.write'));

create trigger trg_faq_entries_updated before update on public.faq_entries for each row execute function set_updated_at();
create trigger trg_testimonials_updated before update on public.testimonials for each row execute function set_updated_at();
create trigger trg_site_metrics_updated before update on public.site_metrics for each row execute function set_updated_at();
create trigger trg_admin_audit_faq_entries after insert or delete or update on public.faq_entries for each row execute function capture_admin_audit();
create trigger trg_admin_audit_testimonials after insert or delete or update on public.testimonials for each row execute function capture_admin_audit();
create trigger trg_admin_audit_site_metrics after insert or delete or update on public.site_metrics for each row execute function capture_admin_audit();
create trigger trg_admin_version_faq_entries after insert or delete or update on public.faq_entries for each row execute function capture_admin_content_version();
create trigger trg_admin_version_testimonials after insert or delete or update on public.testimonials for each row execute function capture_admin_content_version();
create trigger trg_admin_version_site_metrics after insert or delete or update on public.site_metrics for each row execute function capture_admin_content_version();
