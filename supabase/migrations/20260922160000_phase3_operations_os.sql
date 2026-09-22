-- Phase 3: Operations OS
-- Unified CRM, operational inbox, lifecycle management, audience management,
-- booking workflow, payment ledger and Studio integration.

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL;

ALTER TABLE public.booking_requests
  ADD COLUMN IF NOT EXISTS booking_status text NOT NULL DEFAULT 'requested',
  ADD COLUMN IF NOT EXISTS lead_id uuid,
  ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS owner_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

ALTER TABLE public.studio_waitlist
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'studio',
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS public.crm_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL CHECK (source_type IN ('contact','briefing')),
  source_id uuid NOT NULL,
  stage text NOT NULL DEFAULT 'new' CHECK (stage IN ('new','contacted','qualified','proposal','negotiation','won','lost','archived')),
  owner_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  next_action_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(source_type, source_id)
);

ALTER TABLE public.booking_requests
  DROP CONSTRAINT IF EXISTS booking_requests_lead_id_fkey;
ALTER TABLE public.booking_requests
  ADD CONSTRAINT booking_requests_lead_id_fkey
  FOREIGN KEY (lead_id) REFERENCES public.crm_leads(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_booking_status ON public.booking_requests(booking_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_booking_requests_lead_id ON public.booking_requests(lead_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON public.newsletter_subscribers(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_studio_waitlist_status_created ON public.studio_waitlist(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crm_leads_stage_updated ON public.crm_leads(stage, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_crm_leads_owner_next_action ON public.crm_leads(owner_user_id, next_action_at);
CREATE INDEX IF NOT EXISTS idx_crm_leads_client_id ON public.crm_leads(client_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_project_id ON public.crm_leads(project_id);

UPDATE public.booking_requests
SET booking_status = CASE lower(coalesce(status,'new'))
  WHEN 'new' THEN 'requested'
  WHEN 'reviewing' THEN 'rescheduled'
  WHEN 'accepted' THEN 'confirmed'
  WHEN 'closed' THEN 'cancelled'
  WHEN 'requested' THEN 'requested'
  WHEN 'confirmed' THEN 'confirmed'
  WHEN 'rescheduled' THEN 'rescheduled'
  WHEN 'completed' THEN 'completed'
  WHEN 'cancelled' THEN 'cancelled'
  ELSE 'requested'
END
WHERE booking_status = 'requested'
  AND lower(coalesce(status,'new')) <> 'requested';

UPDATE public.newsletter_subscribers
SET status = CASE WHEN is_active THEN 'active' ELSE 'inactive' END
WHERE status IS NULL OR status = '';

ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.crm_leads TO authenticated;

DROP POLICY IF EXISTS "admins read crm leads" ON public.crm_leads;
CREATE POLICY "admins read crm leads"
ON public.crm_leads FOR SELECT TO authenticated
USING (public.admin_has_permission('leads.read'));

DROP POLICY IF EXISTS "admins write crm leads" ON public.crm_leads;
CREATE POLICY "admins write crm leads"
ON public.crm_leads FOR ALL TO authenticated
USING (public.admin_has_permission('leads.write'))
WITH CHECK (public.admin_has_permission('leads.write'));

DROP TRIGGER IF EXISTS trg_crm_leads_updated ON public.crm_leads;
CREATE TRIGGER trg_crm_leads_updated
BEFORE UPDATE ON public.crm_leads
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_admin_audit_crm_leads ON public.crm_leads;
CREATE TRIGGER trg_admin_audit_crm_leads
AFTER INSERT OR UPDATE OR DELETE ON public.crm_leads
FOR EACH ROW EXECUTE FUNCTION public.capture_admin_audit();

CREATE TABLE IF NOT EXISTS public.crm_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  activity_type text NOT NULL CHECK (activity_type IN ('note','email','call','meeting','stage_change','system','payment','invoice')),
  body text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_crm_activities_lead_created ON public.crm_activities(lead_id, created_at DESC);
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.crm_activities TO authenticated;
DROP POLICY IF EXISTS "admins read crm activities" ON public.crm_activities;
CREATE POLICY "admins read crm activities" ON public.crm_activities FOR SELECT TO authenticated
USING (public.admin_has_permission('leads.read'));
DROP POLICY IF EXISTS "admins write crm activities" ON public.crm_activities;
CREATE POLICY "admins write crm activities" ON public.crm_activities FOR ALL TO authenticated
USING (public.admin_has_permission('leads.write'))
WITH CHECK (public.admin_has_permission('leads.write'));
DROP TRIGGER IF EXISTS trg_admin_audit_crm_activities ON public.crm_activities;
CREATE TRIGGER trg_admin_audit_crm_activities
AFTER INSERT OR UPDATE OR DELETE ON public.crm_activities
FOR EACH ROW EXECUTE FUNCTION public.capture_admin_audit();

CREATE TABLE IF NOT EXISTS public.crm_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('follow_up','invoice_reminder','lead_reminder','waitlist_notification')),
  title text NOT NULL,
  due_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','cancelled')),
  owner_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_due_status ON public.crm_tasks(status, due_at);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_lead ON public.crm_tasks(lead_id, due_at);
ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.crm_tasks TO authenticated;
DROP POLICY IF EXISTS "admins read crm tasks" ON public.crm_tasks;
CREATE POLICY "admins read crm tasks" ON public.crm_tasks FOR SELECT TO authenticated
USING (public.admin_has_permission('leads.read'));
DROP POLICY IF EXISTS "admins write crm tasks" ON public.crm_tasks;
CREATE POLICY "admins write crm tasks" ON public.crm_tasks FOR ALL TO authenticated
USING (public.admin_has_permission('leads.write'))
WITH CHECK (public.admin_has_permission('leads.write'));
DROP TRIGGER IF EXISTS trg_crm_tasks_updated ON public.crm_tasks;
CREATE TRIGGER trg_crm_tasks_updated
BEFORE UPDATE ON public.crm_tasks
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS trg_admin_audit_crm_tasks ON public.crm_tasks;
CREATE TRIGGER trg_admin_audit_crm_tasks
AFTER INSERT OR UPDATE OR DELETE ON public.crm_tasks
FOR EACH ROW EXECUTE FUNCTION public.capture_admin_audit();

CREATE TABLE IF NOT EXISTS public.crm_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.crm_leads(id) ON DELETE SET NULL,
  briefing_id uuid REFERENCES public.briefing_submissions(id) ON DELETE SET NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  currency text NOT NULL,
  method text,
  reference text,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending','confirmed','rejected')),
  paid_at timestamptz,
  proof_path text,
  notes text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_crm_payments_lead_created ON public.crm_payments(lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crm_payments_briefing ON public.crm_payments(briefing_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crm_payments_status_paid ON public.crm_payments(status, paid_at DESC);
ALTER TABLE public.crm_payments ENABLE ROW LEVEL SECURITY;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.crm_payments TO authenticated;
DROP POLICY IF EXISTS "admins read crm payments" ON public.crm_payments;
CREATE POLICY "admins read crm payments" ON public.crm_payments FOR SELECT TO authenticated
USING (public.admin_has_permission('finance.read'));
DROP POLICY IF EXISTS "admins write crm payments" ON public.crm_payments;
CREATE POLICY "admins write crm payments" ON public.crm_payments FOR ALL TO authenticated
USING (public.admin_has_permission('finance.write'))
WITH CHECK (public.admin_has_permission('finance.write'));
DROP TRIGGER IF EXISTS trg_crm_payments_updated ON public.crm_payments;
CREATE TRIGGER trg_crm_payments_updated
BEFORE UPDATE ON public.crm_payments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS trg_admin_audit_crm_payments ON public.crm_payments;
CREATE TRIGGER trg_admin_audit_crm_payments
AFTER INSERT OR UPDATE OR DELETE ON public.crm_payments
FOR EACH ROW EXECUTE FUNCTION public.capture_admin_audit();

CREATE OR REPLACE FUNCTION public.ensure_crm_lead_from_source()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path=public,pg_catalog
AS $$
DECLARE v_source_type text;
BEGIN
  v_source_type := CASE TG_TABLE_NAME
    WHEN 'contact_requests' THEN 'contact'
    WHEN 'briefing_submissions' THEN 'briefing'
    ELSE NULL
  END;
  IF v_source_type IS NULL THEN RETURN COALESCE(NEW,OLD); END IF;
  IF TG_OP='DELETE' THEN
    DELETE FROM public.crm_leads WHERE source_type=v_source_type AND source_id=OLD.id;
  ELSE
    INSERT INTO public.crm_leads(source_type,source_id) VALUES(v_source_type,NEW.id)
    ON CONFLICT(source_type,source_id) DO NOTHING;
  END IF;
  RETURN COALESCE(NEW,OLD);
END;
$$;
REVOKE ALL ON FUNCTION public.ensure_crm_lead_from_source() FROM PUBLIC;

DROP TRIGGER IF EXISTS trg_ensure_crm_lead_contact ON public.contact_requests;
CREATE TRIGGER trg_ensure_crm_lead_contact
AFTER INSERT OR UPDATE OR DELETE ON public.contact_requests
FOR EACH ROW EXECUTE FUNCTION public.ensure_crm_lead_from_source();

DROP TRIGGER IF EXISTS trg_ensure_crm_lead_briefing ON public.briefing_submissions;
CREATE TRIGGER trg_ensure_crm_lead_briefing
AFTER INSERT OR UPDATE OR DELETE ON public.briefing_submissions
FOR EACH ROW EXECUTE FUNCTION public.ensure_crm_lead_from_source();

INSERT INTO public.crm_leads(source_type,source_id)
SELECT 'contact',id FROM public.contact_requests
ON CONFLICT(source_type,source_id) DO NOTHING;

INSERT INTO public.crm_leads(source_type,source_id)
SELECT 'briefing',id FROM public.briefing_submissions
ON CONFLICT(source_type,source_id) DO NOTHING;

UPDATE public.projects p SET client_id=c.id
FROM public.clients c
WHERE p.client_id IS NULL AND c.name=p.client_name;

UPDATE public.crm_leads l SET client_id=c.id,updated_at=now()
FROM public.briefing_submissions b
JOIN public.clients c ON c.name=b.company_name
WHERE l.source_type='briefing' AND l.source_id=b.id AND l.client_id IS NULL
AND b.company_name IS NOT NULL AND b.company_name<>'';

DROP VIEW IF EXISTS public.crm_lead_profiles;
CREATE VIEW public.crm_lead_profiles WITH (security_invoker=true) AS
SELECT
  l.id,l.source_type,l.source_id,l.stage,l.owner_user_id,l.client_id,l.project_id,
  l.next_action_at,l.notes,l.created_at,l.updated_at,
  COALESCE(c.name,b.full_name) AS full_name,
  COALESCE(c.kind,b.company_name) AS company_name,
  COALESCE(c.website_url,b.source) AS source,
  COALESCE(c.email,b.email) AS email,
  COALESCE(c.logo_url,b.phone) AS phone,
  COALESCE(NULLIF(b.project_type,''),NULL) AS project_type,
  b.exact_amount AS budget_amount,b.currency AS budget_currency,b.budget_range AS budget_label,
  b.deadline::text AS timeline,b.message AS message,
  b.urgency AS briefing_urgency,b.lead_score,b.lead_tier,b.lead_signals,
  b.invoice_number,b.invoice_currency,b.invoice_total,b.invoice_due_date,
  b.invoice_status,b.invoice_sent_at,b.invoice_viewed_at,b.invoice_paid_at,
  b.invoice_payment_ref,b.invoice_payment_method,b.invoice_payment_proof_path,
  p.title AS project_title,p.slug AS project_slug,cl.name AS linked_client_name
FROM public.crm_leads l
LEFT JOIN public.contact_requests c ON l.source_type='contact' AND l.source_id=c.id
LEFT JOIN public.briefing_submissions b ON l.source_type='briefing' AND l.source_id=b.id
LEFT JOIN public.projects p ON p.id=l.project_id
LEFT JOIN public.clients cl ON cl.id=l.client_id;
