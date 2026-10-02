import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const runtime = "nodejs";

export const Route = createFileRoute("/api/debug-content")({
  server: {
    handlers: {
      GET: async () => {
        const db = supabaseAdmin as unknown as {
          from: (table: string) => any;
        };

        const [settings, clients, projects, reel] = await Promise.all([
          db.from("site_settings").select("key,value"),
          db.from("clients").select("id,name,logo_url,sort_order,is_active,kind").eq("kind", "client").order("sort_order"),
          db.from("projects").select("id,title,slug,category,year,cover_url,featured,sort_order,is_published").order("sort_order"),
          db.from("reel_items").select("*").eq("is_published", true).order("display_order"),
        ]);

        return Response.json({
          settings: settings.data ?? [],
          clients: clients.data ?? [],
          projects_count: Array.isArray(projects.data) ? projects.data.length : 0,
          projects: projects.data ?? [],
          reel_count: Array.isArray(reel.data) ? reel.data.length : 0,
          reel: reel.data ?? [],
          errors: {
            settings: settings.error?.message ?? null,
            clients: clients.error?.message ?? null,
            projects: projects.error?.message ?? null,
            reel: reel.error?.message ?? null,
          },
        });
      },
    },
  },
});
