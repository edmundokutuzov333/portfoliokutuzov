-- Phase 4 final hardening.
-- Unique migration version after the complete Control Room chain.

CREATE OR REPLACE FUNCTION public.admin_system_health_db()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path=public,pg_catalog
AS $$
DECLARE
  realtime_count integer;
  history_count bigint;
  audit_count bigint;
  storage_ready boolean;
BEGIN
  IF auth.uid() IS NULL OR NOT public.admin_has_permission('system.audit.read') THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501';
  END IF;

  SELECT count(*)::integer INTO realtime_count
  FROM pg_publication_tables
  WHERE pubname='supabase_realtime' AND schemaname='public'
    AND tablename IN (
      'site_settings','clients','projects','services','stats','about_method',
      'media_assets','admin_drafts',
      'contact_requests','briefing_submissions','booking_requests',
      'newsletter_subscribers','studio_waitlist','crm_leads','crm_activities',
      'crm_tasks','crm_payments'
    );

  SELECT count(*) INTO history_count FROM public.content_history;
  SELECT count(*) INTO audit_count FROM public.admin_audit_log;
  SELECT EXISTS(SELECT 1 FROM storage.buckets WHERE id='site-assets') INTO storage_ready;

  RETURN jsonb_build_object(
    'database',jsonb_build_object('status','healthy','postgres_version',current_setting('server_version')),
    'realtime',jsonb_build_object('status',CASE WHEN realtime_count >= 17 THEN 'healthy' ELSE 'warning' END,'subscribed_tables',realtime_count,'expected_tables',17),
    'storage',jsonb_build_object('status',CASE WHEN storage_ready THEN 'healthy' ELSE 'error' END,'bucket','site-assets'),
    'audit',jsonb_build_object('status',CASE WHEN audit_count > 0 THEN 'healthy' ELSE 'warning' END,'events',audit_count),
    'versioning',jsonb_build_object('status',CASE WHEN history_count > 0 THEN 'healthy' ELSE 'warning' END,'versions',history_count)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_system_health_db() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_system_health_db() TO authenticated;

DROP POLICY IF EXISTS "admins read admin drafts" ON public.admin_drafts;
CREATE POLICY "admins read admin drafts" ON public.admin_drafts FOR SELECT TO authenticated
USING (
  public.admin_has_permission('content.read')
  AND (entity_type <> 'site_settings' OR entity_id <> 'invoice_settings' OR public.admin_has_permission('finance.read'))
);

DROP POLICY IF EXISTS "admins insert admin drafts" ON public.admin_drafts;
CREATE POLICY "admins insert admin drafts" ON public.admin_drafts FOR INSERT TO authenticated
WITH CHECK (
  public.admin_has_permission('content.write')
  AND (entity_type <> 'site_settings' OR entity_id <> 'invoice_settings' OR public.admin_has_permission('finance.write'))
);

DROP POLICY IF EXISTS "admins update admin drafts" ON public.admin_drafts;
CREATE POLICY "admins update admin drafts" ON public.admin_drafts FOR UPDATE TO authenticated
USING (
  public.admin_has_permission('content.write')
  AND (entity_type <> 'site_settings' OR entity_id <> 'invoice_settings' OR public.admin_has_permission('finance.write'))
)
WITH CHECK (
  public.admin_has_permission('content.write')
  AND (entity_type <> 'site_settings' OR entity_id <> 'invoice_settings' OR public.admin_has_permission('finance.write'))
);

DROP POLICY IF EXISTS "admins delete admin drafts" ON public.admin_drafts;
CREATE POLICY "admins delete admin drafts" ON public.admin_drafts FOR DELETE TO authenticated
USING (
  public.admin_has_permission('content.write')
  AND (entity_type <> 'site_settings' OR entity_id <> 'invoice_settings' OR public.admin_has_permission('finance.write'))
);

CREATE OR REPLACE FUNCTION public.admin_editable_entity_directory()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path=public,pg_catalog
AS $$
DECLARE
  finance_read boolean;
BEGIN
  IF auth.uid() IS NULL OR NOT public.admin_has_permission('content.read') THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501';
  END IF;
  finance_read := public.admin_has_permission('finance.read');

  RETURN jsonb_build_object(
    'site_settings',COALESCE((
      SELECT jsonb_agg(jsonb_build_object('id',key,'label',COALESCE(value->>'title',key),'meta','setting') ORDER BY key)
      FROM public.site_settings WHERE key <> 'invoice_settings' OR finance_read
    ),'[]'::jsonb),
    'projects',COALESCE((
      SELECT jsonb_agg(jsonb_build_object('id',id::text,'label',title,'meta',COALESCE(client_name,'') || ' · ' || category) ORDER BY sort_order,title)
      FROM public.projects
    ),'[]'::jsonb),
    'clients',COALESCE((
      SELECT jsonb_agg(jsonb_build_object('id',id::text,'label',name,'meta',kind) ORDER BY sort_order,name)
      FROM public.clients
    ),'[]'::jsonb),
    'services',COALESCE((
      SELECT jsonb_agg(jsonb_build_object('id',id::text,'label',title,'meta',COALESCE(number,'')) ORDER BY sort_order,title)
      FROM public.services
    ),'[]'::jsonb),
    'stats',COALESCE((
      SELECT jsonb_agg(jsonb_build_object('id',id::text,'label',label,'meta',value) ORDER BY sort_order,label)
      FROM public.stats
    ),'[]'::jsonb),
    'about_method',COALESCE((
      SELECT jsonb_agg(jsonb_build_object('id',id::text,'label',title,'meta',COALESCE(number,'')) ORDER BY sort_order,title)
      FROM public.about_method
    ),'[]'::jsonb)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_editable_entity_directory() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_editable_entity_directory() TO authenticated;