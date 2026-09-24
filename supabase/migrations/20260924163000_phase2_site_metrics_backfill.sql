-- Phase 2: backfill canonical site_metrics from existing production-truth credentials cards.
-- No new public content is invented. The five values already live in site_settings.credentials.cards.

insert into public.site_metrics (
  metric_key,
  value,
  label,
  sort_order,
  is_active
)
select
  'credential-card-' || row_number() over (order by ordinality),
  nullif(trim(card->>'value'), ''),
  nullif(trim(card->>'label'), ''),
  ordinality::integer - 1,
  true
from public.site_settings s
cross join lateral jsonb_array_elements(coalesce(s.value->'cards', '[]'::jsonb))
  with ordinality as cards(card, ordinality)
where s.key = 'credentials'
  and nullif(trim(card->>'value'), '') is not null
  and nullif(trim(card->>'label'), '') is not null
on conflict (metric_key) do update set
  value = excluded.value,
  label = excluded.label,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();
