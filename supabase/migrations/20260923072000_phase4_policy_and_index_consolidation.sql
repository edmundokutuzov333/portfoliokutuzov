-- Performance and policy consolidation.
-- Public site reads use anon only; authenticated admin access is explicitly permission-gated.

DROP POLICY IF EXISTS "admins write about_method" ON public.about_method;
CREATE POLICY "admins insert about_method" ON public.about_method FOR INSERT TO authenticated WITH CHECK (admin_has_permission('content.write'));
CREATE POLICY "admins update about_method" ON public.about_method FOR UPDATE TO authenticated USING (admin_has_permission('content.write')) WITH CHECK (admin_has_permission('content.write'));
CREATE POLICY "admins delete about_method" ON public.about_method FOR DELETE TO authenticated USING (admin_has_permission('content.write'));
DROP POLICY IF EXISTS "public read active about_method" ON public.about_method;
CREATE POLICY "public read active about_method" ON public.about_method FOR SELECT TO anon USING (is_active = true);

DROP POLICY IF EXISTS "admins write clients" ON public.clients;
CREATE POLICY "admins insert clients" ON public.clients FOR INSERT TO authenticated WITH CHECK (admin_has_permission('content.write'));
CREATE POLICY "admins update clients" ON public.clients FOR UPDATE TO authenticated USING (admin_has_permission('content.write')) WITH CHECK (admin_has_permission('content.write'));
CREATE POLICY "admins delete clients" ON public.clients FOR DELETE TO authenticated USING (admin_has_permission('content.write'));
DROP POLICY IF EXISTS "public read active clients" ON public.clients;
CREATE POLICY "public read active clients" ON public.clients FOR SELECT TO anon USING (is_active = true);

DROP POLICY IF EXISTS "admins write projects" ON public.projects;
CREATE POLICY "admins insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (admin_has_permission('content.write'));
CREATE POLICY "admins update projects" ON public.projects FOR UPDATE TO authenticated USING (admin_has_permission('content.write')) WITH CHECK (admin_has_permission('content.write'));
CREATE POLICY "admins delete projects" ON public.projects FOR DELETE TO authenticated USING (admin_has_permission('content.write'));
DROP POLICY IF EXISTS "public read published projects" ON public.projects;
CREATE POLICY "public read published projects" ON public.projects FOR SELECT TO anon USING (is_published = true);

DROP POLICY IF EXISTS "admins write services" ON public.services;
CREATE POLICY "admins insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (admin_has_permission('content.write'));
CREATE POLICY "admins update services" ON public.services FOR UPDATE TO authenticated USING (admin_has_permission('content.write')) WITH CHECK (admin_has_permission('content.write'));
CREATE POLICY "admins delete services" ON public.services FOR DELETE TO authenticated USING (admin_has_permission('content.write'));
DROP POLICY IF EXISTS "public read active services" ON public.services;
CREATE POLICY "public read active services" ON public.services FOR SELECT TO anon USING (is_active = true);

DROP POLICY IF EXISTS "admins write stats" ON public.stats;
CREATE POLICY "admins insert stats" ON public.stats FOR INSERT TO authenticated WITH CHECK (admin_has_permission('content.write'));
CREATE POLICY "admins update stats" ON public.stats FOR UPDATE TO authenticated USING (admin_has_permission('content.write')) WITH CHECK (admin_has_permission('content.write'));
CREATE POLICY "admins delete stats" ON public.stats FOR DELETE TO authenticated USING (admin_has_permission('content.write'));
DROP POLICY IF EXISTS "public read active stats" ON public.stats;
CREATE POLICY "public read active stats" ON public.stats FOR SELECT TO anon USING (is_active = true);

DROP POLICY IF EXISTS "admins write site_settings" ON public.site_settings;
CREATE POLICY "admins insert site_settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (admin_has_permission('content.write'));
CREATE POLICY "admins update site_settings" ON public.site_settings FOR UPDATE TO authenticated USING (admin_has_permission('content.write')) WITH CHECK (admin_has_permission('content.write'));
CREATE POLICY "admins delete site_settings" ON public.site_settings FOR DELETE TO authenticated USING (admin_has_permission('content.write'));
DROP POLICY IF EXISTS "public read site_settings" ON public.site_settings;
CREATE POLICY "public read site_settings" ON public.site_settings FOR SELECT TO anon USING (true);
CREATE POLICY "admins read site_settings" ON public.site_settings FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "admins read admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "anyone can log analytics" ON public.analytics_events;

DROP POLICY IF EXISTS "admins delete contact_requests" ON public.contact_requests;
DROP POLICY IF EXISTS "admins read contact_requests" ON public.contact_requests;
DROP POLICY IF EXISTS "admins update contact_requests" ON public.contact_requests;
DROP POLICY IF EXISTS "admins manage contact_requests" ON public.contact_requests;
CREATE POLICY "admins read contact_requests" ON public.contact_requests FOR SELECT TO authenticated USING (admin_has_permission('leads.read'));
CREATE POLICY "admins update contact_requests" ON public.contact_requests FOR UPDATE TO authenticated USING (admin_has_permission('leads.write')) WITH CHECK (admin_has_permission('leads.write'));
CREATE POLICY "admins delete contact_requests" ON public.contact_requests FOR DELETE TO authenticated USING (admin_has_permission('leads.write'));

DROP POLICY IF EXISTS "admins write content_history" ON public.content_history;
CREATE POLICY "admins insert content_history" ON public.content_history FOR INSERT TO authenticated WITH CHECK (admin_has_permission('content.write'));
CREATE POLICY "admins update content_history" ON public.content_history FOR UPDATE TO authenticated USING (admin_has_permission('content.write')) WITH CHECK (admin_has_permission('content.write'));
CREATE POLICY "admins delete content_history" ON public.content_history FOR DELETE TO authenticated USING (admin_has_permission('content.write'));

DROP POLICY IF EXISTS "admins read private media assets" ON public.media_assets;
DROP POLICY IF EXISTS "public read media assets" ON public.media_assets;
CREATE POLICY "public read media assets" ON public.media_assets FOR SELECT TO anon USING (is_public = true);

DROP POLICY IF EXISTS "studio cards authenticated own access" ON public.studio_cards;
CREATE POLICY "studio cards authenticated own access" ON public.studio_cards FOR ALL TO authenticated
USING (((select auth.uid())::text = session_id))
WITH CHECK (((select auth.uid())::text = session_id));

DROP INDEX IF EXISTS public.idx_analytics_action_created;
DROP INDEX IF EXISTS public.idx_analytics_page_created;
