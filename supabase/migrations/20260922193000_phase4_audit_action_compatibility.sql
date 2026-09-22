-- Phase 4 audit compatibility fix.
CREATE OR REPLACE FUNCTION public.capture_admin_audit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  before_row jsonb;
  after_row jsonb;
  entity_id_text text;
  entity_label text;
  actor_email_text text;
  action_text text;
BEGIN
  IF auth.uid() IS NULL OR NOT public.is_admin() THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  before_row := CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE to_jsonb(OLD) END;
  after_row := CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END;
  action_text := CASE TG_OP
    WHEN 'INSERT' THEN 'create'
    WHEN 'UPDATE' THEN 'update'
    WHEN 'DELETE' THEN 'delete'
    ELSE lower(TG_OP)
  END;

  IF TG_TABLE_NAME = 'site_settings' THEN
    entity_id_text := COALESCE(after_row ->> 'key', before_row ->> 'key');
  ELSE
    entity_id_text := COALESCE(after_row ->> 'id', before_row ->> 'id');
  END IF;

  entity_label := COALESCE(
    after_row ->> 'title',
    before_row ->> 'title',
    after_row ->> 'name',
    before_row ->> 'name',
    after_row ->> 'label',
    before_row ->> 'label',
    after_row ->> 'key',
    before_row ->> 'key',
    entity_id_text
  );

  SELECT u.email
  INTO actor_email_text
  FROM public.admin_users u
  WHERE u.user_id = auth.uid()
  LIMIT 1;

  INSERT INTO public.admin_audit_log (
    actor_user_id,actor_email,action,entity_type,entity_id,entity_label,
    before_data,after_data,metadata
  )
  VALUES (
    auth.uid(),actor_email_text,action_text,TG_TABLE_NAME,coalesce(entity_id_text,''),
    entity_label,before_row,after_row,jsonb_build_object('source','database_trigger')
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

REVOKE ALL ON FUNCTION public.capture_admin_audit() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.capture_admin_audit() FROM anon;
REVOKE EXECUTE ON FUNCTION public.capture_admin_audit() FROM authenticated;