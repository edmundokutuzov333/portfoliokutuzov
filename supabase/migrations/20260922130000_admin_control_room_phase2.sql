-- Phase 2: Full Website CMS
-- Website content control, structured services/credentials management,
-- navigation, global/SEO settings and a persistent media library.

-- ---------------------------------------------------------------------------
-- Media Library
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text UNIQUE NOT NULL,
  public_url text NOT NULL,
  filename text NOT NULL,
  mime_type text NOT NULL,
  width integer,
  height integer,
  size_bytes bigint NOT NULL CHECK (size_bytes > 0),
  kind text NOT NULL CHECK (kind IN ('image','video','logo','document')),
  alt_text text,
  entity_type text,
  entity_id text,
  is_public boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.media_assets TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;

DROP POLICY IF EXISTS "public read media assets" ON public.media_assets;
CREATE POLICY "public read media assets"
ON public.media_assets
FOR SELECT
TO anon, authenticated
USING (is_public = true);

DROP POLICY IF EXISTS "admins read private media assets" ON public.media_assets;
CREATE POLICY "admins read private media assets"
ON public.media_assets
FOR SELECT
TO authenticated
USING (public.admin_has_permission('media.manage'));

DROP POLICY IF EXISTS "admins manage media assets" ON public.media_assets;
CREATE POLICY "admins manage media assets"
ON public.media_assets
FOR ALL
TO authenticated
USING (public.admin_has_permission('media.manage'))
WITH CHECK (public.admin_has_permission('media.manage'));

