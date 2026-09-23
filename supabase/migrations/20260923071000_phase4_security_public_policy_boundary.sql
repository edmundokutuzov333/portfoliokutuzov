-- Phase 4.1 security boundary hardening
-- Public reads remain public; administrative predicates become authenticated-only.

DROP POLICY IF EXISTS "public read active about_method" ON public.about_method;
CREATE POLICY "public read active about_method" ON public.about_method FOR SELECT TO public USING (is_active = true);
DROP POLICY IF EXISTS "admins read about_method" ON public.about_method;
CREATE POLICY "admins read about_method" ON public.about_method FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "public read active clients" ON public.clients;
CREATE POLICY "public read active clients" ON public.clients FOR SELECT TO public USING (is_active = true);
DROP POLICY IF EXISTS "admins read clients" ON public.clients;
CREATE POLICY "admins read clients" ON public.clients FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "public read published projects" ON public.projects;
CREATE POLICY "public read published projects" ON public.projects FOR SELECT TO public USING (is_published = true);
DROP POLICY IF EXISTS "admins read projects" ON public.projects;
CREATE POLICY "admins read projects" ON public.projects FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "public read active services" ON public.services;
CREATE POLICY "public read active services" ON public.services FOR SELECT TO public USING (is_active = true);
DROP POLICY IF EXISTS "admins read services" ON public.services;
CREATE POLICY "admins read services" ON public.services FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "public read active stats" ON public.stats;
CREATE POLICY "public read active stats" ON public.stats FOR SELECT TO public USING (is_active = true);
DROP POLICY IF EXISTS "admins read stats" ON public.stats;
CREATE POLICY "admins read stats" ON public.stats FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "admins delete analytics" ON public.analytics_events;
CREATE POLICY "admins delete analytics" ON public.analytics_events FOR DELETE TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "admins read analytics" ON public.analytics_events;
CREATE POLICY "admins read analytics" ON public.analytics_events FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "admins manage contact_requests" ON public.contact_requests;
CREATE POLICY "admins manage contact_requests" ON public.contact_requests FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admins write content_history" ON public.content_history;
CREATE POLICY "admins write content_history" ON public.content_history FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
