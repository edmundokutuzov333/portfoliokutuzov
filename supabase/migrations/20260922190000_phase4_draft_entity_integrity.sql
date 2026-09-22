-- Phase 4 integrity hardening: a draft payload may never target a different row
-- than the entity recorded by the release record.
CREATE OR REPLACE FUNCTION public.admin_publish_drafts(
  p_draft_ids uuid[],
  p_publish_note text DEFAULT NULL
)
RETURNS TABLE (draft_id uuid, entity_type text, entity_id text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  d public.admin_drafts%ROWTYPE;
  current_updated_at timestamptz;
  current_snapshot jsonb;
BEGIN
  IF auth.uid() IS NULL OR NOT public.admin_has_permission('content.write') THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501';
  END IF;
  IF COALESCE(array_length(p_draft_ids,1),0)=0 THEN
    RAISE EXCEPTION 'No drafts selected';
  END IF;

  FOR d IN
    SELECT * FROM public.admin_drafts
    WHERE id=ANY(p_draft_ids) AND status IN ('draft','review')
    ORDER BY updated_at ASC
    FOR UPDATE
  LOOP
    IF d.entity_type='site_settings' AND d.entity_id='invoice_settings'
       AND NOT public.admin_has_permission('finance.write') THEN
      RAISE EXCEPTION 'Finance permission required for invoice settings' USING ERRCODE='42501';
    END IF;

    IF d.entity_type <> 'site_settings' THEN
      IF COALESCE(d.payload->>'id','') <> d.entity_id THEN
        RAISE EXCEPTION 'Draft payload id does not match entity id for %:%', d.entity_type, d.entity_id
          USING ERRCODE='22023';
      END IF;
    END IF;

    IF d.entity_type='site_settings' THEN
      SELECT s.updated_at,s.value INTO current_updated_at,current_snapshot
      FROM public.site_settings s WHERE s.key=d.entity_id FOR UPDATE;
      IF d.baseline_updated_at IS DISTINCT FROM current_updated_at THEN
        RAISE EXCEPTION 'Draft is stale for site_settings:%',d.entity_id USING ERRCODE='40001';
      END IF;
      INSERT INTO public.site_settings(key,value,updated_at) VALUES(d.entity_id,d.payload,now())
      ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value,updated_at=now();

    ELSIF d.entity_type='projects' THEN
      SELECT p.updated_at,to_jsonb(p) INTO current_updated_at,current_snapshot
      FROM public.projects p WHERE p.id=d.entity_id::uuid FOR UPDATE;
      IF d.baseline_updated_at IS DISTINCT FROM current_updated_at THEN
        RAISE EXCEPTION 'Draft is stale for projects:%',d.entity_id USING ERRCODE='40001';
      END IF;
      INSERT INTO public.projects SELECT * FROM jsonb_populate_record(NULL::public.projects,d.payload)
      ON CONFLICT(id) DO UPDATE SET
        title=EXCLUDED.title,subtitle=EXCLUDED.subtitle,category=EXCLUDED.category,year=EXCLUDED.year,
        description=EXCLUDED.description,cover_url=EXCLUDED.cover_url,cover_width=EXCLUDED.cover_width,
        cover_height=EXCLUDED.cover_height,palette=EXCLUDED.palette,span=EXCLUDED.span,
        sort_order=EXCLUDED.sort_order,tags=EXCLUDED.tags,gallery=EXCLUDED.gallery,
        gallery_meta=EXCLUDED.gallery_meta,is_published=EXCLUDED.is_published,featured=EXCLUDED.featured,
        featured_priority=EXCLUDED.featured_priority,client_name=EXCLUDED.client_name,image_fit=EXCLUDED.image_fit,
        concept=EXCLUDED.concept,idea=EXCLUDED.idea,role=EXCLUDED.role,notes=EXCLUDED.notes,
        collaborators=EXCLUDED.collaborators,tools_used=EXCLUDED.tools_used,deliverables=EXCLUDED.deliverables,
        video_url=EXCLUDED.video_url,video_provider=EXCLUDED.video_provider,client_id=EXCLUDED.client_id,updated_at=now();

    ELSIF d.entity_type='clients' THEN
      SELECT c.updated_at,to_jsonb(c) INTO current_updated_at,current_snapshot
      FROM public.clients c WHERE c.id=d.entity_id::uuid FOR UPDATE;
      IF d.baseline_updated_at IS DISTINCT FROM current_updated_at THEN
        RAISE EXCEPTION 'Draft is stale for clients:%',d.entity_id USING ERRCODE='40001';
      END IF;
      INSERT INTO public.clients SELECT * FROM jsonb_populate_record(NULL::public.clients,d.payload)
      ON CONFLICT(id) DO UPDATE SET
        name=EXCLUDED.name,logo_url=EXCLUDED.logo_url,website_url=EXCLUDED.website_url,
        logo_width=EXCLUDED.logo_width,logo_height=EXCLUDED.logo_height,sort_order=EXCLUDED.sort_order,
        is_active=EXCLUDED.is_active,kind=EXCLUDED.kind,updated_at=now();

    ELSIF d.entity_type='services' THEN
      SELECT s.updated_at,to_jsonb(s) INTO current_updated_at,current_snapshot
      FROM public.services s WHERE s.id=d.entity_id::uuid FOR UPDATE;
      IF d.baseline_updated_at IS DISTINCT FROM current_updated_at THEN
        RAISE EXCEPTION 'Draft is stale for services:%',d.entity_id USING ERRCODE='40001';
      END IF;
      INSERT INTO public.services SELECT * FROM jsonb_populate_record(NULL::public.services,d.payload)
      ON CONFLICT(id) DO UPDATE SET
        number=EXCLUDED.number,title=EXCLUDED.title,description=EXCLUDED.description,icon=EXCLUDED.icon,
        sort_order=EXCLUDED.sort_order,is_active=EXCLUDED.is_active,updated_at=now();

    ELSIF d.entity_type='stats' THEN
      SELECT s.updated_at,to_jsonb(s) INTO current_updated_at,current_snapshot
      FROM public.stats s WHERE s.id=d.entity_id::uuid FOR UPDATE;
      IF d.baseline_updated_at IS DISTINCT FROM current_updated_at THEN
        RAISE EXCEPTION 'Draft is stale for stats:%',d.entity_id USING ERRCODE='40001';
      END IF;
      INSERT INTO public.stats SELECT * FROM jsonb_populate_record(NULL::public.stats,d.payload)
      ON CONFLICT(id) DO UPDATE SET
        value=EXCLUDED.value,label=EXCLUDED.label,sort_order=EXCLUDED.sort_order,is_active=EXCLUDED.is_active,updated_at=now();

    ELSIF d.entity_type='about_method' THEN
      SELECT m.updated_at,to_jsonb(m) INTO current_updated_at,current_snapshot
      FROM public.about_method m WHERE m.id=d.entity_id::uuid FOR UPDATE;
      IF d.baseline_updated_at IS DISTINCT FROM current_updated_at THEN
        RAISE EXCEPTION 'Draft is stale for about_method:%',d.entity_id USING ERRCODE='40001';
      END IF;
      INSERT INTO public.about_method SELECT * FROM jsonb_populate_record(NULL::public.about_method,d.payload)
      ON CONFLICT(id) DO UPDATE SET
        number=EXCLUDED.number,title=EXCLUDED.title,description=EXCLUDED.description,
        sort_order=EXCLUDED.sort_order,is_active=EXCLUDED.is_active,updated_at=now();
    END IF;

    UPDATE public.admin_drafts
    SET status='published',publish_note=p_publish_note,published_at=now(),
        reviewed_by=auth.uid(),updated_by=auth.uid(),updated_at=now()
    WHERE id=d.id;

    RETURN QUERY SELECT d.id,d.entity_type,d.entity_id;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_publish_drafts(uuid[],text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_publish_drafts(uuid[],text) TO authenticated;