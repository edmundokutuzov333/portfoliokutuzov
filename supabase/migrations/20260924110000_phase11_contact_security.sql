-- Phase 11: secure public contact submission and persistent rate limiting.
-- Apply only after a confirmed reversible Supabase backup (R1).

drop policy if exists "anyone can submit briefing" on public.briefing_submissions;

create table if not exists public.contact_rate_limits (
  key text primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0 check (request_count >= 0),
  updated_at timestamptz not null default now()
);

alter table public.contact_rate_limits enable row level security;

drop policy if exists "no public rate limit access" on public.contact_rate_limits;

create or replace function public.check_contact_rate_limit(
  p_key text,
  p_window_seconds integer default 900,
  p_max_requests integer default 5
)
returns table(
  allowed boolean,
  retry_after_seconds integer,
  request_count integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_window_end timestamptz;
  v_count integer;
  v_started timestamptz;
begin
  if p_key is null or length(trim(p_key)) = 0 then
    raise exception 'RATE_LIMIT_KEY_REQUIRED';
  end if;

  if p_window_seconds < 1 or p_window_seconds > 86400 then
    raise exception 'INVALID_RATE_LIMIT_WINDOW';
  end if;

  if p_max_requests < 1 or p_max_requests > 100 then
    raise exception 'INVALID_RATE_LIMIT_MAX';
  end if;

  insert into public.contact_rate_limits(key, window_started_at, request_count, updated_at)
  values (trim(p_key), v_now, 1, v_now)
  on conflict (key) do update
    set
      window_started_at = case
        when contact_rate_limits.window_started_at + make_interval(secs => p_window_seconds) <= v_now
          then v_now
        else contact_rate_limits.window_started_at
      end,
      request_count = case
        when contact_rate_limits.window_started_at + make_interval(secs => p_window_seconds) <= v_now
          then 1
        else contact_rate_limits.request_count + 1
      end,
      updated_at = v_now
  returning contact_rate_limits.window_started_at, contact_rate_limits.request_count
  into v_started, v_count;

  v_window_end := v_started + make_interval(secs => p_window_seconds);

  return query
  select
    v_count <= p_max_requests,
    greatest(1, ceil(extract(epoch from (v_window_end - v_now)))::integer),
    v_count;
end;
$$;

revoke all on public.contact_rate_limits from anon, authenticated;
revoke all on function public.check_contact_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.check_contact_rate_limit(text, integer, integer) to service_role;

create index if not exists contact_rate_limits_updated_at_idx
  on public.contact_rate_limits(updated_at);

-- Keep old data recoverable if rollback is required. This migration intentionally
-- does not alter or delete any briefing row.
