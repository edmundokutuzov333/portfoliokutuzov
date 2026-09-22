-- Phase 4 follow-up: audit restore and editable entity directory.
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
  v_id uuid;
BEGIN
  IF auth.uid() IS NULL OR NOT public.admin_has_permission('content.write') THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501';
  END IF;

  IF p_entity_type NOT IN ('site_settings','projects','clients','services','stats','about_method') THEN
    RAISE EXCEPTION 'Unsupported restore entity: %', p_entity_type;
  END IF;

  IF p_entity_type = 'site_settings' THEN
    INSERT INTO public.site_settings(key, value, updated_at)
    VALUES(p_entity_id, p_snapshot, now())
    ON CONFLICT(key) DO UPDATE
      SET value=EXCLUDED.value, updated_at=now();
  ELSE
    v_id := p_entity_id::uuid;
    CASE p_entity_type
      WHEN 'projects' THEN
        INSERT INTO public.projects
        SELECT * FROM jsonb_populate_record(NULL::public.projects, p_snapshot || jsonb_build_object('id', v_id))
        ON CONFLICT(id) DO UPDATE SET
          title=EXCLUDED.title, subtitle=EXCLUDED.subtitle, category=EXCLUDED.category,
          year=EXCLUDED.year, description=EXCLUDED.description, cover_url=EXCLUDED.cover_url,
          cover_width=EXCLUDED.cover_width, cover_height=EXCLUDED.cover_height, palette=EXCLUDED.palette,
          span=EXCLUDED.span, sort_order=EXCLUDED.sort_order, tags=EXCLUDED.tags,
          gallery=EXCLUDED.gallery, gallery_meta=EXCLUDED.gallery_meta, is_published=EXCLUDED.is_published,
          featured=EXCLUDED.featured, featured_priority=EXCLUDED.featured_priority,
          client_name=EXCLUDED.client_name, image_fit=EXCLUDED.image_fit, concept=EXCLUDED.concept,
          idea=EXCLUDED.idea, role=EXCLUDED.role, notes=EXCLUDED.notes, collaborators=EXCLUDED.collaborators,
          tools_used=EXCLUDED.tools_used, deliverables=EXCLUDED.deliverables, video_url=EXCLUDED.video_url,
          video_provider=EXCLUDED.video_provider, client_id=EXCLUDED.client_id, updated_at=now();
      WHEN 'clients' THEN
        INSERT INTO public.clients
        SELECT * FROM jsonb_populate_record(NULL::public.clients, p_snapshot || jsonb_build_object('id', v_id))
        ON CONFLICT(id) DO UPDATE SET
          name=EXCLUDED.name, logo_url=EXCLUDED.logo_url, website_url=EXCLUDED.website_url,
          logo_width=EXCLUDED.logo_width, logo_height=EXCLUDED.logo_height, sort_order=EXCLUDED.sort_order,
          is_active=EXCLUDED.is_active, kind=EXCLUDED.kind, updated_at=now();
      WHEN 'services' THEN
        INSERT INTO public.services
        SELECT * FROM jsonb_populate_record(NULL::public.services, p_snapshot || jsonb_build_object('id', v_id))
        ON CONFLICT(id) DO UPDATE SET
          number=EXCLUDED.number, title=EXCLUDED.title, description=EXCLUDED.description, icon=EXCLUDED.icon,
          sort_order=EXCLUDED.sort_order, is_active=EXCLUDED.is_active, updated_at=now();
      WHEN 'stats' THEN
        INSERT INTO public.stats
        SELECT * FROM jsonb_populate_record(NULL::public.stats, p_snapshot || jsonb_build_object('id', v_id))
        ON CONFLICT(id) DO UPDATE SET
          value=EXCLUDED.value, label=EXCLUDED.label, sort_order=EXCLUDED.sort_order,
          is_active=EXCLUDED.is_active, updated_at=now();
      WHEN 'about_method' THEN
        INSERT INTO public.about_method
        SELECT * FROM jsonb_populate_record(NULL::public.about_method, p_snapshot || jsonb_build_object('id', v_id))
        ON CONFLICT(id) DO UPDATE SET
          number=EXCLUDED.number, title=EXCLUDED.title, description=EXCLUDED.description,
          sort_order=EXCLUDED.sort_order, is_active=EXCLUDED.is_active, updated_at=now();
    END CASE;
  END IF;

  INSERT INTO public.crm_activities(lead_id, activity_type, body, metadata, actor_user_id)
  SELECT
    id,
    'system',
    'Audit state restored by administrator.',
    jsonb_build_object('audit_id', p_audit_id, 'entity_type', p_entity_type, 'entity_id', p_entity_id),
    auth.uid()
  FROM public.crm_leads
  WHERE false;

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

CREATE OR REPLACE FUNCTION public.admin_editable_entity_directory()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_catalog
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.admin_has_permission('content.read') THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501';
  END IF;

  RETURN jsonb_build_object(
    'site_settings', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', key, 'label', COALESCE(value->>'title', key), 'meta', 'setting'
      ) ORDER BY key)
      FROM public.site_settings
    ), '[]'::jsonb),
    'projects', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', id::text, 'label', title, 'meta', COALESCE(client_name,'') || ' · ' || category
      ) ORDER BY sort_order, title)
      FROM public.projects
    ), '[]'::jsonb),
    'clients', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', id::text, 'label', name, 'meta', kind
      ) ORDER BY sort_order, name)
      FROM public.clients
    ), '[]'::jsonb),
    'services', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', id::text, 'label', title, 'meta', COALESCE(number,'')
      ) ORDER BY sort_order, title)
      FROM public.services
    ), '[]'::jsonb),
    'stats', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', id::text, 'label', label, 'meta', value
      ) ORDER BY sort_order, label)
      FROM public.stats
    ), '[]'::jsonb),
    'about_method', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', id::text, 'label', title, 'meta', COALESCE(number,'')
      ) ORDER BY sort_order, title)
      FROM public.about_method
    ), '[]'::jsonb)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_editable_entity_directory() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_editable_entity_directory() TO authenticated;