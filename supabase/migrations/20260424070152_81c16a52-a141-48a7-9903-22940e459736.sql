ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS cover_width integer,
  ADD COLUMN IF NOT EXISTS cover_height integer,
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS client_name text,
  ADD COLUMN IF NOT EXISTS image_fit text NOT NULL DEFAULT 'contain';

ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS logo_width integer,
  ADD COLUMN IF NOT EXISTS logo_height integer;

CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_projects_sort ON public.projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_clients_sort ON public.clients(sort_order);