-- Homepage control structure: safe default seed for admin-controlled section order/visibility.
-- This is additive: an existing custom configuration is never overwritten.

INSERT INTO public.site_settings (key, value)
VALUES (
  'homepage_structure',
  '{
    "sections": [
      {"id":"hero","label":"Hero","visible":true,"order":1},
      {"id":"manifesto","label":"Manifesto","visible":true,"order":2},
      {"id":"services","label":"Services","visible":true,"order":3},
      {"id":"clients","label":"Clients","visible":true,"order":4},
      {"id":"featured","label":"Featured Work","visible":true,"order":5},
      {"id":"experience","label":"Experience / Numbers","visible":true,"order":6},
      {"id":"cta","label":"CTA","visible":true,"order":7},
      {"id":"footer","label":"Footer (global)","visible":true,"order":8}
    ]
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

UPDATE public.site_settings
SET value = value || '{"title_3":"stay in memory,","cta_primary_route":"/portfolio","cta_secondary_route":"/contact"}'::jsonb
WHERE key = 'hero'
  AND NOT (value ? 'title_3');

UPDATE public.site_settings
SET value = value || '{"max_items":16}'::jsonb
WHERE key = 'clients_section'
  AND NOT (value ? 'max_items');

UPDATE public.site_settings
SET value = value || '{"cta_label":"View capabilities","cta_route":"/services","preview_limit":6}'::jsonb
WHERE key = 'services_section';

UPDATE public.site_settings
SET value = value || '{"cta_route":"/contact"}'::jsonb
WHERE key = 'cta_home';
