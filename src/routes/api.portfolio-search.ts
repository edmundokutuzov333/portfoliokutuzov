import { createFileRoute } from "@tanstack/react-router";
import { getProductionProjects, type NormalizedProject } from "@/lib/ai/knowledge";
import { getCorsHeaders, isCorsOriginAllowed } from "@/config/server";

const MAX_QUERY_LENGTH = 120;
const MAX_RESULTS = 24;

function normalize(value: string) {
  return value
    .toLocaleLowerCase("en")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function tokens(value: string) {
  return normalize(value)
    .split(/[^a-z0-9+]+/i)
    .filter((token) => token.length > 1);
}

function score(project: NormalizedProject, query: string) {
  const q = tokens(query);
  if (q.length === 0) return project.featured ? 2 : 1;
  const fields = [
    [project.title, 9],
    [project.client, 8],
    [project.category, 7],
    [project.discipline, 7],
    [project.tags.join(" "), 6],
    [project.services.join(" "), 5],
    [project.description, 3],
    [project.role, 2],
    [project.year, 2],
  ] as const;
  let total = 0;
  for (const [field, weight] of fields) {
    const haystack = normalize(field);
    for (const token of q) {
      if (haystack === token) total += weight * 2;
      else if (haystack.includes(token)) total += weight;
    }
  }
  return total + (project.featured ? 1 : 0);
}

export const Route = createFileRoute("/api/portfolio-search")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!isCorsOriginAllowed(request)) {
          return new Response(JSON.stringify({ error: "ORIGIN_NOT_ALLOWED" }), {
            status: 403,
            headers: { ...getCorsHeaders(request), "Content-Type": "application/json" },
          });
        }

        const url = new URL(request.url);
        const rawQuery = url.searchParams.get("q") ?? "";
        const query = rawQuery.slice(0, MAX_QUERY_LENGTH);
        const projects = await getProductionProjects();
        const results = projects
          .map((project) => ({ project, score: score(project, query) }))
          .filter(({ score: value }) => query.trim() === "" || value > 0)
          .sort((a, b) => b.score - a.score || a.project.title.localeCompare(b.project.title))
          .slice(0, MAX_RESULTS)
          .map(({ project }) => ({
            id: project.id,
            title: project.title,
            client: project.client,
            year: project.year,
            category: project.category,
            discipline: project.discipline,
            description: project.description,
            slug: project.slug,
            thumbnail: project.thumbnail,
            tags: project.tags,
            featured: project.featured,
          }));

        return new Response(JSON.stringify({ query, count: results.length, results }), {
          status: 200,
          headers: {
            ...getCorsHeaders(request),
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=30, stale-while-revalidate=120",
          },
        });
      },
    },
  },
});
