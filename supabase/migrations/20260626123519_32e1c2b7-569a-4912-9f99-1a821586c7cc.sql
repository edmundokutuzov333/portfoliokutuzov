-- slugify is a pure helper; make it INVOKER and revoke API exposure
ALTER FUNCTION public.slugify(text) SECURITY INVOKER;
REVOKE ALL ON FUNCTION public.slugify(text) FROM PUBLIC, anon, authenticated;

-- projects_set_slug only runs as a trigger; revoke direct callability
REVOKE ALL ON FUNCTION public.projects_set_slug() FROM PUBLIC, anon, authenticated;