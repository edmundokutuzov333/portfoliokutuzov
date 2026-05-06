-- 1. Rename existing Videos projects to Offline Actions (keeps all attachments).
UPDATE public.projects
SET category = 'Offline Actions', updated_at = now()
WHERE lower(trim(category)) IN ('videos', 'video', 'motion / content direction', 'motion');

-- 2. Featured priority on projects.
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS featured_priority integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured, featured_priority DESC);

-- 3. Update saved email in site_settings JSON values.
UPDATE public.site_settings
SET value = (
  SELECT jsonb_object_agg(
    k,
    CASE
      WHEN jsonb_typeof(v) = 'string' AND v::text ILIKE '%edmundokutuzov.mz@gmail.com%'
        THEN to_jsonb(replace(v #>> '{}', 'edmundokutuzov.mz@gmail.com', 'contact@edmundokutuzov.art'))
      ELSE v
    END
  )
  FROM jsonb_each(value) AS t(k, v)
),
updated_at = now()
WHERE value::text ILIKE '%edmundokutuzov.mz@gmail.com%';

-- 4. Briefing submissions
CREATE TABLE IF NOT EXISTS public.briefing_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  company_name text,
  position text,
  country text,
  email text NOT NULL,
  phone text,
  project_type text NOT NULL,
  urgency text NOT NULL DEFAULT 'normal',
  deadline date,
  currency text NOT NULL DEFAULT 'eur',
  budget_range text,
  exact_amount numeric,
  negotiable boolean NOT NULL DEFAULT false,
  message text NOT NULL,
  preferred_contact_method text,
  reference_project_id uuid,
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
  source text DEFAULT 'website',
  status text NOT NULL DEFAULT 'new',
  is_starred boolean NOT NULL DEFAULT false,
  admin_notes text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.briefing_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit briefing"
  ON public.briefing_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "admins read briefings"
  ON public.briefing_submissions FOR SELECT USING (is_admin());
CREATE POLICY "admins update briefings"
  ON public.briefing_submissions FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "admins delete briefings"
  ON public.briefing_submissions FOR DELETE USING (is_admin());

CREATE TRIGGER trg_briefing_submissions_updated
  BEFORE UPDATE ON public.briefing_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. Booking requests
CREATE TABLE IF NOT EXISTS public.booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  preferred_date date,
  preferred_time text,
  timezone text,
  note text,
  status text NOT NULL DEFAULT 'new',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit booking"
  ON public.booking_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "admins read bookings"
  ON public.booking_requests FOR SELECT USING (is_admin());
CREATE POLICY "admins update bookings"
  ON public.booking_requests FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "admins delete bookings"
  ON public.booking_requests FOR DELETE USING (is_admin());

CREATE TRIGGER trg_booking_requests_updated
  BEFORE UPDATE ON public.booking_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6. Newsletter subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text,
  source text DEFAULT 'contact-page',
  consent boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  resend_contact_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can subscribe"
  ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "admins read subscribers"
  ON public.newsletter_subscribers FOR SELECT USING (is_admin());
CREATE POLICY "admins update subscribers"
  ON public.newsletter_subscribers FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "admins delete subscribers"
  ON public.newsletter_subscribers FOR DELETE USING (is_admin());

CREATE TRIGGER trg_newsletter_subscribers_updated
  BEFORE UPDATE ON public.newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7. Analytics events (used in Pass B; created now so insert hooks work).
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  element text,
  action text NOT NULL,
  x integer,
  y integer,
  viewport_width integer,
  viewport_height integer,
  device text,
  session_id text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_page_created ON public.analytics_events(page, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_action_created ON public.analytics_events(action, created_at DESC);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can log analytics"
  ON public.analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "admins read analytics"
  ON public.analytics_events FOR SELECT USING (is_admin());
CREATE POLICY "admins delete analytics"
  ON public.analytics_events FOR DELETE USING (is_admin());

-- 8. Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.briefing_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.booking_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.newsletter_subscribers;