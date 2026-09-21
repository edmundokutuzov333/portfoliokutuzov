import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/server/index.server";
import { projects as staticProjects } from "@/data/projects";
import { getCorsHeaders, isCorsOriginAllowed } from "@/config/server";
import { getRequestId, logObservability } from "@/lib/observability";

const PROJECT_FIELDS = [
  "id",
  "slug",
  "title",
  "subtitle",
  "category",
  "year",
  "description",
  "cover_url",
  "cover_width",
  "cover_height",
  "gallery",
  "tags",
  "palette",
  "span",
  "sort_order",
  "is_published",
  "featured",
  "featured_priority",
  "client_name",
  "image_fit",
  "concept",
  "idea",
  "role",
  "notes",
  "collaborators",
  "tools_used",
  "deliverables",
  "gallery_meta",
  "video_url",
  "video_provider",
] as const;

const SELECT = PROJECT_FIELDS.join(",");
const MAX_PROJECTS = 500;
const FALLBACK_PROJECTS = staticProjects.map((project) => ({
  id: String(project.id),
  slug: project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  title: project.title,
  subtitle: project.subtitle || null,
  category: project.category,
  year: project.year || null,
  description: project.description || null,
  cover_url: project.coverUrl || null,
  cover_width: null,
  cover_height: null,
  gallery: [],
  tags: project.tags || [],
  palette: project.palette || null,
  span: project.span || "normal",
  sort_order: project.id,
  is_published: true,
  featured: project.id <= 3,
  featured_priority: 17 - project.id,
  client_name: project.title,
  image_fit: "contain",
  concept: null,
  idea: null,
  role: "Art Direction & Visual Design",
  notes: null,
  collaborators: [],
  tools_used: [],
  deliverables: project.tags || [],
  gallery_meta: [],
  video_url: null,
  video_provider: null,
}));


function response(request: Request, requestId: string, status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...getCorsHeaders(request),
      "X-Request-Id": requestId,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}

export const Route = createFileRoute("/api/portfolio-projects")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const requestId = getRequestId(request);
        return new Response(null, {
          status: isCorsOriginAllowed(request) ? 204 : 403,
          headers: { ...getCorsHeaders(request), "X-Request-Id": requestId },
        });
      },
      GET: async ({ request }) => {
        const requestId = getRequestId(request);
        if (!isCorsOriginAllowed(request)) {
          return response(request, requestId, 403, { error: "ORIGIN_NOT_ALLOWED" });
        }

        try {
          const db = supabaseAdmin as any;
          const { data, error } = await db
            .from("projects")
            .select(SELECT)
            .eq("is_published", true)
            .order("sort_order", { ascending: true })
            .limit(MAX_PROJECTS);

          if (error) {
            logObservability("dependency_error", {
              requestId,
              route: "/api/portfolio-projects",
              dependency: "supabase",
              code: "PUBLIC_PORTFOLIO_READ_FAILED",
              message: error.message,
            });
            return response(request, requestId, 200, {
              projects: FALLBACK_PROJECTS,
              count: FALLBACK_PROJECTS.length,
              source: "static-fallback",
            });
          }

          const projects = (data ?? []).map((project: Record<string, unknown>) => ({
            ...project,
            gallery: Array.isArray(project.gallery) ? project.gallery : [],
            tags: Array.isArray(project.tags) ? project.tags : [],
            collaborators: Array.isArray(project.collaborators) ? project.collaborators : [],
            tools_used: Array.isArray(project.tools_used) ? project.tools_used : [],
            deliverables: Array.isArray(project.deliverables) ? project.deliverables : [],
            gallery_meta: Array.isArray(project.gallery_meta) ? project.gallery_meta : [],
          }));

          return response(request, requestId, 200, {
            projects,
            count: projects.length,
          });
        } catch (error) {
          logObservability("dependency_error", {
            requestId,
            route: "/api/portfolio-projects",
            dependency: "supabase",
            code: "PUBLIC_PORTFOLIO_RUNTIME_FAILED",
            message: error instanceof Error ? error.message : String(error),
          });
          return response(request, requestId, 200, {
            projects: FALLBACK_PROJECTS,
            count: FALLBACK_PROJECTS.length,
            source: "static-fallback",
          });
        }
      },
    },
  },
});
