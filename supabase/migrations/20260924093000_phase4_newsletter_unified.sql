-- Phase 4: unified newsletter contract.
-- Schema is additive/reversible. This migration is NOT applied to production in this execution
-- because the Phase 1 backup gate remains BLOCKED-EXTERNAL.

ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS confirmation_token_hash text,
  ADD COLUMN IF NOT EXISTS confirmation_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS migrated_from_studio_waitlist boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_newsletter_confirmation_hash
  ON public.newsletter_subscribers (confirmation_token_hash)
  WHERE confirmation_token_hash IS NOT NULL;

DROP POLICY IF EXISTS "anyone can subscribe" ON public.newsletter_subscribers;

-- Existing Studio waitlist records are preserved by copying them into the unified
-- subscriber table with an explicit migration marker. The marker makes rollback safe.
INSERT INTO public.newsletter_subscribers (
  email,
  source,
  consent,
  is_active,
  confirmed_at,
  migrated_from_studio_waitlist,
  created_at,
  updated_at
)
SELECT
  sw.email,
  'studio',
  true,
  true,
  NULL,
  true,
  sw.created_at,
  now()
FROM public.studio_waitlist AS sw
WHERE NOT EXISTS (
  SELECT 1
  FROM public.newsletter_subscribers AS ns
  WHERE lower(ns.email) = lower(sw.email)
);

COMMENT ON COLUMN public.newsletter_subscribers.confirmed_at IS
  'Timestamp of explicit double-opt-in confirmation. Null until the link is confirmed.';

COMMENT ON COLUMN public.newsletter_subscribers.confirmation_token_hash IS
  'Server-only SHA-256 hash of the single-use confirmation token.';

COMMENT ON COLUMN public.newsletter_subscribers.confirmation_expires_at IS
  'Expiration for the single-use confirmation token.';

COMMENT ON COLUMN public.newsletter_subscribers.migrated_from_studio_waitlist IS
  'Marks rows copied from studio_waitlist so the data migration is reversible.';

-- A server function using the service role performs inserts/updates.
-- No public INSERT policy is re-added.