DROP TRIGGER IF EXISTS trg_media_assets_updated ON public.media_assets;
CREATE TRIGGER trg_media_assets_updated
BEFORE UPDATE ON public.media_assets
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_media_assets_kind_created
  ON public.media_assets (kind, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_assets_entity
  ON public.media_assets (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_unused
  ON public.media_assets (created_at DESC)
  WHERE entity_id IS NULL;

-- Phase 1 audit trigger is reused for this new administrative entity.
DROP TRIGGER IF EXISTS trg_admin_audit_media_assets ON public.media_assets;
CREATE TRIGGER trg_admin_audit_media_assets
AFTER INSERT OR UPDATE OR DELETE ON public.media_assets
FOR EACH ROW EXECUTE FUNCTION public.capture_admin_audit();

-- Make the existing public bucket expose library assets as well.
DROP POLICY IF EXISTS "public read site-assets files" ON storage.objects;
CREATE POLICY "public read site-assets files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'site-assets'
  AND (storage.foldername(name))[1] IN ('logos','projects','gallery','misc','library')
);

-- ---------------------------------------------------------------------------
-- Transactional ordering for structured content
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.admin_reorder_services(p_ids uuid[])
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_catalog
AS $$
BEGIN
  IF NOT public.admin_has_permission('content.write') THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501';
  END IF;

  IF coalesce(array_length(p_ids, 1), 0) = 0 THEN
    RETURN true;
  END IF;

  UPDATE public.services
  SET sort_order = ranked.position
  FROM (
    SELECT id, row_number() OVER (ORDER BY ordinal)::integer AS position
    FROM unnest(p_ids) WITH ORDINALITY AS input(id, ordinal)
    ORDER BY ordinal
  ) ranked
  WHERE public.services.id = ranked.id;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_reorder_services(uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_reorder_services(uuid[]) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_reorder_stats(p_ids uuid[])
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_catalog
AS $$
BEGIN
  IF NOT public.admin_has_permission('content.write') THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501';
  END IF;

  IF coalesce(array_length(p_ids, 1), 0) = 0 THEN
    RETURN true;
  END IF;

  UPDATE public.stats
  SET sort_order = ranked.position
  FROM (
    SELECT id, row_number() OVER ()::integer AS position
    FROM unnest(p_ids) WITH ORDINALITY AS input(id, ordinal)
    ORDER BY ordinal
  ) ranked
  WHERE public.stats.id = ranked.id;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_reorder_stats(uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_reorder_stats(uuid[]) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_reorder_about_method(p_ids uuid[])
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_catalog
AS $$
BEGIN
  IF NOT public.admin_has_permission('content.write') THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501';
  END IF;

  IF coalesce(array_length(p_ids, 1), 0) = 0 THEN
    RETURN true;
  END IF;

  UPDATE public.about_method
  SET sort_order = ranked.position
  FROM (
    SELECT id, row_number() OVER ()::integer AS position
    FROM unnest(p_ids) WITH ORDINALITY AS input(id, ordinal)
    ORDER BY ordinal
  ) ranked
  WHERE public.about_method.id = ranked.id;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_reorder_about_method(uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_reorder_about_method(uuid[]) TO authenticated;

-- Ensure structured content is present in Realtime even on databases where
-- the base migration was applied by a different deployment path.
DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'media_assets',
    'services',
    'stats',
    'about_method'
  ]
  LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = table_name
    ) THEN
      EXECUTE format(
        'ALTER PUBLICATION supabase_realtime ADD TABLE public.%I',
        table_name
      );
    END IF;
  END LOOP;
END
$$;


-- ---------------------------------------------------------------------------
-- CMS baseline settings
-- ---------------------------------------------------------------------------
-- Seed only missing keys. Existing editorial data is never overwritten.
INSERT INTO public.site_settings (key, value)
VALUES
  ('featured_section', '{"eyebrow":"Featured work","title":"Selected projects.","subtitle":"A handful of recent pieces hand-picked from the studio."}'::jsonb),
  ('credentials', '{"reference":"GOD","cards":[{"value":"6+","label":"Years of experience"},{"value":"150+","label":"Projects delivered"},{"value":"30+","label":"National and international brands"},{"value":"3","label":"Continents"},{"value":"360º","label":"Art direction, branding, strategy, AI, marketing"}],"skills":[{"name":"Adobe Photoshop","value":95},{"name":"Adobe Illustrator","value":75},{"name":"Adobe Premiere","value":75},{"name":"Adobe After Effects","value":45},{"name":"Artificial Intelligence","value":95}]}'::jsonb),
  ('global', '{"site_name":"Edmundo Kutuzov","seo_title":"Edmundo Kutuzov - Designer & Art Director","meta_description":"Visual identities, art direction and digital experiences built with strategic clarity and technical precision.","og_title":"Edmundo Kutuzov - Designer & Art Director","og_description":"Visual identities, art direction and digital experiences built with strategic clarity and technical precision.","og_image":"https://storage.googleapis.com/gpt-engineer-file-uploads/pHZRYs3DGCdOPGZzeAdkZH1MMif2/social-images/social-1778488549600-EKLOGO.webp","favicon_url":"/favicon.webp","email":"contact@edmundokutuzov.art","phone":"+258 87 601 312 1","location":"Magoanine C, Maputo · Mozambique","copyright":"Edmundo Kutuzov. All rights reserved. The only one.","studio_visible":true,"newsletter_enabled":true,"analytics_enabled":true}'::jsonb),
  ('navigation', '{"items":[{"id":"home","label":"Home","route":"/","order":1,"visible":true,"external":false,"cta":false},{"id":"portfolio","label":"Portfolio","route":"/portfolio","order":2,"visible":true,"external":false,"cta":false},{"id":"credentials","label":"Credentials","route":"/credentials","order":3,"visible":true,"external":false,"cta":false},{"id":"services","label":"Services","route":"/services","order":4,"visible":true,"external":false,"cta":false},{"id":"contact","label":"Contact","route":"/contact","order":5,"visible":true,"external":false,"cta":false},{"id":"studio","label":"Kutuzov Studio","route":"/studio","order":6,"visible":true,"external":false,"cta":false},{"id":"start-project","label":"Start a project","route":"/contact","order":7,"visible":true,"external":false,"cta":true}]}'::jsonb),
  ('seo_global', '{"title":"Edmundo Kutuzov - Designer & Art Director","description":"Visual identities, art direction and digital experiences built with strategic clarity and technical precision.","og_title":"Edmundo Kutuzov - Designer & Art Director","og_description":"Visual identities, art direction and digital experiences built with strategic clarity and technical precision.","og_image":"https://storage.googleapis.com/gpt-engineer-file-uploads/pHZRYs3DGCdOPGZzeAdkZH1MMif2/social-images/social-1778488549600-EKLOGO.webp","twitter_card":"summary_large_image","canonical_base":"https://edmundokutuzov.art","robots_meta":"index,follow,max-image-preview:large","sitemap_enabled":true}'::jsonb),
  ('seo_pages', '{"pages":{"/":{"title":"Edmundo Kutuzov - Art Director","description":"Edmundo Kutuzov is an art director based in Maputo, Mozambique. Visual identities, art direction and campaign design for brands that want to be remembered.","canonical":"/","og_image":"https://storage.googleapis.com/gpt-engineer-file-uploads/pHZRYs3DGCdOPGZzeAdkZH1MMif2/social-images/social-1778488549600-EKLOGO.webp"},"/portfolio":{"title":"Portfolio - Edmundo Kutuzov","description":"Selected art direction, brand identity and campaign work by Edmundo Kutuzov, art director based in Maputo, Mozambique.","canonical":"/portfolio","og_image":"https://storage.googleapis.com/gpt-engineer-file-uploads/pHZRYs3DGCdOPGZzeAdkZH1MMif2/social-images/social-1778488549600-EKLOGO.webp"},"/services":{"title":"Capabilities - Edmundo Kutuzov","description":"Capabilities and visual disciplines: art direction, brand identity, campaign design, and digital systems by Edmundo Kutuzov.","canonical":"/services","og_image":"https://storage.googleapis.com/gpt-engineer-file-uploads/pHZRYs3DGCdOPGZzeAdkZH1MMif2/social-images/social-1778488549600-EKLOGO.webp"},"/credentials":{"title":"The Credentials - Edmundo Kutuzov","description":"Experience, skills and selected brands worked with as art director and graphic designer by Edmundo Kutuzov.","canonical":"/credentials","og_image":"https://storage.googleapis.com/gpt-engineer-file-uploads/pHZRYs3DGCdOPGZzeAdkZH1MMif2/social-images/social-1778488549600-EKLOGO.webp"},"/contact":{"title":"Contact - Edmundo Kutuzov","description":"Smart project briefing for new collaborations with Edmundo Kutuzov, art director in Maputo.","canonical":"/contact","og_image":"https://storage.googleapis.com/gpt-engineer-file-uploads/pHZRYs3DGCdOPGZzeAdkZH1MMif2/social-images/social-1778488549600-EKLOGO.webp"}}}'::jsonb)
ON CONFLICT (key) DO NOTHING;


-- ---------------------------------------------------------------------------
-- Existing site-assets registry backfill
-- ---------------------------------------------------------------------------
-- Register local assets already referenced by public entities. External URLs
-- remain untouched because their physical storage lifecycle is outside this bucket.
INSERT INTO public.media_assets (
  storage_path, public_url, filename, mime_type, kind, entity_type, entity_id, is_public
)
SELECT DISTINCT
  regexp_replace(p.cover_url, '^.*/storage/v1/object/public/site-assets/', '') AS storage_path,
  p.cover_url,
  split_part(regexp_replace(p.cover_url, '^.*/', ''), '?', 1) AS filename,
  'image/*',
  'image',
  'project',
  p.id::text,
  true
FROM public.projects p
WHERE p.cover_url LIKE '%/storage/v1/object/public/site-assets/%'
ON CONFLICT (storage_path) DO NOTHING;

INSERT INTO public.media_assets (
  storage_path, public_url, filename, mime_type, kind, entity_type, entity_id, is_public
)
SELECT DISTINCT
  regexp_replace(c.logo_url, '^.*/storage/v1/object/public/site-assets/', '') AS storage_path,
  c.logo_url,
  split_part(regexp_replace(c.logo_url, '^.*/', ''), '?', 1) AS filename,
  'image/*',
  'logo',
  'client',
  c.id::text,
  true
FROM public.clients c
WHERE c.logo_url LIKE '%/storage/v1/object/public/site-assets/%'
ON CONFLICT (storage_path) DO NOTHING;

INSERT INTO public.media_assets (
  storage_path, public_url, filename, mime_type, kind, entity_type, entity_id, is_public
)
SELECT DISTINCT
  regexp_replace(g.url, '^.*/storage/v1/object/public/site-assets/', '') AS storage_path,
  g.url,
  split_part(regexp_replace(g.url, '^.*/', ''), '?', 1) AS filename,
  'image/*',
  'image',
  'project',
  p.id::text,
  true
FROM public.projects p
CROSS JOIN LATERAL jsonb_array_elements_text(COALESCE(p.gallery, '[]'::jsonb)) AS g(url)
WHERE g.url LIKE '%/storage/v1/object/public/site-assets/%'
ON CONFLICT (storage_path) DO NOTHING;

INSERT INTO public.media_assets (
  storage_path, public_url, filename, mime_type, kind, entity_type, entity_id, is_public
)
SELECT DISTINCT
  regexp_replace(p.video_url, '^.*/storage/v1/object/public/site-assets/', '') AS storage_path,
  p.video_url,
  split_part(regexp_replace(p.video_url, '^.*/', ''), '?', 1) AS filename,
  'video/*',
  'video',
  'project',
  p.id::text,
  true
FROM public.projects p
WHERE p.video_url LIKE '%/storage/v1/object/public/site-assets/%'
ON CONFLICT (storage_path) DO NOTHING;
