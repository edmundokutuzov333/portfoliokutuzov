-- Final Phase 4 advisor hardening.
REVOKE EXECUTE ON FUNCTION public.admin_publish_drafts(uuid[],text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.admin_restore_audit_state(text,text,jsonb,uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.admin_system_health_db() FROM anon;
REVOKE EXECUTE ON FUNCTION public.admin_editable_entity_directory() FROM anon;
REVOKE EXECUTE ON FUNCTION public.admin_user_directory() FROM anon;
REVOKE EXECUTE ON FUNCTION public.admin_has_permission(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.admin_get_role() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;

CREATE INDEX IF NOT EXISTS idx_admin_drafts_created_by
  ON public.admin_drafts(created_by);
CREATE INDEX IF NOT EXISTS idx_admin_drafts_updated_by
  ON public.admin_drafts(updated_by);
CREATE INDEX IF NOT EXISTS idx_admin_drafts_reviewed_by
  ON public.admin_drafts(reviewed_by);