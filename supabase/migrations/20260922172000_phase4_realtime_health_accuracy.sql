-- Historical ordering guard.
-- The actual Phase 4 realtime health hardening is applied by the post-release
-- hardening migration after the Control Room schema exists.
DO $$ BEGIN NULL; END $$;