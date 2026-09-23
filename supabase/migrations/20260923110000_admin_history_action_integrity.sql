-- Fix the version-history trigger so every new version has a canonical action.
-- Existing legacy rows remain marked as legacy because their original operation
-- cannot be reconstructed safely from the stored snapshot alone.

UPDATE public.content_history
SET action = 'legacy'
WHERE action IS NULL;

CREATE OR REPLACE FUNCTION public.capture_admin_content_version()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  payload jsonb;
  entity_id_text text;
  entity_label text;
  action_text text;
BEGIN
  IF auth.uid() IS NULL OR NOT public.is_admin() THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  IF TG_OP = 'DELETE' THEN
    payload := to_jsonb(OLD);
  ELSIF TG_OP = 'INSERT' THEN
    payload := to_jsonb(NEW);
  ELSE
    payload := to_jsonb(OLD);
  END IF;

  action_text := CASE TG_OP
    WHEN 'INSERT' THEN 'create'
    WHEN 'UPDATE' THEN 'update'
    WHEN 'DELETE' THEN 'delete'
    ELSE 'legacy'
  END;

  IF TG_TABLE_NAME = 'site_settings' THEN
    entity_id_text := payload ->> 'key';
  ELSE
    entity_id_text := payload ->> 'id';
  END IF;

  entity_label := COALESCE(
    payload ->> 'title',
    payload ->> 'name',
    payload ->> 'label',
    payload ->> 'key',
    entity_id_text
  );

  INSERT INTO public.content_history (
    entity_type,
    entity_id,
    snapshot,
    label,
    created_by,
    action
  )
  VALUES (
    TG_TABLE_NAME,
    COALESCE(entity_id_text, ''),
    payload,
    entity_label,
    auth.uid(),
    action_text
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

REVOKE ALL ON FUNCTION public.capture_admin_content_version() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.capture_admin_content_version() FROM anon;
REVOKE EXECUTE ON FUNCTION public.capture_admin_content_version() FROM authenticated;
