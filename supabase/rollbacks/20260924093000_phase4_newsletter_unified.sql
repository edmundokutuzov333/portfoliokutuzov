-- Reversal for 20260924090000_phase4_newsletter.sql

DELETE FROM public.newsletter_subscribers
WHERE migrated_from_studio_waitlist = true;

DROP INDEX IF EXISTS public.idx_newsletter_confirmation_hash;

ALTER TABLE public.newsletter_subscribers
  DROP COLUMN IF EXISTS confirmed_at,
  DROP COLUMN IF EXISTS confirmation_token_hash,
  DROP COLUMN IF EXISTS confirmation_expires_at,
  DROP COLUMN IF EXISTS migrated_from_studio_waitlist;

-- Restore the previous public INSERT contract only when explicitly required
-- to return to the pre-Phase-4 schema. The Phase 4 application code must not
-- be run against this reverted policy.
CREATE POLICY "anyone can subscribe"
  ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
