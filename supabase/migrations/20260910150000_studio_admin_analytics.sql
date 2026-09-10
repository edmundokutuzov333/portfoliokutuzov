-- Phase G: durable Studio telemetry and admin-only analytics support.
-- Event writes are server-mediated. Admin reads are protected by the existing is_admin() helper.

create table if not exists public.studio_events (
  id bigint generated always as identity primary key,
  event_name text not null check (event_name in (
    'studio_opened',
    'card_draft_created',
    'card_saved',
    'card_published',
    'generation_started',
    'generation_completed',
    'generation_failed',
    'export_started',
    'export_completed',
    'export_failed',
    'email_started',
    'email_sent',
    'email_failed',
    'digital_card_view',
    'digital_card_share',
    'digital_card_save_contact',
    'digital_card_email_click',
    'digital_card_phone_click',
    'digital_card_website_click',
    'ai_request',
    'ai_success',
    'ai_failed'
  )),
  session_id text,
  card_id uuid references public.studio_cards(id) on delete set null,
  share_token text,
  provider text,
  export_format text,
  duration_ms integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint studio_events_session_id_len check (session_id is null or length(session_id) between 1 and 128),
  constraint studio_events_share_token_len check (share_token is null or length(share_token) between 16 and 128),
  constraint studio_events_duration_nonnegative check (duration_ms is null or duration_ms >= 0)
);

create index if not exists studio_events_created_at_idx on public.studio_events (created_at desc);
create index if not exists studio_events_event_name_created_at_idx on public.studio_events (event_name, created_at desc);
create index if not exists studio_events_card_id_created_at_idx on public.studio_events (card_id, created_at desc);
create index if not exists studio_events_provider_created_at_idx on public.studio_events (provider, created_at desc);

alter table public.studio_events enable row level security;

drop policy if exists "studio events admin read" on public.studio_events;
create policy "studio events admin read"
on public.studio_events
for select
to authenticated
using (public.is_admin());

-- Admins need a library view over all cards; ordinary authenticated users keep their
-- existing ownership policy from the Studio foundation migration.
drop policy if exists "studio cards admin read" on public.studio_cards;
create policy "studio cards admin read"
on public.studio_cards
for select
to authenticated
using (public.is_admin() or auth.uid()::text = session_id);

-- Controlled RPC used by the Admin dashboard. The function checks admin status before
-- exposing aggregated Studio data, and bounds the requested window to 365 days.
create or replace function public.studio_admin_dashboard(
  p_since timestamptz,
  p_until timestamptz default now()
)
returns jsonb
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_since timestamptz := greatest(coalesce(p_since, now() - interval '30 days'), now() - interval '365 days');
  v_until timestamptz := least(coalesce(p_until, now()), now() + interval '5 minutes');
  v_result jsonb;
