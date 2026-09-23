-- Phase 4 restore hardening.
-- The audit row is the authority for recovery. The client may select only a snapshot
-- that is already present on the referenced audit event and may not inject arbitrary state.

CREATE OR REPLACE FUNCTION public.admin_restore_audit_state(
  p_entity_type text,
  p_entity_id text,
  p_snapshot jsonb,
  p_audit_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  audit_row public.admin_audit_log%ROWTYPE;
  verified_snapshot jsonb;
BEGIN
  IF auth.uid() IS NULL OR NOT public.admin_has_permission('content.write') THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501';
  END IF;

  SELECT *
  INTO audit_row
  FROM public.admin_audit_log
  WHERE id = p_audit_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Audit event not found' USING ERRCODE='22023';
  END IF;

  IF audit_row.entity_type IS DISTINCT FROM p_entity_type
     OR audit_row.entity_id IS DISTINCT FROM p_entity_id THEN
    RAISE EXCEPTION 'Audit event does not match restore target' USING ERRCODE='22023';
  END IF;

  IF p_entity_type NOT IN ('site_settings','projects','clients','services','stats','about_method') THEN
    RAISE EXCEPTION 'Unsupported restore entity: %', p_entity_type USING ERRCODE='22023';
  END IF;

  IF p_entity_type = 'site_settings' AND p_entity_id = 'invoice_settings'
     AND NOT public.admin_has_permission('finance.write') THEN
    RAISE EXCEPTION 'Finance permission required for invoice settings' USING ERRCODE='42501';
  END IF;

  IF p_snapshot IS NOT DISTINCT FROM audit_row.before_data THEN
    verified_snapshot := audit_row.before_data;
  ELSIF p_snapshot IS NOT DISTINCT FROM audit_row.after_data THEN
    verified_snapshot := audit_row.after_data;
  ELSE
    RAISE EXCEPTION 'Restore snapshot does not match the selected audit event' USING ERRCODE='22023';
  END IF;

  IF p_entity_type = 'site_settings' THEN
    INSERT INTO public.site_settings(key,value,updated_at)
    VALUES(p_entity_id, verified_snapshot, now())
    ON CONFLICT(key) DO UPDATE
    SET value = EXCLUDED.value, updated_at = now();

  ELSIF p_entity_type = 'projects' THEN
    INSERT INTO public.projects
    SELECT * FROM jsonb_populate_record(
      NULL::public.projects,
      verified_snapshot || jsonb_build_object('id', p_entity_id::uuid)
    )
    ON CONFLICT(id) DO UPDATE SET
      title=EXCLUDED.title,subtitle=EXCLUDED.subtitle,category=EXCLUDED.category,year=EXCLUDED.year,
      description=EXCLUDED.description,cover_url=EXCLUDED.cover_url,cover_width=EXCLUDED.cover_width,cover_height=EXCLUDED.cover_height,
      palette=EXCLUDED.palette,span=EXCLUDED.span,sort_order=EXCLUDED.sort_order,tags=EXCLUDED.tags,gallery=EXCLUDED.gallery,
      gallery_meta=EXCLUDED.gallery_meta,is_published=EXCLUDED.is_published,featured=EXCLUDED.featured,featured_priority=EXCLUDED.featured_priority,
      client_name=EXCLUDED.client_name,image_fit=EXCLUDED.image_fit,concept=EXCLUDED.concept,idea=EXCLUDED.idea,role=EXCLUDED.role,notes=EXCLUDED.notes,
      collaborators=EXCLUDED.collaborators,tools_used=EXCLUDED.tools_used,deliverables=EXCLUDED.deliverables,video_url=EXCLUDED.video_url,
      video_provider=EXCLUDED.video_provider,client_id=EXCLUDED.client_id,updated_at=now();

  ELSIF p_entity_type = 'clients' THEN
    INSERT INTO public.clients
    SELECT * FROM jsonb_populate_record(
      NULL::public.clients,
      verified_snapshot || jsonb_build_object('id', p_entity_id::uuid)
    )
    ON CONFLICT(id) DO UPDATE SET
      name=EXCLUDED.name,logo_url=EXCLUDED.logo_url,website_url=EXCLUDED.website_url,logo_width=EXCLUDED.logo_width,logo_height=EXCLUDED.logo_height,
      sort_order=EXCLUDED.sort_order,is_active=EXCLUDED.is_active,kind=EXCLUDED.kind,updated_at=now();

  ELSIF p_entity_type = 'services' THEN
    INSERT INTO public.services
    SELECT * FROM jsonb_populate_record(
      NULL::public.services,
      verified_snapshot || jsonb_build_object('id', p_entity_id::uuid)
    )
    ON CONFLICT(id) DO UPDATE SET
      number=EXCLUDED.number,title=EXCLUDED.title,description=EXCLUDED.description,icon=EXCLUDED.icon,sort_order=EXCLUDED.sort_order,is_active=EXCLUDED.is_active,updated_at=now();

  ELSIF p_entity_type = 'stats' THEN
    INSERT INTO public.stats
    SELECT * FROM jsonb_populate_record(
      NULL::public.stats,
      verified_snapshot || jsonb_build_object('id', p_entity_id::uuid)
    )
    ON CONFLICT(id) DO UPDATE SET
      value=EXCLUDED.value,label=EXCLUDED.label,sort_order=EXCLUDED.sort_order,is_active=EXCLUDED.is_active,updated_at=now();

  ELSIF p_entity_type = 'about_method' THEN
    INSERT INTO public.about_method
    SELECT * FROM jsonb_populate_record(
      NULL::public.about_method,
      verified_snapshot || jsonb_build_object('id', p_entity_id::uuid)
    )
    ON CONFLICT(id) DO UPDATE SET
      number=EXCLUDED.number,title=EXCLUDED.title,description=EXCLUDED.description,sort_order=EXCLUDED.sort_order,is_active=EXCLUDED.is_active,updated_at=now();
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'audit_id', p_audit_id,
    'entity_type', p_entity_type,
    'entity_id', p_entity_id
  );

EXCEPTION
  WHEN invalid_text_representation THEN
    RAISE EXCEPTION 'Invalid entity id for %', p_entity_type USING ERRCODE='22P02';
END;
$$;

REVOKE ALL ON FUNCTION public.admin_restore_audit_state(text,text,jsonb,uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_restore_audit_state(text,text,jsonb,uuid) TO authenticated;
