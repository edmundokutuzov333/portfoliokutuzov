-- Finance settings must require finance permission at the database boundary.
DROP POLICY IF EXISTS "admins insert site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "admins update site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "admins delete site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "admins read site_settings" ON public.site_settings;

CREATE POLICY "admins read site_settings" ON public.site_settings FOR SELECT TO authenticated
USING (public.is_admin() AND (key <> 'invoice_settings' OR public.admin_has_permission('finance.read')));

CREATE POLICY "admins insert site_settings" ON public.site_settings FOR INSERT TO authenticated
WITH CHECK (public.admin_has_permission('content.write') AND (key <> 'invoice_settings' OR public.admin_has_permission('finance.write')));

CREATE POLICY "admins update site_settings" ON public.site_settings FOR UPDATE TO authenticated
USING (public.admin_has_permission('content.write') AND (key <> 'invoice_settings' OR public.admin_has_permission('finance.write')))
WITH CHECK (public.admin_has_permission('content.write') AND (key <> 'invoice_settings' OR public.admin_has_permission('finance.write')));

CREATE POLICY "admins delete site_settings" ON public.site_settings FOR DELETE TO authenticated
USING (public.admin_has_permission('content.write') AND (key <> 'invoice_settings' OR public.admin_has_permission('finance.write')));
