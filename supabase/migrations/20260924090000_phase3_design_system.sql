-- Phase 3: additive Work Colour infrastructure.
-- This migration is intentionally not applied to production in this execution.
-- The Phase 1 reversible backup gate remains BLOCKED-EXTERNAL.
-- Existing rows remain untouched until the migration is explicitly applied.

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS dominant_color text,
  ADD COLUMN IF NOT EXISTS accent_color text;

COMMENT ON COLUMN public.projects.dominant_color IS
  'Computed dominant work colour used by Betao & Cor. Nullable by design.';

COMMENT ON COLUMN public.projects.accent_color IS
  'Manual work-colour override used by Betao & Cor. Nullable by design.';

CREATE INDEX IF NOT EXISTS idx_projects_dominant_color
  ON public.projects (dominant_color)
  WHERE dominant_color IS NOT NULL;

-- reel_items is introduced in Phase 6. Its dominant_color/accent_color fields
-- belong to that migration so schema ownership stays deterministic.
