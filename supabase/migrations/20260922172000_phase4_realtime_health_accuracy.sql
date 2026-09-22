-- Phase 4 health accuracy: Realtime coverage now includes the media
-- library and editorial draft layer introduced by Control Room 2.0.
CREATE OR REPLACE FUNCTION public.admin_system_health_db()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_catalog
AS $$
DECLARE
  realtime_count integer;
  history_count bigint;
  audit_count bigint;
  storage_ready boolean;
BEGIN
  IF auth.uid() IS NULL OR NOT public.admin_has_permission('system.audit.read') THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501';
  END IF;

  SELECT count(*)::integer INTO realtime_count
  FROM pg_publication_tables
  WHERE pubname='supabase_realtime'
    AND schemaname='public'
    AND tablename IN (
      'site_settings','clients','projects','services','stats','about_method',
      'media_assets','admin_drafts',
      'contact_requests','briefing_submissions','booking_requests',
      'newsletter_subscribers','studio_waitlist','crm_leads','crm_activities',
      'crm_tasks','crm_payments'
    );

  SELECT count(*) INTO history_count FROM public.content_history;
  SELECT count(*) INTO audit_count FROM public.admin_audit_log;
  SELECT EXISTS(
    SELECT 1 FROM storage.buckets WHERE id='site-assets'
  ) INTO storage_ready;

  RETURN jsonb_build_object(
    'database', jsonb_build_object(
      'status','healthy',
      'postgres_version',current_setting('server_version')
    ),
    'realtime', jsonb_build_object(
      'status',CASE WHEN realtime_count >= 17 THEN 'healthy' ELSE 'warning' END,
      'subscribed_tables',realtime_count,
      'expected_tables',17
    ),
    'storage', jsonb_build_object(
      'status',CASE WHEN storage_ready THEN 'healthy' ELSE 'error' END,
      'bucket','site-assets'
    ),
    'audit', jsonb_build_object(
      'status',CASE WHEN audit_count > 0 THEN 'healthy' ELSE 'warning' END,
      'events',audit_count
    ),
    'versioning', jsonb_build_object(
      'status',CASE WHEN history_count > 0 THEN 'healthy' ELSE 'warning' END,
      'versions',history_count
    )
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_system_health_db() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_system_health_db() TO authenticated;