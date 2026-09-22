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

DROP VIEW IF EXISTS public.crm_inbox;
CREATE VIEW public.crm_inbox WITH (security_invoker=true) AS
SELECT
  'briefing'::text AS kind,b.id AS source_id,l.id AS lead_id,b.full_name AS title,
  b.company_name,b.email,b.message AS preview,b.status,l.stage,b.created_at,
  COALESCE(b.lead_score,0) AS priority
FROM public.briefing_submissions b
LEFT JOIN public.crm_leads l ON l.source_type='briefing' AND l.source_id=b.id
UNION ALL
SELECT
  'contact'::text,c.id,l.id,c.name,c.company,c.email,c.message,c.status,l.stage,c.created_at,0
FROM public.contact_requests c
LEFT JOIN public.crm_leads l ON l.source_type='contact' AND l.source_id=c.id
UNION ALL
SELECT
  'booking'::text,br.id,br.lead_id,br.name,NULL,br.email,br.note,br.booking_status,NULL,br.created_at,0
FROM public.booking_requests br
UNION ALL
SELECT
  'subscriber'::text,n.id,NULL,COALESCE(n.name,n.email),NULL,n.email,'Newsletter subscriber',n.status,NULL,n.created_at,0
FROM public.newsletter_subscribers n
UNION ALL
SELECT
  'studio_waitlist'::text,w.id,NULL,w.email,NULL,w.email,'Kutuzov Studio waitlist',w.status,NULL,w.created_at,0
