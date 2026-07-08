
ALTER TABLE public.briefing_submissions
  ADD COLUMN IF NOT EXISTS invoice_public_token text UNIQUE,
  ADD COLUMN IF NOT EXISTS invoice_viewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS invoice_paid_at timestamptz;

CREATE TABLE IF NOT EXISTS public.invoice_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  briefing_id uuid NOT NULL REFERENCES public.briefing_submissions(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  actor text,
  recipients text[],
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS invoice_events_briefing_idx
  ON public.invoice_events(briefing_id, created_at DESC);

GRANT SELECT, INSERT ON public.invoice_events TO authenticated;
GRANT ALL ON public.invoice_events TO service_role;

ALTER TABLE public.invoice_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read invoice events" ON public.invoice_events;
CREATE POLICY "Admins read invoice events"
  ON public.invoice_events FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins write invoice events" ON public.invoice_events;
CREATE POLICY "Admins write invoice events"
  ON public.invoice_events FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());