begin
  if not public.is_admin() then
    raise exception using errcode = '42501', message = 'Forbidden: admin only';
  end if;

  select jsonb_build_object(
    'window', jsonb_build_object('since', v_since, 'until', v_until),
    'summary', jsonb_build_object(
      'cards_total', (select count(*) from public.studio_cards where created_at between v_since and v_until),
      'cards_published', (select count(*) from public.studio_cards where published_at between v_since and v_until and status = 'published'),
      'events_total', (select count(*) from public.studio_events where created_at between v_since and v_until),
      'generations', (select count(*) from public.studio_events where created_at between v_since and v_until and event_name = 'generation_started'),
      'successful_generations', (select count(*) from public.studio_events where created_at between v_since and v_until and event_name = 'generation_completed'),
      'failed_generations', (select count(*) from public.studio_events where created_at between v_since and v_until and event_name = 'generation_failed'),
      'exports', (select count(*) from public.studio_events where created_at between v_since and v_until and event_name = 'export_completed'),
      'emails_sent', (select count(*) from public.studio_events where created_at between v_since and v_until and event_name = 'email_sent'),
      'emails_failed', (select count(*) from public.studio_events where created_at between v_since and v_until and event_name = 'email_failed'),
      'digital_views', (select count(*) from public.studio_events where created_at between v_since and v_until and event_name = 'digital_card_view'),
      'digital_shares', (select count(*) from public.studio_events where created_at between v_since and v_until and event_name = 'digital_card_share'),
      'ai_requests', (select count(*) from public.studio_events where created_at between v_since and v_until and event_name = 'ai_request'),
      'ai_successes', (select count(*) from public.studio_events where created_at between v_since and v_until and event_name = 'ai_success'),
      'ai_failures', (select count(*) from public.studio_events where created_at between v_since and v_until and event_name = 'ai_failed')
    ),
    'timeline', coalesce((
      select jsonb_agg(jsonb_build_object(
        'day', d.day::date,
        'events', coalesce(e.events, 0),
        'generations', coalesce(e.generations, 0),
        'exports', coalesce(e.exports, 0),
        'emails', coalesce(e.emails, 0),
        'views', coalesce(e.views, 0),
        'ai', coalesce(e.ai, 0)
      ) order by d.day)
      from generate_series(date_trunc('day', v_since), date_trunc('day', v_until), interval '1 day') as d(day)
      left join (
        select date_trunc('day', created_at) day,
          count(*) events,
          count(*) filter (where event_name = 'generation_completed') generations,
          count(*) filter (where event_name = 'export_completed') exports,
          count(*) filter (where event_name = 'email_sent') emails,
          count(*) filter (where event_name = 'digital_card_view') views,
          count(*) filter (where event_name = 'ai_success') ai
        from public.studio_events
        where created_at between v_since and v_until
        group by 1
      ) e using (day)
    ), '[]'::jsonb),
    'generation', jsonb_build_object(
      'providers', coalesce((select jsonb_agg(jsonb_build_object('provider', coalesce(provider, 'unknown'), 'completed', count(*)) order by count(*) desc) from public.studio_events where created_at between v_since and v_until and event_name = 'generation_completed' group by provider), '[]'::jsonb),
      'average_duration_ms', (select coalesce(round(avg(duration_ms))::int, 0) from public.studio_events where created_at between v_since and v_until and event_name = 'generation_completed' and duration_ms is not null)
    ),
    'exports_by_format', coalesce((select jsonb_agg(jsonb_build_object('format', coalesce(export_format, 'unknown'), 'count', count(*)) order by count(*) desc) from public.studio_events where created_at between v_since and v_until and event_name = 'export_completed' group by export_format), '[]'::jsonb),
    'email', jsonb_build_object(
      'sent', (select count(*) from public.studio_events where created_at between v_since and v_until and event_name = 'email_sent'),
      'failed', (select count(*) from public.studio_events where created_at between v_since and v_until and event_name = 'email_failed'),
      'average_duration_ms', (select coalesce(round(avg(duration_ms))::int, 0) from public.studio_events where created_at between v_since and v_until and event_name = 'email_sent' and duration_ms is not null)
    ),
    'digital_card', coalesce((select jsonb_agg(jsonb_build_object('event', event_name, 'count', count(*)) order by count(*) desc) from public.studio_events where created_at between v_since and v_until and event_name in ('digital_card_view','digital_card_share','digital_card_save_contact','digital_card_email_click','digital_card_phone_click','digital_card_website_click') group by event_name), '[]'::jsonb),
    'ai', jsonb_build_object(
      'providers', coalesce((select jsonb_agg(jsonb_build_object('provider', coalesce(provider, 'unknown'), 'requests', count(*)) order by count(*) desc) from public.studio_events where created_at between v_since and v_until and event_name = 'ai_success' group by provider), '[]'::jsonb),
      'success_rate', case when (select count(*) from public.studio_events where created_at between v_since and v_until and event_name = 'ai_request') = 0 then 0 else round(100.0 * (select count(*) from public.studio_events where created_at between v_since and v_until and event_name = 'ai_success') / (select count(*) from public.studio_events where created_at between v_since and v_until and event_name = 'ai_request'), 1) end
    ),
    'library', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id,
        'name', c.name,
        'role', c.role,
        'company', c.company,
        'email', c.email,
        'status', c.status,
        'public_enabled', coalesce(c.public_enabled, false),
        'share_token', c.share_token,
        'created_at', c.created_at,
        'updated_at', c.updated_at,
        'published_at', c.published_at,
        'views', coalesce(ev.views, 0),
        'shares', coalesce(ev.shares, 0),
        'exports', coalesce(ev.exports, 0),
        'emails', coalesce(ev.emails, 0)
      ) order by c.updated_at desc)
      from (
        select * from public.studio_cards order by updated_at desc limit 100
      ) c
      left join (
        select card_id,
          count(*) filter (where event_name = 'digital_card_view') views,
          count(*) filter (where event_name = 'digital_card_share') shares,
          count(*) filter (where event_name = 'export_completed') exports,
          count(*) filter (where event_name = 'email_sent') emails
        from public.studio_events
        where created_at between v_since and v_until and card_id is not null
        group by card_id
      ) ev on ev.card_id = c.id
    ), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.studio_admin_dashboard(timestamptz, timestamptz) from public, anon;
grant execute on function public.studio_admin_dashboard(timestamptz, timestamptz) to authenticated;

comment on table public.studio_events is 'Server-mediated Studio telemetry used by the protected Admin analytics workspace.';
comment on function public.studio_admin_dashboard(timestamptz, timestamptz) is 'Returns bounded aggregate Studio analytics and the latest card library for administrators only.';