FROM public.studio_waitlist w;
GRANT SELECT ON public.crm_inbox TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_create_project_from_lead(p_lead_id uuid)
RETURNS uuid
LANGUAGE plpgsql SECURITY INVOKER SET search_path=public,pg_catalog
AS $$
DECLARE v_lead public.crm_lead_profiles%ROWTYPE; v_project_id uuid;
BEGIN
  IF NOT public.admin_has_permission('content.write') THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501'; END IF;
  SELECT * INTO v_lead FROM public.crm_lead_profiles WHERE id=p_lead_id;
  IF v_lead.id IS NULL THEN RAISE EXCEPTION 'Lead not found'; END IF;
  INSERT INTO public.projects(title,subtitle,category,year,description,client_name,client_id,sort_order,is_published,featured,featured_priority,tags,gallery,gallery_meta,collaborators,tools_used,deliverables)
  VALUES (
    CASE WHEN coalesce(trim(v_lead.project_type),'')<>'' THEN v_lead.project_type ELSE 'New project' END,
    v_lead.company_name,coalesce(nullif(v_lead.project_type,''),'Creative Project'),extract(year from now())::text,
    v_lead.message,v_lead.company_name,v_lead.client_id,COALESCE((SELECT max(sort_order)+1 FROM public.projects),1),
    false,false,0,'[]'::jsonb,'[]'::jsonb,'[]'::jsonb,'[]'::jsonb,'[]'::jsonb
  ) RETURNING id INTO v_project_id;
  UPDATE public.crm_leads SET project_id=v_project_id,stage=CASE WHEN stage='new' THEN 'qualified' ELSE stage END,updated_at=now() WHERE id=p_lead_id;
  INSERT INTO public.crm_activities(lead_id,activity_type,body,actor_user_id,metadata)
  VALUES(p_lead_id,'system','Project draft created from lead.',auth.uid(),jsonb_build_object('project_id',v_project_id));
  RETURN v_project_id;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_create_project_from_lead(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_create_project_from_lead(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_record_invoice_payment(
  p_lead_id uuid,p_briefing_id uuid,p_amount numeric,p_currency text,
  p_method text DEFAULT NULL,p_reference text DEFAULT NULL,p_status text DEFAULT 'confirmed',
  p_paid_at timestamptz DEFAULT now(),p_notes text DEFAULT NULL
)
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path=public,pg_catalog
AS $$
DECLARE v_payment_id uuid;v_total numeric:=0;v_paid numeric:=0;v_status text:='generated';
BEGIN
  IF NOT public.admin_has_permission('finance.write') THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501'; END IF;
  IF p_amount IS NULL OR p_amount<=0 THEN RAISE EXCEPTION 'Payment amount must be greater than zero'; END IF;
  INSERT INTO public.crm_payments(lead_id,briefing_id,amount,currency,method,reference,status,paid_at,notes,created_by)
  VALUES(p_lead_id,p_briefing_id,p_amount,p_currency,p_method,p_reference,p_status,
    CASE WHEN p_status='confirmed' THEN coalesce(p_paid_at,now()) ELSE NULL END,p_notes,auth.uid())
  RETURNING id INTO v_payment_id;
  IF p_briefing_id IS NOT NULL THEN
    SELECT coalesce(invoice_total,invoice_amount,0) INTO v_total FROM public.briefing_submissions WHERE id=p_briefing_id FOR UPDATE;
    SELECT coalesce(sum(amount),0) INTO v_paid FROM public.crm_payments WHERE briefing_id=p_briefing_id AND status='confirmed';
    v_status:=CASE WHEN v_total>0 AND v_paid>=v_total THEN 'paid' WHEN v_paid>0 THEN 'partially_paid' ELSE 'generated' END;
    UPDATE public.briefing_submissions
    SET invoice_status=v_status,invoice_paid_at=CASE WHEN v_status='paid' THEN now() ELSE NULL END,updated_at=now()
    WHERE id=p_briefing_id;
  END IF;
  IF p_lead_id IS NOT NULL THEN
    INSERT INTO public.crm_activities(lead_id,activity_type,body,actor_user_id,metadata)
    VALUES(p_lead_id,'payment',CASE WHEN p_status='confirmed' THEN 'Payment recorded.' ELSE 'Payment record created.' END,auth.uid(),
      jsonb_build_object('payment_id',v_payment_id,'amount',p_amount,'currency',p_currency));
  END IF;
  RETURN jsonb_build_object('ok',true,'payment_id',v_payment_id,'invoice_status',v_status,'paid_total',v_paid);
END;
$$;
REVOKE ALL ON FUNCTION public.admin_record_invoice_payment(uuid,uuid,numeric,text,text,text,text,timestamptz,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_record_invoice_payment(uuid,uuid,numeric,text,text,text,text,timestamptz,text) TO authenticated;

CREATE OR REPLACE FUNCTION public.sync_booking_status_compatibility()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path=public
AS $$
BEGIN
  IF NEW.booking_status IS DISTINCT FROM OLD.booking_status THEN
    NEW.status:=CASE NEW.booking_status WHEN 'requested' THEN 'new' WHEN 'confirmed' THEN 'accepted'
      WHEN 'rescheduled' THEN 'reviewing' WHEN 'completed' THEN 'accepted' WHEN 'cancelled' THEN 'closed' ELSE NEW.status END;
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    NEW.booking_status:=CASE lower(coalesce(NEW.status,'new'))
      WHEN 'new' THEN 'requested' WHEN 'reviewing' THEN 'rescheduled' WHEN 'accepted' THEN 'confirmed'
      WHEN 'closed' THEN 'cancelled' ELSE NEW.booking_status END;
  END IF;
  NEW.updated_at:=now(); RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_booking_status_compatibility ON public.booking_requests;
CREATE TRIGGER trg_booking_status_compatibility BEFORE UPDATE ON public.booking_requests
FOR EACH ROW EXECUTE FUNCTION public.sync_booking_status_compatibility();

DROP POLICY IF EXISTS "service role only" ON public.studio_waitlist;
DROP POLICY IF EXISTS "admins read studio waitlist" ON public.studio_waitlist;
CREATE POLICY "admins read studio waitlist" ON public.studio_waitlist FOR SELECT TO authenticated
USING (public.admin_has_permission('leads.read'));
DROP POLICY IF EXISTS "admins update studio waitlist" ON public.studio_waitlist;
CREATE POLICY "admins update studio waitlist" ON public.studio_waitlist FOR UPDATE TO authenticated
USING (public.admin_has_permission('leads.write')) WITH CHECK (public.admin_has_permission('leads.write'));
DROP POLICY IF EXISTS "admins delete studio waitlist" ON public.studio_waitlist;
CREATE POLICY "admins delete studio waitlist" ON public.studio_waitlist FOR DELETE TO authenticated
USING (public.admin_has_permission('leads.write'));
GRANT SELECT,UPDATE,DELETE ON public.studio_waitlist TO authenticated;
DROP TRIGGER IF EXISTS trg_studio_waitlist_updated ON public.studio_waitlist;
CREATE TRIGGER trg_studio_waitlist_updated BEFORE UPDATE ON public.studio_waitlist
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS trg_admin_audit_studio_waitlist ON public.studio_waitlist;
CREATE TRIGGER trg_admin_audit_studio_waitlist AFTER INSERT OR UPDATE OR DELETE ON public.studio_waitlist
FOR EACH ROW EXECUTE FUNCTION public.capture_admin_audit();

DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['contact_requests','briefing_submissions','booking_requests','newsletter_subscribers','studio_waitlist','crm_leads','crm_activities','crm_tasks','crm_payments'] LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename=table_name)
    THEN EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I',table_name); END IF;
  END LOOP;
END;
$$;

ANALYZE public.crm_leads;
ANALYZE public.crm_activities;
ANALYZE public.crm_tasks;
ANALYZE public.crm_payments;
ANALYZE public.booking_requests;
ANALYZE public.newsletter_subscribers;
ANALYZE public.studio_waitlist;

CREATE OR REPLACE FUNCTION public.admin_user_directory()
RETURNS TABLE (user_id uuid, email text, role text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  SELECT u.user_id, u.email, u.role
  FROM public.admin_users u
  WHERE public.admin_has_permission('leads.read')
  ORDER BY lower(u.email);
$$;

REVOKE ALL ON FUNCTION public.admin_user_directory() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_user_directory() TO authenticated;