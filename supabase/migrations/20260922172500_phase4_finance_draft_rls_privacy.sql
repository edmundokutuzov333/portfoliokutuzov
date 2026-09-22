-- Phase 4 finance draft privacy: enforce finance ownership at the database boundary.
DROP POLICY IF EXISTS "admins read admin drafts" ON public.admin_drafts;
CREATE POLICY "admins read admin drafts"
ON public.admin_drafts FOR SELECT TO authenticated
USING (
  public.admin_has_permission('content.read')
  AND (
    entity_type <> 'site_settings'
    OR entity_id <> 'invoice_settings'
    OR public.admin_has_permission('finance.read')
  )
);

DROP POLICY IF EXISTS "admins insert admin drafts" ON public.admin_drafts;
CREATE POLICY "admins insert admin drafts"
ON public.admin_drafts FOR INSERT TO authenticated
WITH CHECK (
  public.admin_has_permission('content.write')
  AND (
    entity_type <> 'site_settings'
    OR entity_id <> 'invoice_settings'
    OR public.admin_has_permission('finance.write')
  )
);

DROP POLICY IF EXISTS "admins update admin drafts" ON public.admin_drafts;
CREATE POLICY "admins update admin drafts"
ON public.admin_drafts FOR UPDATE TO authenticated
USING (
  public.admin_has_permission('content.write')
  AND (
    entity_type <> 'site_settings'
    OR entity_id <> 'invoice_settings'
    OR public.admin_has_permission('finance.write')
  )
)
WITH CHECK (
  public.admin_has_permission('content.write')
  AND (
    entity_type <> 'site_settings'
    OR entity_id <> 'invoice_settings'
    OR public.admin_has_permission('finance.write')
  )
);

DROP POLICY IF EXISTS "admins delete admin drafts" ON public.admin_drafts;
CREATE POLICY "admins delete admin drafts"
ON public.admin_drafts FOR DELETE TO authenticated
USING (
  public.admin_has_permission('content.write')
  AND (
    entity_type <> 'site_settings'
    OR entity_id <> 'invoice_settings'
    OR public.admin_has_permission('finance.write')
  )
);

CREATE OR REPLACE FUNCTION public.admin_editable_entity_directory()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_catalog
AS $$
DECLARE
  result jsonb;
  finance_read boolean;
BEGIN
  IF auth.uid() IS NULL OR NOT public.admin_has_permission('content.read') THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501';
  END IF;

  finance_read := public.admin_has_permission('finance.read');

  result := jsonb_build_object(
    'site_settings', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', key, 'label', COALESCE(value->>'title', key), 'meta', 'setting'
      ) ORDER BY key)
      FROM public.site_settings
      WHERE key <> 'invoice_settings' OR finance_read
    ), '[]'::jsonb),
    'projects', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', id::text, 'label', title, 'meta', COALESCE(client_name,'') || ' · ' || category
      ) ORDER BY sort_order, title)
      FROM public.projects
    ), '[]'::jsonb),
    'clients', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', id::text, 'label', name, 'meta', kind
      ) ORDER BY sort_order, name)
      FROM public.clients
    ), '[]'::jsonb),
    'services', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', id::text, 'label', title, 'meta', COALESCE(number,'')
      ) ORDER BY sort_order, title)
      FROM public.services
    ), '[]'::jsonb),
    'stats', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', id::text, 'label', label, 'meta', value
      ) ORDER BY sort_order, label)
      FROM public.stats
    ), '[]'::jsonb),
    'about_method', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', id::text, 'label', title, 'meta', COALESCE(number,'')
      ) ORDER BY sort_order, title)
      FROM public.about_method
    ), '[]'::jsonb)
  );

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_editable_entity_directory() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_editable_entity_directory() TO authenticated;