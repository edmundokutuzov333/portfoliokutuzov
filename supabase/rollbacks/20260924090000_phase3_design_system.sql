-- Reversal for 20260924090000_phase3_design_system.sql
-- Do not run automatically. Apply only against the same schema version after
-- confirming the phase backup and database state.

DROP INDEX IF EXISTS public.idx_projects_dominant_color;

ALTER TABLE public.projects
  DROP COLUMN IF EXISTS dominant_color,
  DROP COLUMN IF EXISTS accent_color;
