
-- ============================================================================
-- Pass 2: Contact requests inbox + settings/projects/clients version history
-- ============================================================================

-- Contact requests inbox -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  project_type TEXT,
  budget_amount NUMERIC,
  budget_currency TEXT,
  budget_label TEXT,
  timeline TEXT,
  message TEXT NOT NULL,
  attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'new', -- new | read | replied | archived
  is_starred BOOLEAN NOT NULL DEFAULT false,
  admin_notes TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at
  ON public.contact_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status
  ON public.contact_requests (status);

ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) can submit a request
CREATE POLICY "anyone can submit contact request"
ON public.contact_requests
FOR INSERT
TO public
WITH CHECK (true);

-- Only admins can read / update / delete
CREATE POLICY "admins read contact_requests"
ON public.contact_requests
FOR SELECT
TO public
USING (public.is_admin());

CREATE POLICY "admins manage contact_requests"
ON public.contact_requests
FOR UPDATE
TO public
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "admins delete contact_requests"
ON public.contact_requests
FOR DELETE
TO public
USING (public.is_admin());

CREATE TRIGGER trg_contact_requests_updated_at
BEFORE UPDATE ON public.contact_requests
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Version history (last 5 per entity, kept by trigger pruning) ---------------
CREATE TABLE IF NOT EXISTS public.content_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL, -- 'site_settings' | 'projects' | 'clients'
  entity_id TEXT NOT NULL,   -- key for site_settings, uuid (text) for projects/clients
  snapshot JSONB NOT NULL,
  label TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_history_lookup
  ON public.content_history (entity_type, entity_id, created_at DESC);

ALTER TABLE public.content_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins read content_history"
ON public.content_history
FOR SELECT
TO public
USING (public.is_admin());

CREATE POLICY "admins write content_history"
ON public.content_history
FOR ALL
TO public
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Prune to last 5 versions per (entity_type, entity_id)
CREATE OR REPLACE FUNCTION public.prune_content_history()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.content_history
  WHERE id IN (
    SELECT id FROM (
      SELECT id, row_number() OVER (
        PARTITION BY entity_type, entity_id
        ORDER BY created_at DESC
      ) AS rn
      FROM public.content_history
      WHERE entity_type = NEW.entity_type AND entity_id = NEW.entity_id
    ) ranked
    WHERE ranked.rn > 5
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_prune_content_history
AFTER INSERT ON public.content_history
FOR EACH ROW EXECUTE FUNCTION public.prune_content_history();

-- Storage policies for the existing site-assets bucket (uploads from contact form)
-- The bucket is already public for reads; allow anonymous inserts limited to the
-- contact-uploads/ prefix. Admins can manage everything.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'public uploads to contact-uploads prefix'
  ) THEN
    CREATE POLICY "public uploads to contact-uploads prefix"
    ON storage.objects
    FOR INSERT
    TO public
    WITH CHECK (
      bucket_id = 'site-assets'
      AND (storage.foldername(name))[1] = 'contact-uploads'
    );
  END IF;
END $$;
