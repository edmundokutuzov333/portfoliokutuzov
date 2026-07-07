
ALTER TABLE public.briefing_submissions
  ADD COLUMN IF NOT EXISTS invoice_number text,
  ADD COLUMN IF NOT EXISTS invoice_amount numeric,
  ADD COLUMN IF NOT EXISTS invoice_currency text,
  ADD COLUMN IF NOT EXISTS invoice_due_date date,
  ADD COLUMN IF NOT EXISTS invoice_notes text,
  ADD COLUMN IF NOT EXISTS invoice_pdf_path text,
  ADD COLUMN IF NOT EXISTS invoice_status text DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS invoice_sent_at timestamptz;

CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq START WITH 1000;
GRANT USAGE ON SEQUENCE public.invoice_number_seq TO authenticated, service_role;

INSERT INTO public.site_settings (key, value)
VALUES (
  'invoice_settings',
  jsonb_build_object(
    'studio_name', 'Edmundo Kutuzov — Art Direction',
    'studio_address', 'Maputo, Mozambique',
    'studio_email', 'contact@edmundokutuzov.art',
    'studio_tax_id', '',
    'bank_name', '',
    'bank_account_name', '',
    'bank_iban', '',
    'bank_swift', '',
    'mpesa_number', '',
    'payment_terms', 'Payment due within 14 days. 50% deposit required to start production.',
    'footer_note', 'Thank you for your trust. Please reference the invoice number in your transfer.'
  )
)
ON CONFLICT (key) DO NOTHING;
