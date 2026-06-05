
-- 1. Stop publishing PII tables over Realtime
ALTER PUBLICATION supabase_realtime DROP TABLE public.booking_requests;
ALTER PUBLICATION supabase_realtime DROP TABLE public.briefing_submissions;
ALTER PUBLICATION supabase_realtime DROP TABLE public.newsletter_subscribers;

-- 2. Revoke EXECUTE on internal trigger-only SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.prune_content_history() FROM PUBLIC, anon, authenticated;
