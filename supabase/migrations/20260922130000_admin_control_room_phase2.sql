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
