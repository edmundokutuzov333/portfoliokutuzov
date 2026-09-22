-- Phase 3 security/performance hardening.
-- Keep security-definer helpers available to authenticated sessions where the
-- application and triggers need them, but remove anonymous RPC execution.
REVOKE EXECUTE ON FUNCTION public.admin_get_role() FROM anon;
REVOKE EXECUTE ON FUNCTION public.admin_has_permission(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.admin_user_directory() FROM anon;
REVOKE EXECUTE ON FUNCTION public.capture_admin_audit() FROM anon;
REVOKE EXECUTE ON FUNCTION public.capture_admin_content_version() FROM anon;
REVOKE EXECUTE ON FUNCTION public.ensure_crm_lead_from_source() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.prevent_admin_audit_mutation() FROM anon;

CREATE OR REPLACE FUNCTION public.set_studio_card_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_actor_user_id
  ON public.admin_audit_log(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_client_id
  ON public.booking_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_owner_user_id
  ON public.booking_requests(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_actor_user_id
  ON public.crm_activities(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_owner_user_id
  ON public.crm_tasks(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_crm_payments_created_by
  ON public.crm_payments(created_by);
CREATE INDEX IF NOT EXISTS idx_media_assets_created_by
  ON public.media_assets(created_by);
CREATE INDEX IF NOT EXISTS idx_project_relations_related_project_id
  ON public.project_relations(related_project_id);