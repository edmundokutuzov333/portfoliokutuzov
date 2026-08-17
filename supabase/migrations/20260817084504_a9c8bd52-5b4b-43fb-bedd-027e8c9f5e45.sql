CREATE TABLE public.invoice_line_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  briefing_id uuid NOT NULL REFERENCES public.briefing_submissions(id) ON DELETE CASCADE,
  description text NOT NULL,
  detail text,
  qty numeric NOT NULL DEFAULT 1,
  unit text NOT NULL DEFAULT 'un',
  unit_price numeric NOT NULL DEFAULT 0,
  discount_pct numeric NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_line_items TO authenticated;
GRANT ALL ON public.invoice_line_items TO service_role;

ALTER TABLE public.invoice_line_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read invoice line items" ON public.invoice_line_items
  FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admins write invoice line items" ON public.invoice_line_items
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE INDEX invoice_line_items_briefing_idx ON public.invoice_line_items (briefing_id, sort_order);

CREATE TRIGGER invoice_line_items_updated_at
  BEFORE UPDATE ON public.invoice_line_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.invoice_counters (
  year integer PRIMARY KEY,
  last_number integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.invoice_counters TO authenticated;
GRANT ALL ON public.invoice_counters TO service_role;
ALTER TABLE public.invoice_counters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read invoice counters" ON public.invoice_counters
  FOR SELECT TO authenticated USING (is_admin());

CREATE OR REPLACE FUNCTION public.next_invoice_number(prefix text DEFAULT 'EK')
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  y integer := EXTRACT(YEAR FROM now())::int;
  n integer;
BEGIN
  INSERT INTO public.invoice_counters (year, last_number)
  VALUES (y, 1)
  ON CONFLICT (year) DO UPDATE
    SET last_number = public.invoice_counters.last_number + 1,
        updated_at = now()
  RETURNING last_number INTO n;

  RETURN prefix || '-' || y::text || '-' || lpad(n::text, 4, '0');
END;
$$;

ALTER TABLE public.briefing_submissions
  ADD COLUMN IF NOT EXISTS invoice_subtotal numeric,
  ADD COLUMN IF NOT EXISTS invoice_discount_pct numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS invoice_discount_amount numeric,
  ADD COLUMN IF NOT EXISTS invoice_tax_label text,
  ADD COLUMN IF NOT EXISTS invoice_tax_pct numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS invoice_tax_amount numeric,
  ADD COLUMN IF NOT EXISTS invoice_total numeric,
  ADD COLUMN IF NOT EXISTS invoice_deposit_pct numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS invoice_deposit_amount numeric,
  ADD COLUMN IF NOT EXISTS invoice_issue_date date,
  ADD COLUMN IF NOT EXISTS invoice_terms text,
  ADD COLUMN IF NOT EXISTS invoice_reminder_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS invoice_last_reminder_at timestamptz,
  ADD COLUMN IF NOT EXISTS invoice_payment_proof_path text,
  ADD COLUMN IF NOT EXISTS invoice_payment_ref text,
  ADD COLUMN IF NOT EXISTS invoice_payment_method text,
  ADD COLUMN IF NOT EXISTS invoice_paid_reported_at timestamptz;

CREATE INDEX IF NOT EXISTS briefing_invoice_status_idx ON public.briefing_submissions (invoice_status, invoice_due_date);