-- FASE 4: CONTROL ROOM 2.0
-- Editorial drafts, compare/preview, atomic publish, global admin search,
-- system health and recovery-readiness primitives.

CREATE TABLE IF NOT EXISTS public.admin_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (
    entity_type IN ('site_settings','projects','clients','services','stats','about_method')
  ),
  entity_id text NOT NULL,
  label text NOT NULL,
  payload jsonb NOT NULL,
  baseline_snapshot jsonb NOT NULL,
  baseline_updated_at timestamptz,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','review','published','discarded')),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  publish_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_drafts_active_entity
  ON public.admin_drafts(entity_type, entity_id)
  WHERE status IN ('draft','review');

CREATE INDEX IF NOT EXISTS idx_admin_drafts_status_updated
  ON public.admin_drafts(status, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_drafts_created_by
  ON public.admin_drafts(created_by, updated_at DESC);

ALTER TABLE public.admin_drafts ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_drafts TO authenticated;

DROP POLICY IF EXISTS "admins read admin drafts" ON public.admin_drafts;
CREATE POLICY "admins read admin drafts"
ON public.admin_drafts FOR SELECT TO authenticated
USING (public.admin_has_permission('content.read'));

DROP POLICY IF EXISTS "admins insert admin drafts" ON public.admin_drafts;
CREATE POLICY "admins insert admin drafts"
ON public.admin_drafts FOR INSERT TO authenticated
WITH CHECK (public.admin_has_permission('content.write'));

DROP POLICY IF EXISTS "admins update admin drafts" ON public.admin_drafts;
CREATE POLICY "admins update admin drafts"
ON public.admin_drafts FOR UPDATE TO authenticated
USING (public.admin_has_permission('content.write'))
WITH CHECK (public.admin_has_permission('content.write'));

DROP POLICY IF EXISTS "admins delete admin drafts" ON public.admin_drafts;
CREATE POLICY "admins delete admin drafts"
ON public.admin_drafts FOR DELETE TO authenticated
USING (public.admin_has_permission('content.write'));

DROP TRIGGER IF EXISTS trg_admin_drafts_updated ON public.admin_drafts;
CREATE TRIGGER trg_admin_drafts_updated
BEFORE UPDATE ON public.admin_drafts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_admin_audit_admin_drafts ON public.admin_drafts;
CREATE TRIGGER trg_admin_audit_admin_drafts
AFTER INSERT OR UPDATE OR DELETE ON public.admin_drafts
FOR EACH ROW EXECUTE FUNCTION public.capture_admin_audit();

-- Generic, atomic publication transaction with optimistic concurrency.
CREATE OR REPLACE FUNCTION public.admin_publish_drafts(
  p_draft_ids uuid[],
  p_publish_note text DEFAULT NULL
)
RETURNS TABLE (
  draft_id uuid,
  entity_type text,
  entity_id text
)
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
    RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501';
  END IF;

  IF COALESCE(array_length(p_draft_ids, 1), 0) = 0 THEN
    RAISE EXCEPTION 'No drafts selected';
  END IF;

  FOR d IN
    SELECT *
    FROM public.admin_drafts
    WHERE id = ANY(p_draft_ids)
      AND status IN ('draft','review')
    ORDER BY updated_at ASC
    FOR UPDATE
  LOOP
    IF d.entity_type = 'site_settings' THEN
      SELECT s.updated_at, s.value
      INTO current_updated_at, current_snapshot
      FROM public.site_settings s
      WHERE s.key = d.entity_id
      FOR UPDATE;

      IF d.baseline_updated_at IS DISTINCT FROM current_updated_at THEN
        RAISE EXCEPTION 'Draft is stale for site_settings:%', d.entity_id USING ERRCODE = '40001';
      END IF;

      INSERT INTO public.site_settings(key, value, updated_at)
      VALUES(d.entity_id, d.payload, now())
      ON CONFLICT(key) DO UPDATE
      SET value = EXCLUDED.value, updated_at = now();

    ELSIF d.entity_type = 'projects' THEN
      SELECT p.updated_at, to_jsonb(p)
      INTO current_updated_at, current_snapshot
      FROM public.projects p
      WHERE p.id = d.entity_id::uuid
      FOR UPDATE;

      IF d.baseline_updated_at IS DISTINCT FROM current_updated_at THEN
        RAISE EXCEPTION 'Draft is stale for projects:%', d.entity_id USING ERRCODE = '40001';
      END IF;

      INSERT INTO public.projects
      SELECT * FROM jsonb_populate_record(NULL::public.projects, d.payload)
      ON CONFLICT(id) DO UPDATE SET
        title=EXCLUDED.title, subtitle=EXCLUDED.subtitle, category=EXCLUDED.category,
        year=EXCLUDED.year, description=EXCLUDED.description, cover_url=EXCLUDED.cover_url,
        cover_width=EXCLUDED.cover_width, cover_height=EXCLUDED.cover_height,
        palette=EXCLUDED.palette, span=EXCLUDED.span, sort_order=EXCLUDED.sort_order,
        tags=EXCLUDED.tags, gallery=EXCLUDED.gallery, gallery_meta=EXCLUDED.gallery_meta,
        is_published=EXCLUDED.is_published, featured=EXCLUDED.featured,
        featured_priority=EXCLUDED.featured_priority, client_name=EXCLUDED.client_name,
        image_fit=EXCLUDED.image_fit, concept=EXCLUDED.concept, idea=EXCLUDED.idea,
        role=EXCLUDED.role, notes=EXCLUDED.notes, collaborators=EXCLUDED.collaborators,
        tools_used=EXCLUDED.tools_used, deliverables=EXCLUDED.deliverables,
        video_url=EXCLUDED.video_url, video_provider=EXCLUDED.video_provider,
        client_id=EXCLUDED.client_id, updated_at=now();

    ELSIF d.entity_type = 'clients' THEN
      SELECT c.updated_at, to_jsonb(c)
      INTO current_updated_at, current_snapshot
      FROM public.clients c
      WHERE c.id = d.entity_id::uuid
      FOR UPDATE;

      IF d.baseline_updated_at IS DISTINCT FROM current_updated_at THEN
        RAISE EXCEPTION 'Draft is stale for clients:%', d.entity_id USING ERRCODE = '40001';
      END IF;

      INSERT INTO public.clients
      SELECT * FROM jsonb_populate_record(NULL::public.clients, d.payload)
      ON CONFLICT(id) DO UPDATE SET
        name=EXCLUDED.name, logo_url=EXCLUDED.logo_url, website_url=EXCLUDED.website_url,
        logo_width=EXCLUDED.logo_width, logo_height=EXCLUDED.logo_height,
        sort_order=EXCLUDED.sort_order, is_active=EXCLUDED.is_active,
        kind=EXCLUDED.kind, updated_at=now();

    ELSIF d.entity_type = 'services' THEN
      SELECT s.updated_at, to_jsonb(s)
      INTO current_updated_at, current_snapshot
      FROM public.services s
      WHERE s.id = d.entity_id::uuid
      FOR UPDATE;

      IF d.baseline_updated_at IS DISTINCT FROM current_updated_at THEN
        RAISE EXCEPTION 'Draft is stale for services:%', d.entity_id USING ERRCODE = '40001';
      END IF;

      INSERT INTO public.services
      SELECT * FROM jsonb_populate_record(NULL::public.services, d.payload)
      ON CONFLICT(id) DO UPDATE SET
        number=EXCLUDED.number, title=EXCLUDED.title, description=EXCLUDED.description,
        icon=EXCLUDED.icon, sort_order=EXCLUDED.sort_order, is_active=EXCLUDED.is_active,
        updated_at=now();

    ELSIF d.entity_type = 'stats' THEN
      SELECT s.updated_at, to_jsonb(s)
      INTO current_updated_at, current_snapshot
      FROM public.stats s
      WHERE s.id = d.entity_id::uuid
      FOR UPDATE;

      IF d.baseline_updated_at IS DISTINCT FROM current_updated_at THEN
        RAISE EXCEPTION 'Draft is stale for stats:%', d.entity_id USING ERRCODE = '40001';
      END IF;

      INSERT INTO public.stats
      SELECT * FROM jsonb_populate_record(NULL::public.stats, d.payload)
      ON CONFLICT(id) DO UPDATE SET
        value=EXCLUDED.value, label=EXCLUDED.label,
        sort_order=EXCLUDED.sort_order, is_active=EXCLUDED.is_active,
        updated_at=now();

    ELSIF d.entity_type = 'about_method' THEN
      SELECT m.updated_at, to_jsonb(m)
      INTO current_updated_at, current_snapshot
      FROM public.about_method m
      WHERE m.id = d.entity_id::uuid
      FOR UPDATE;

      IF d.baseline_updated_at IS DISTINCT FROM current_updated_at THEN
        RAISE EXCEPTION 'Draft is stale for about_method:%', d.entity_id USING ERRCODE = '40001';
      END IF;

      INSERT INTO public.about_method
      SELECT * FROM jsonb_populate_record(NULL::public.about_method, d.payload)
      ON CONFLICT(id) DO UPDATE SET
        number=EXCLUDED.number, title=EXCLUDED.title, description=EXCLUDED.description,
        sort_order=EXCLUDED.sort_order, is_active=EXCLUDED.is_active,
        updated_at=now();
    END IF;

    UPDATE public.admin_drafts
    SET status='published',
        publish_note=p_publish_note,
        published_at=now(),
        reviewed_by=auth.uid(),
        updated_by=auth.uid(),
        updated_at=now()
    WHERE id=d.id;

    RETURN QUERY SELECT d.id, d.entity_type, d.entity_id;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_publish_drafts(uuid[], text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_publish_drafts(uuid[], text) TO authenticated;

-- Database-level health snapshot. External providers are checked server-side.
CREATE OR REPLACE FUNCTION public.admin_system_health_db()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_catalog
AS $$
DECLARE
  realtime_count integer;
  history_count bigint;
  audit_count bigint;
  storage_ready boolean;
BEGIN
  IF auth.uid() IS NULL OR NOT public.admin_has_permission('system.audit.read') THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501';
  END IF;

  SELECT count(*)::integer INTO realtime_count
  FROM pg_publication_tables
  WHERE pubname='supabase_realtime'
    AND schemaname='public'
    AND tablename IN (
      'site_settings','clients','projects','services','stats','about_method',
      'media_assets','admin_drafts',
      'contact_requests','briefing_submissions','booking_requests',
      'newsletter_subscribers','studio_waitlist','crm_leads','crm_activities',
      'crm_tasks','crm_payments'
    );

  SELECT count(*) INTO history_count FROM public.content_history;
  SELECT count(*) INTO audit_count FROM public.admin_audit_log;
  SELECT EXISTS(
    SELECT 1 FROM storage.buckets WHERE id='site-assets'
  ) INTO storage_ready;

  RETURN jsonb_build_object(
    'database', jsonb_build_object(
      'status','healthy',
      'postgres_version', current_setting('server_version')
    ),
    'realtime', jsonb_build_object(
      'status', CASE WHEN realtime_count >= 17 THEN 'healthy' ELSE 'warning' END,
      'subscribed_tables', realtime_count,
      'expected_tables', 17
    ),
    'storage', jsonb_build_object(
      'status', CASE WHEN storage_ready THEN 'healthy' ELSE 'error' END,
      'bucket','site-assets'
    ),
    'audit', jsonb_build_object(
      'status', CASE WHEN audit_count > 0 THEN 'healthy' ELSE 'warning' END,
      'events', audit_count
    ),
    'versioning', jsonb_build_object(
      'status', CASE WHEN history_count > 0 THEN 'healthy' ELSE 'warning' END,
      'versions', history_count
    )
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_system_health_db() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_system_health_db() TO authenticated;

-- Expand global audit coverage to operational and CMS entities not previously
-- attached to the immutable database trigger.
DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'services','stats','about_method','media_assets',
    'contact_requests','briefing_submissions','booking_requests',
    'newsletter_subscribers','invoice_line_items','invoice_events','admin_users'
  ]
  LOOP
    IF to_regclass('public.' || table_name) IS NOT NULL THEN
      EXECUTE format('DROP TRIGGER IF EXISTS trg_admin_audit_%I ON public.%I', table_name, table_name);
      EXECUTE format(
        'CREATE TRIGGER trg_admin_audit_%I AFTER INSERT OR UPDATE OR DELETE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.capture_admin_audit()',
        table_name, table_name
      );
    END IF;
  END LOOP;
END;
$$;

DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'site_settings','clients','projects','services','stats','about_method',
    'media_assets','contact_requests','briefing_submissions','booking_requests',
    'newsletter_subscribers','studio_waitlist','crm_leads','crm_activities',
    'crm_tasks','crm_payments','admin_drafts'
  ]
  LOOP
    IF to_regclass('public.' || table_name) IS NOT NULL
       AND NOT EXISTS (
         SELECT 1 FROM pg_publication_tables
         WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename=table_name
       )
    THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', table_name);
    END IF;
  END LOOP;
END;
$$;