import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/server/index.server";
import { getCorsHeaders, isCorsOriginAllowed } from "@/config/server";
import { getRequestId, logObservability } from "@/lib/observability";
import { normalizeCategory, PROJECT_CATEGORIES } from "@/lib/cms";

const PROJECT_FIELDS = [
  "id","slug","title","subtitle","category","year","description","cover_url","cover_width","cover_height",
  "gallery","tags","palette","span","sort_order","is_published","featured","featured_priority","client_name",
  "image_fit","concept","idea","role","notes","collaborators","tools_used","deliverables","gallery_meta",
  "video_url","video_provider",
] as const;

const SELECT = PROJECT_FIELDS.join(",");
const MAX_PROJECTS = 500;
const DEFAULT_LIMIT = 24;

type ProjectRecord = Record<string, unknown>;

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

function listParam(value: string | null) {
  return [...new Set(
    (value ?? "")
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean),
  )];
}

function normalizeText(value: unknown) {
  return String(value ?? "").trim().toLocaleLowerCase("en");
}

function searchable(project: ProjectRecord, query: string) {
  if (!query) return true;
  const haystack = [
    project.title,
    project.client_name,
    project.year,
    project.category,
    project.role,
    project.concept,
    project.idea,
    project.description,
    ...(Array.isArray(project.tags) ? project.tags : []),
    ...(Array.isArray(project.deliverables) ? project.deliverables : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("en");
  return haystack.includes(query);
}

function filterProjects(projects: ProjectRecord[], {
  categories,
  years,
  clients,
  query,
}: {
  categories: string[];
  years: string[];
  clients: string[];
  query: string;
}) {
  return projects.filter((project) => {
    if (categories.length && !categories.includes(normalizeCategory(String(project.category ?? "")))) return false;
    if (years.length && !years.includes(String(project.year ?? "").trim())) return false;
    if (clients.length && !clients.some((client) => normalizeText(project.client_name) === normalizeText(client))) return false;
    return searchable(project, query);
  });
}

function facetMap(projects: ProjectRecord[], key: "category" | "year" | "client") {
  const map = new Map<string, number>();
  for (const project of projects) {
    const value =
      key === "category"
        ? normalizeCategory(String(project.category ?? ""))
        : key === "year"
          ? String(project.year ?? "").trim()
          : String(project.client_name ?? "").trim();
    if (!value) continue;
    map.set(value, (map.get(value) ?? 0) + 1);
  }
  return Object.fromEntries([...map.entries()].sort((a, b) => a[0].localeCompare(b[0])));
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

        const url = new URL(request.url);
        const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
        const limit = Math.min(50, Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT));
        const slug = url.searchParams.get("slug")?.trim() || "";
        const categories = listParam(url.searchParams.get("d"));
        const years = listParam(url.searchParams.get("y"));
        const clients = listParam(url.searchParams.get("c"));
        const query = normalizeText(url.searchParams.get("q"));

        const db = supabaseAdmin as {
          from: (table: string) => {
            select: (fields: string) => {
              eq: (column: string, value: unknown) => unknown;
              order: (column: string, options: unknown) => unknown;
              limit: (count: number) => Promise<{ data: ProjectRecord[] | null; error: { message: string } | null }>;
            };
          };
        };

        const queryBuilder = db
          .from("projects")
          .select(SELECT) as any;
        const { data, error } = await queryBuilder
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
          return response(request, requestId, 502, { error: "PORTFOLIO_READ_FAILED" });
        }

        const projects = (data ?? []).map((project) => ({
          ...project,
          gallery: Array.isArray(project.gallery) ? project.gallery : [],
          tags: Array.isArray(project.tags) ? project.tags : [],
          collaborators: Array.isArray(project.collaborators) ? project.collaborators : [],
          tools_used: Array.isArray(project.tools_used) ? project.tools_used : [],
          deliverables: Array.isArray(project.deliverables) ? project.deliverables : [],
          gallery_meta: Array.isArray(project.gallery_meta) ? project.gallery_meta : [],
        }));

        if (slug) {
          const project = projects.find((item) => String(item.slug ?? item.id) === slug);
          return response(request, requestId, 200, {
            projects: project ? [project] : [],
            count: project ? 1 : 0,
            page: 1,
            limit: 1,
            total: project ? 1 : 0,
            hasMore: false,
          });
        }

        const queryBase = filterProjects(projects, { categories: [], years, clients, query });
        const yearBase = filterProjects(projects, { categories, years: [], clients, query });
        const clientBase = filterProjects(projects, { categories, years, clients: [], query });
        const filtered = filterProjects(projects, { categories, years, clients, query });

        const start = (page - 1) * limit;
        const paged = filtered.slice(start, start + limit);
        const nextPage = start + limit < filtered.length ? page + 1 : null;

        return response(request, requestId, 200, {
          projects: paged,
          count: paged.length,
          total: filtered.length,
          page,
          limit,
          nextPage,
          hasMore: nextPage !== null,
          facets: {
            categories: facetMap(yearBase, "category"),
            years: facetMap(queryBase, "year"),
            clients: facetMap(clientBase, "client"),
            categoryOrder: PROJECT_CATEGORIES,
          },
        });
      },
    },
  },
});
