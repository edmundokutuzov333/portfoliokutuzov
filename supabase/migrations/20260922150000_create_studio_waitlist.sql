create table if not exists public.studio_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.studio_waitlist enable row level security;

revoke all on public.studio_waitlist from anon, authenticated;

drop policy if exists "service role only" on public.studio_waitlist;
create policy "service role only"
  on public.studio_waitlist
  for all
  using (false)
  with check (false);

create index if not exists studio_waitlist_created_at_idx
  on public.studio_waitlist (created_at desc);
