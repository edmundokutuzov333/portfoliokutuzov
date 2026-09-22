-- Phase 1: Admin Control Kernel
-- Central permissions, transactional reorder, automatic version history,
-- and immutable administrator audit logging.

-- ---------------------------------------------------------------------------
-- Permissions
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.admin_has_permission(p_permission text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  SELECT CASE lower(coalesce(u.role, ''))
    WHEN 'owner' THEN true
    WHEN 'admin' THEN true
    WHEN 'editor' THEN lower(p_permission) IN (
      'content.read',
      'content.write',
      'media.manage',
      'system.audit.read'
    )
    WHEN 'finance' THEN lower(p_permission) IN (
      'leads.read',
      'leads.write',
      'finance.read',
      'finance.write'
    )
    ELSE false
  END
  FROM public.admin_users u
  WHERE u.user_id = auth.uid()
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.admin_has_permission(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_has_permission(text) TO authenticated;

-- Content write policies now honour the role matrix instead of only checking
-- for membership in admin_users.
DROP POLICY IF EXISTS "admins write site_settings" ON public.site_settings;
CREATE POLICY "admins write site_settings"
ON public.site_settings
FOR ALL
USING (public.admin_has_permission('content.write'))
WITH CHECK (public.admin_has_permission('content.write'));

DROP POLICY IF EXISTS "admins write clients" ON public.clients;
CREATE POLICY "admins write clients"
ON public.clients
FOR ALL
USING (public.admin_has_permission('content.write'))
WITH CHECK (public.admin_has_permission('content.write'));

DROP POLICY IF EXISTS "admins write projects" ON public.projects;
CREATE POLICY "admins write projects"
ON public.projects
FOR ALL
USING (public.admin_has_permission('content.write'))
WITH CHECK (public.admin_has_permission('content.write'));

DROP POLICY IF EXISTS "admins write services" ON public.services;
CREATE POLICY "admins write services"
ON public.services
FOR ALL
USING (public.admin_has_permission('content.write'))
WITH CHECK (public.admin_has_permission('content.write'));

DROP POLICY IF EXISTS "admins write stats" ON public.stats;
CREATE POLICY "admins write stats"
ON public.stats
FOR ALL
USING (public.admin_has_permission('content.write'))
WITH CHECK (public.admin_has_permission('content.write'));

DROP POLICY IF EXISTS "admins write about_method" ON public.about_method;
CREATE POLICY "admins write about_method"
ON public.about_method
FOR ALL
USING (public.admin_has_permission('content.write'))
WITH CHECK (public.admin_has_permission('content.write'));

-- Media operations use a dedicated permission.
DROP POLICY IF EXISTS "admins upload site-assets" ON storage.objects;
CREATE POLICY "admins upload site-assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-assets' AND public.admin_has_permission('media.manage'));

DROP POLICY IF EXISTS "admins update site-assets" ON storage.objects;
CREATE POLICY "admins update site-assets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'site-assets' AND public.admin_has_permission('media.manage'))
WITH CHECK (bucket_id = 'site-assets' AND public.admin_has_permission('media.manage'));

DROP POLICY IF EXISTS "admins delete site-assets" ON storage.objects;
CREATE POLICY "admins delete site-assets"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'site-assets' AND public.admin_has_permission('media.manage'));


-- Operational data permissions
DROP POLICY IF EXISTS "admins read contact_requests" ON public.contact_requests;
CREATE POLICY "admins read contact_requests"
ON public.contact_requests FOR SELECT TO public
USING (public.admin_has_permission('leads.read'));

DROP POLICY IF EXISTS "admins update contact_requests" ON public.contact_requests;
CREATE POLICY "admins update contact_requests"
ON public.contact_requests FOR UPDATE TO public
USING (public.admin_has_permission('leads.write'))
WITH CHECK (public.admin_has_permission('leads.write'));

DROP POLICY IF EXISTS "admins delete contact_requests" ON public.contact_requests;
CREATE POLICY "admins delete contact_requests"
ON public.contact_requests FOR DELETE TO public
USING (public.admin_has_permission('leads.write'));

DROP POLICY IF EXISTS "admins read briefings" ON public.briefing_submissions;
CREATE POLICY "admins read briefings"
ON public.briefing_submissions FOR SELECT TO public
USING (public.admin_has_permission('leads.read'));

DROP POLICY IF EXISTS "admins update briefings" ON public.briefing_submissions;
CREATE POLICY "admins update briefings"
ON public.briefing_submissions FOR UPDATE TO public
USING (public.admin_has_permission('leads.write') OR public.admin_has_permission('finance.write'))
WITH CHECK (public.admin_has_permission('leads.write') OR public.admin_has_permission('finance.write'));

DROP POLICY IF EXISTS "admins delete briefings" ON public.briefing_submissions;
CREATE POLICY "admins delete briefings"
ON public.briefing_submissions FOR DELETE TO public
USING (public.admin_has_permission('leads.write') OR public.admin_has_permission('finance.write'));

DROP POLICY IF EXISTS "admins read bookings" ON public.booking_requests;
CREATE POLICY "admins read bookings"
ON public.booking_requests FOR SELECT TO public
USING (public.admin_has_permission('leads.read'));

DROP POLICY IF EXISTS "admins update bookings" ON public.booking_requests;
CREATE POLICY "admins update bookings"
ON public.booking_requests FOR UPDATE TO public
USING (public.admin_has_permission('leads.write'))
WITH CHECK (public.admin_has_permission('leads.write'));

DROP POLICY IF EXISTS "admins delete bookings" ON public.booking_requests;
CREATE POLICY "admins delete bookings"
ON public.booking_requests FOR DELETE TO public
USING (public.admin_has_permission('leads.write'));

DROP POLICY IF EXISTS "admins read subscribers" ON public.newsletter_subscribers;
CREATE POLICY "admins read subscribers"
ON public.newsletter_subscribers FOR SELECT TO public
USING (public.admin_has_permission('leads.read'));

DROP POLICY IF EXISTS "admins update subscribers" ON public.newsletter_subscribers;
CREATE POLICY "admins update subscribers"
ON public.newsletter_subscribers FOR UPDATE TO public
USING (public.admin_has_permission('leads.write'))
WITH CHECK (public.admin_has_permission('leads.write'));

DROP POLICY IF EXISTS "admins delete subscribers" ON public.newsletter_subscribers;
CREATE POLICY "admins delete subscribers"
ON public.newsletter_subscribers FOR DELETE TO public
USING (public.admin_has_permission('leads.write'));

DROP POLICY IF EXISTS "Admins read invoice line items" ON public.invoice_line_items;
CREATE POLICY "Admins read invoice line items"
ON public.invoice_line_items FOR SELECT TO authenticated
USING (public.admin_has_permission('finance.read'));

DROP POLICY IF EXISTS "Admins write invoice line items" ON public.invoice_line_items;
CREATE POLICY "Admins write invoice line items"
ON public.invoice_line_items FOR ALL TO authenticated
USING (public.admin_has_permission('finance.write'))
WITH CHECK (public.admin_has_permission('finance.write'));

DROP POLICY IF EXISTS "Admins read invoice events" ON public.invoice_events;
CREATE POLICY "Admins read invoice events"
ON public.invoice_events FOR SELECT TO authenticated
USING (public.admin_has_permission('finance.read'));

DROP POLICY IF EXISTS "Admins write invoice events" ON public.invoice_events;
CREATE POLICY "Admins write invoice events"
ON public.invoice_events FOR INSERT TO authenticated
WITH CHECK (public.admin_has_permission('finance.write'));

DROP POLICY IF EXISTS "Admins read invoice counters" ON public.invoice_counters;
CREATE POLICY "Admins read invoice counters"
ON public.invoice_counters FOR SELECT TO authenticated
USING (public.admin_has_permission('finance.read'));

DROP POLICY IF EXISTS "admins read admin_users" ON public.admin_users;
CREATE POLICY "admins read admin_users"
ON public.admin_users FOR SELECT TO authenticated
USING (public.admin_has_permission('system.users.manage'));

DROP POLICY IF EXISTS "admins manage admin_users" ON public.admin_users;
CREATE POLICY "admins manage admin_users"
ON public.admin_users FOR ALL TO authenticated
USING (public.admin_has_permission('system.users.manage'))
WITH CHECK (public.admin_has_permission('system.users.manage'));

-- ---------------------------------------------------------------------------
-- Automatic version history
-- ---------------------------------------------------------------------------

ALTER TABLE public.content_history
  ADD COLUMN IF NOT EXISTS action text;

UPDATE public.content_history
SET action = coalesce(action, 'legacy')
WHERE action IS NULL;

ALTER TABLE public.content_history
  DROP CONSTRAINT IF EXISTS content_history_action_check;

ALTER TABLE public.content_history
  ADD CONSTRAINT content_history_action_check
  CHECK (action IN ('create', 'update', 'delete', 'legacy'));

CREATE OR REPLACE FUNCTION public.prune_content_history()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  DELETE FROM public.content_history
  WHERE id IN (
    SELECT id
    FROM (
      SELECT id,
             row_number() OVER (
               PARTITION BY entity_type, entity_id
               ORDER BY created_at DESC
             ) AS rn
      FROM public.content_history
      WHERE entity_type = NEW.entity_type
        AND entity_id = NEW.entity_id
    ) ranked
    WHERE ranked.rn > 20
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.capture_admin_content_version()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  payload jsonb;
  entity_id_text text;
  entity_label text;
  action_text text := lower(TG_OP);
BEGIN
  -- Only administrator-originated content changes become rollback points.
  IF auth.uid() IS NULL OR NOT public.is_admin() THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  IF TG_OP = 'DELETE' THEN
    payload := to_jsonb(OLD);
  ELSIF TG_OP = 'INSERT' THEN
    payload := to_jsonb(NEW);
  ELSE
    payload := to_jsonb(OLD);
  END IF;

  IF TG_TABLE_NAME = 'site_settings' THEN
    entity_id_text := payload ->> 'key';
  ELSE
    entity_id_text := payload ->> 'id';
  END IF;
  entity_label := COALESCE(
    payload ->> 'title',
    payload ->> 'name',
    payload ->> 'label',
    payload ->> 'key',
    entity_id_text
  );

  INSERT INTO public.content_history (
    entity_type,
    entity_id,
    snapshot,
    label,
    created_by,
    action
  )
  VALUES (
    TG_TABLE_NAME,
    COALESCE(entity_id_text, ''),
    payload,
    entity_label,
    auth.uid(),
    action_text
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

REVOKE ALL ON FUNCTION public.capture_admin_content_version() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.prune_content_history() FROM PUBLIC;

DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'site_settings',
    'clients',
    'projects',
    'services',
    'stats',
    'about_method'
  ]
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS %I ON public.%I',
      'trg_admin_version_' || table_name,
      table_name
    );
    EXECUTE format(
      'CREATE TRIGGER %I
       AFTER INSERT OR UPDATE OR DELETE ON public.%I
       FOR EACH ROW EXECUTE FUNCTION public.capture_admin_content_version()',
      'trg_admin_version_' || table_name,
      table_name
    );
  END LOOP;
END
$$;

-- ---------------------------------------------------------------------------
-- Immutable admin audit log
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email text,
  action text NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  entity_label text,
  before_data jsonb,
  after_data jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_created_at
  ON public.admin_audit_log (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_audit_entity
  ON public.admin_audit_log (entity_type, entity_id, created_at DESC);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins read audit log" ON public.admin_audit_log;
CREATE POLICY "admins read audit log"
ON public.admin_audit_log
FOR SELECT
TO authenticated
USING (public.admin_has_permission('system.audit.read'));

CREATE OR REPLACE FUNCTION public.capture_admin_audit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  before_row jsonb;
  after_row jsonb;
  entity_id_text text;
  entity_label text;
  actor_email_text text;
BEGIN
  IF auth.uid() IS NULL OR NOT public.is_admin() THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  before_row := CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE to_jsonb(OLD) END;
  after_row := CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END;

  IF TG_TABLE_NAME = 'site_settings' THEN
    entity_id_text := COALESCE(after_row ->> 'key', before_row ->> 'key');
  ELSE
    entity_id_text := COALESCE(after_row ->> 'id', before_row ->> 'id');
  END IF;

  entity_label := COALESCE(
    after_row ->> 'title',
    before_row ->> 'title',
    after_row ->> 'name',
    before_row ->> 'name',
    after_row ->> 'label',
    before_row ->> 'label',
    after_row ->> 'key',
    before_row ->> 'key',
    entity_id_text
  );

  SELECT u.email
  INTO actor_email_text
  FROM public.admin_users u
  WHERE u.user_id = auth.uid()
  LIMIT 1;

  INSERT INTO public.admin_audit_log (
    actor_user_id,
    actor_email,
    action,
    entity_type,
    entity_id,
    entity_label,
    before_data,
    after_data,
    metadata
  )
  VALUES (
    auth.uid(),
    actor_email_text,
    lower(TG_OP),
    TG_TABLE_NAME,
    coalesce(entity_id_text, ''),
    entity_label,
    before_row,
    after_row,
    jsonb_build_object('source', 'database_trigger')
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

REVOKE ALL ON FUNCTION public.capture_admin_audit() FROM PUBLIC;

DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'site_settings',
    'clients',
    'projects',
    'services',
    'stats',
    'about_method',
    'admin_users'
  ]
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS %I ON public.%I',
      'trg_admin_audit_' || table_name,
      table_name
    );
    EXECUTE format(
      'CREATE TRIGGER %I
       AFTER INSERT OR UPDATE OR DELETE ON public.%I
       FOR EACH ROW EXECUTE FUNCTION public.capture_admin_audit()',
      'trg_admin_audit_' || table_name,
      table_name
    );
  END LOOP;
END
$$;

-- ---------------------------------------------------------------------------
-- Transactional project reorder
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.admin_reorder_projects(
  p_project_id uuid,
  p_other_project_id uuid,
  p_project_order integer,
  p_other_order integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_catalog
AS $$
BEGIN
  IF NOT public.admin_has_permission('content.write') THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501';
  END IF;

  IF p_project_id = p_other_project_id THEN
    RAISE EXCEPTION 'Cannot reorder a project against itself' USING ERRCODE = '22023';
  END IF;

  UPDATE public.projects
  SET sort_order = CASE
    WHEN id = p_project_id THEN p_project_order
    WHEN id = p_other_project_id THEN p_other_order
    ELSE sort_order
  END
  WHERE id IN (p_project_id, p_other_project_id);

  IF NOT FOUND THEN
    RAISE EXCEPTION 'One or more projects were not found' USING ERRCODE = 'P0002';
  END IF;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_reorder_projects(uuid, uuid, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_reorder_projects(uuid, uuid, integer, integer) TO authenticated;
