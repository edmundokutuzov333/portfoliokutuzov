DROP VIEW IF EXISTS public.crm_lead_profiles;
CREATE VIEW public.crm_lead_profiles
WITH (security_invoker=true)
AS
SELECT
  l.id,l.source_type,l.source_id,l.stage,l.owner_user_id,l.client_id,l.project_id,
  l.next_action_at,l.notes,l.created_at,l.updated_at,
  COALESCE(c.name,b.full_name) AS full_name,
  COALESCE(c.company,b.company_name) AS company_name,
  COALESCE(c.email,b.email) AS email,
  COALESCE(c.phone,b.phone) AS phone,
  COALESCE(c.project_type,b.project_type) AS project_type,
  COALESCE(c.budget_amount,b.exact_amount) AS budget_amount,
  COALESCE(c.budget_currency,b.currency) AS budget_currency,
  COALESCE(c.budget_label,b.budget_range) AS budget_label,
  COALESCE(c.timeline,b.deadline::text) AS timeline,
  COALESCE(c.message,b.message) AS message,
  COALESCE(c.source,b.source) AS source,
  COALESCE(b.attachments,'[]'::jsonb) AS attachments,
  b.urgency AS briefing_urgency,
  b.lead_score,b.lead_tier,b.lead_signals,
  b.invoice_number,b.invoice_currency,b.invoice_total,b.invoice_due_date,
  b.invoice_status,b.invoice_sent_at,b.invoice_viewed_at,b.invoice_paid_at,
  b.invoice_payment_ref,b.invoice_payment_method,b.invoice_payment_proof_path,
  p.title AS project_title,p.slug AS project_slug,cl.name AS linked_client_name
FROM public.crm_leads l
LEFT JOIN public.contact_requests c ON l.source_type='contact' AND l.source_id=c.id
LEFT JOIN public.briefing_submissions b ON l.source_type='briefing' AND l.source_id=b.id
LEFT JOIN public.projects p ON p.id=l.project_id
LEFT JOIN public.clients cl ON cl.id=l.client_id;
GRANT SELECT ON public.crm_lead_profiles TO authenticated;