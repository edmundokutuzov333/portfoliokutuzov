
-- ============ admin_users (criada primeiro para a função is_admin) ============
CREATE TABLE public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid());
$$;

CREATE POLICY "admins read admin_users" ON public.admin_users FOR SELECT USING (public.is_admin());
CREATE POLICY "admins manage admin_users" ON public.admin_users FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- site_settings
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "admins write site_settings" ON public.site_settings FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- clients
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  website_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read active clients" ON public.clients FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "admins write clients" ON public.clients FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- projects
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  category text NOT NULL,
  year text,
  description text,
  cover_url text,
  gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  palette text,
  span text DEFAULT 'normal',
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published projects" ON public.projects FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "admins write projects" ON public.projects FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- services
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text,
  title text NOT NULL,
  description text,
  icon text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read active services" ON public.services FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "admins write services" ON public.services FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- stats
CREATE TABLE public.stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  value text NOT NULL,
  label text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read active stats" ON public.stats FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "admins write stats" ON public.stats FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER trg_stats_updated BEFORE UPDATE ON public.stats FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- about_method
CREATE TABLE public.about_method (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL,
  title text NOT NULL,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.about_method ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read active about_method" ON public.about_method FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "admins write about_method" ON public.about_method FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER trg_about_method_updated BEFORE UPDATE ON public.about_method FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.clients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
ALTER PUBLICATION supabase_realtime ADD TABLE public.stats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.about_method;

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public read site-assets" ON storage.objects FOR SELECT USING (bucket_id = 'site-assets');
CREATE POLICY "admins upload site-assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-assets' AND public.is_admin());
CREATE POLICY "admins update site-assets" ON storage.objects FOR UPDATE USING (bucket_id = 'site-assets' AND public.is_admin());
CREATE POLICY "admins delete site-assets" ON storage.objects FOR DELETE USING (bucket_id = 'site-assets' AND public.is_admin());
