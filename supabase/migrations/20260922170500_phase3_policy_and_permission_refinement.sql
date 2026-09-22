-- Phase 3 security/policy refinement.
-- Trigger-only helpers should not be callable as direct RPCs.
REVOKE EXECUTE ON FUNCTION public.capture_admin_audit() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.capture_admin_audit() FROM anon;
REVOKE EXECUTE ON FUNCTION public.capture_admin_audit() FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.capture_admin_content_version() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.capture_admin_content_version() FROM anon;
REVOKE EXECUTE ON FUNCTION public.capture_admin_content_version() FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.prevent_admin_audit_mutation() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.prevent_admin_audit_mutation() FROM anon;
REVOKE EXECUTE ON FUNCTION public.prevent_admin_audit_mutation() FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.ensure_crm_lead_from_source() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.ensure_crm_lead_from_source() FROM anon;
REVOKE EXECUTE ON FUNCTION public.ensure_crm_lead_from_source() FROM authenticated;

-- Separate read and mutation policies so SELECT is not covered twice.
DROP POLICY IF EXISTS "admins write crm leads" ON public.crm_leads;
CREATE POLICY "admins insert crm leads" ON public.crm_leads
FOR INSERT TO authenticated
WITH CHECK (public.admin_has_permission('leads.write'));
CREATE POLICY "admins update crm leads" ON public.crm_leads
FOR UPDATE TO authenticated
USING (public.admin_has_permission('leads.write'))
WITH CHECK (public.admin_has_permission('leads.write'));
CREATE POLICY "admins delete crm leads" ON public.crm_leads
FOR DELETE TO authenticated
USING (public.admin_has_permission('leads.write'));

DROP POLICY IF EXISTS "admins write crm activities" ON public.crm_activities;
CREATE POLICY "admins insert crm activities" ON public.crm_activities
FOR INSERT TO authenticated
WITH CHECK (public.admin_has_permission('leads.write'));
CREATE POLICY "admins update crm activities" ON public.crm_activities
FOR UPDATE TO authenticated
USING (public.admin_has_permission('leads.write'))
WITH CHECK (public.admin_has_permission('leads.write'));
CREATE POLICY "admins delete crm activities" ON public.crm_activities
FOR DELETE TO authenticated
USING (public.admin_has_permission('leads.write'));

DROP POLICY IF EXISTS "admins write crm tasks" ON public.crm_tasks;
CREATE POLICY "admins insert crm tasks" ON public.crm_tasks
FOR INSERT TO authenticated
WITH CHECK (public.admin_has_permission('leads.write'));
CREATE POLICY "admins update crm tasks" ON public.crm_tasks
FOR UPDATE TO authenticated
USING (public.admin_has_permission('leads.write'))
WITH CHECK (public.admin_has_permission('leads.write'));
CREATE POLICY "admins delete crm tasks" ON public.crm_tasks
FOR DELETE TO authenticated
USING (public.admin_has_permission('leads.write'));

DROP POLICY IF EXISTS "admins write crm payments" ON public.crm_payments;
CREATE POLICY "admins insert crm payments" ON public.crm_payments
FOR INSERT TO authenticated
WITH CHECK (public.admin_has_permission('finance.write'));
CREATE POLICY "admins update crm payments" ON public.crm_payments
FOR UPDATE TO authenticated
USING (public.admin_has_permission('finance.write'))
WITH CHECK (public.admin_has_permission('finance.write'));
CREATE POLICY "admins delete crm payments" ON public.crm_payments
FOR DELETE TO authenticated
USING (public.admin_has_permission('finance.write'));

-- Turning a lead into a project changes both sales and content state.
CREATE OR REPLACE FUNCTION public.admin_create_project_from_lead(p_lead_id uuid)
RETURNS uuid
LANGUAGE plpgsql SECURITY INVOKER
SET search_path=public,pg_catalog
AS $$
DECLARE
  v_lead public.crm_lead_profiles%ROWTYPE;
  v_project_id uuid;
BEGIN
  IF NOT public.admin_has_permission('content.write')
     OR NOT public.admin_has_permission('leads.write') THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501';
  END IF;

  SELECT * INTO v_lead FROM public.crm_lead_profiles WHERE id=p_lead_id;
  IF v_lead.id IS NULL THEN RAISE EXCEPTION 'Lead not found'; END IF;

  INSERT INTO public.projects(
    title,subtitle,category,year,description,client_name,client_id,sort_order,
    is_published,featured,featured_priority,tags,gallery,gallery_meta,
    collaborators,tools_used,deliverables
  )
  VALUES(
    CASE WHEN coalesce(trim(v_lead.project_type),'')<>'' THEN v_lead.project_type ELSE 'New project' END,
    v_lead.company_name,coalesce(nullif(v_lead.project_type,''),'Creative Project'),
    extract(year from now())::text,v_lead.message,v_lead.company_name,v_lead.client_id,
    COALESCE((SELECT max(sort_order)+1 FROM public.projects),1),false,false,0,
    '[]'::jsonb,'[]'::jsonb,'[]'::jsonb,'[]'::jsonb,'[]'::jsonb
  ) RETURNING id INTO v_project_id;

  UPDATE public.crm_leads
  SET project_id=v_project_id,
      stage=CASE WHEN stage='new' THEN 'qualified' ELSE stage END,
      updated_at=now()
  WHERE id=p_lead_id;

  INSERT INTO public.crm_activities(lead_id,activity_type,body,actor_user_id,metadata)
  VALUES(
    p_lead_id,'system','Project draft created from lead.',auth.uid(),
    jsonb_build_object('project_id',v_project_id)
  );
  RETURN v_project_id;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_create_project_from_lead(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_create_project_from_lead(uuid) TO authenticated;