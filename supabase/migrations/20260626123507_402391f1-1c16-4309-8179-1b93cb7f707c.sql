-- Add slug column to projects for case-study URLs like /portfolio/:slug
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS slug text;

-- Helper to slugify a title (lowercase, ASCII-ish, hyphenated)
CREATE OR REPLACE FUNCTION public.slugify(input text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT trim(both '-' from
    regexp_replace(
      regexp_replace(lower(coalesce(input, '')), '[^a-z0-9]+', '-', 'g'),
      '-{2,}', '-', 'g'
    )
  );
$$;

-- Backfill slug from client_name or title, ensuring uniqueness
WITH base AS (
  SELECT id,
         public.slugify(coalesce(nullif(client_name, ''), title)) AS s,
         row_number() OVER (
           PARTITION BY public.slugify(coalesce(nullif(client_name, ''), title))
           ORDER BY sort_order, created_at
         ) AS rn
  FROM public.projects
  WHERE slug IS NULL OR slug = ''
)
UPDATE public.projects p
SET slug = CASE WHEN base.rn = 1 THEN base.s ELSE base.s || '-' || base.rn END
FROM base
WHERE p.id = base.id;

-- Auto-fill slug on insert/update when missing
CREATE OR REPLACE FUNCTION public.projects_set_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  candidate text;
  final text;
  n int := 1;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    candidate := public.slugify(coalesce(nullif(NEW.client_name, ''), NEW.title));
    IF candidate = '' THEN candidate := 'project'; END IF;
    final := candidate;
    WHILE EXISTS (SELECT 1 FROM public.projects WHERE slug = final AND id <> NEW.id) LOOP
      n := n + 1;
      final := candidate || '-' || n;
    END LOOP;
    NEW.slug := final;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_projects_set_slug ON public.projects;
CREATE TRIGGER trg_projects_set_slug
BEFORE INSERT OR UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.projects_set_slug();

-- Make slug unique once backfilled
ALTER TABLE public.projects
  ADD CONSTRAINT projects_slug_key UNIQUE (slug);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);