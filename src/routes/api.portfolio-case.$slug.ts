import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/server/index.server";
import { logObservability, getRequestId } from "@/lib/observability";

const PROJECT_SELECT = [
  "id","slug","title","subtitle","category","year","description","cover_url","cover_width","cover_height",
  "gallery","tags","palette","span","sort_order","is_published","featured","featured_priority","client_name",
  "image_fit","concept","idea","role","notes","collaborators","tools_used","deliverables","gallery_meta",
  "video_url","video_provider","client_id",
].join(",");

type JsonRecord = Record<string, unknown>;

function json(request: Request, status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      "X-Request-Id": getRequestId(request),
    },
  });
}

function normalizeArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

export const Route = createFileRoute("/api/portfolio-case/$slug")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const slug = params.slug.trim();
        if (!slug || slug.length > 180) return json(request, 400, { error: "INVALID_SLUG" });
        const requestId = getRequestId(request);

        const bySlug = await supabaseAdmin
          .from("projects")
          .select(PROJECT_SELECT)
          .eq("is_published", true)
          .eq("slug", slug)
          .maybeSingle();

        let project = bySlug.data;
        if (!project && /^[0-9a-f-]{36}$/i.test(slug)) {
          const byId = await supabaseAdmin
            .from("projects")
            .select(PROJECT_SELECT)
            .eq("is_published", true)
            .eq("id", slug)
            .maybeSingle();
          project = byId.data;
        }

        if (bySlug.error || (!project && slug.length > 0 && /^[0-9a-f-]{36}$/i.test(slug))) {
          const error = bySlug.error;
          if (error) {
            logObservability("dependency_error", {
              requestId,
              route: "/api/portfolio-case/$slug",
              dependency: "supabase",
              code: "PUBLIC_CASE_READ_FAILED",
              message: error.message,
            });
            return json(request, 502, { error: "PORTFOLIO_CASE_READ_FAILED" });
          }
        }

        if (!project) return json(request, 404, { error: "PORTFOLIO_CASE_NOT_FOUND" });

        const [
          sectionsResult,
          mediaResult,
          metricsResult,
          creditsResult,
          relationsResult,
        ] = await Promise.all([
          supabaseAdmin
            .from("project_sections")
            .select("id,section_type,heading,body,sort_order")
            .eq("project_id", project.id)
            .eq("is_published", true)
            .order("sort_order", { ascending: true }),
          supabaseAdmin
            .from("project_media")
            .select("id,media_type,url,poster_url,alt,caption,width,height,sort_order,is_featured")
            .eq("project_id", project.id)
            .eq("is_published", true)
            .order("sort_order", { ascending: true }),
          supabaseAdmin
            .from("project_metrics")
            .select("id,label,value,sort_order")
            .eq("project_id", project.id)
            .order("sort_order", { ascending: true }),
          supabaseAdmin
            .from("project_credits")
            .select("id,role,name,organization,sort_order")
            .eq("project_id", project.id)
            .order("sort_order", { ascending: true }),
          supabaseAdmin
            .from("project_relations")
            .select("id,related_project_id,relation_type,sort_order")
            .eq("project_id", project.id)
            .order("sort_order", { ascending: true }),
        ]);

        const childError =
          sectionsResult.error ??
          mediaResult.error ??
          metricsResult.error ??
          creditsResult.error ??
          relationsResult.error;

        if (childError) {
          logObservability("dependency_error", {
            requestId,
            route: "/api/portfolio-case/$slug",
            dependency: "supabase",
            code: "PUBLIC_CASE_CHILD_READ_FAILED",
            message: childError.message,
          });
          return json(request, 502, { error: "PORTFOLIO_CASE_READ_FAILED" });
        }

        const relations = (relationsResult.data ?? []) as Array<{
          id: string;
          related_project_id: string;
          relation_type: string;
          sort_order: number;
        }>;

        const relatedIds = [...new Set(relations.map((r) => r.related_project_id))];
        let related: JsonRecord[] = [];
        if (relatedIds.length) {
          const result = await supabaseAdmin
            .from("projects")
            .select("id,slug,title,subtitle,category,year,cover_url,cover_width,cover_height,palette,client_name,is_published,sort_order")
            .eq("is_published", true)
            .in("id", relatedIds);
          if (result.error) {
            logObservability("dependency_error", {
              requestId,
              route: "/api/portfolio-case/$slug",
              dependency: "supabase",
              code: "PUBLIC_CASE_RELATED_READ_FAILED",
              message: result.error.message,
            });
            return json(request, 502, { error: "PORTFOLIO_CASE_READ_FAILED" });
          }
          const order = new Map(relatedIds.map((id, index) => [id, index]));
          related = (result.data ?? []).sort(
            (a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999),
          ) as JsonRecord[];
        }

        const normalizedProject = {
          ...project,
          gallery: normalizeArray(project.gallery),
          tags: normalizeArray(project.tags),
          collaborators: normalizeArray(project.collaborators),
          tools_used: normalizeArray(project.tools_used),
          deliverables: normalizeArray(project.deliverables),
          gallery_meta: normalizeArray(project.gallery_meta),
        };

        return json(request, 200, {
          project: normalizedProject,
          sections: sectionsResult.data ?? [],
          media: mediaResult.data ?? [],
          metrics: metricsResult.data ?? [],
          credits: creditsResult.data ?? [],
          relations,
          related,
        });
      },
    },
  },
});
