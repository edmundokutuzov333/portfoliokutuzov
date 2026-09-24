import { createFileRoute } from "@tanstack/react-router";
import { getCaseStudyBySlug } from "@/lib/case-study.server";
import { firstHexColor, projectDisplayName } from "@/lib/case-study";
import { SITE_NAME } from "@/lib/seo";

export const runtime = "nodejs";

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  })[character] || character);
}

function shorten(value: string, max = 180): string {
  const text = value.trim().replace(/\s+/g, " ");
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

// @ts-expect-error Server-only TanStack route is intentionally outside generated FileRoutesByPath.
export const Route = createFileRoute("/api/portfolio/$slug/og")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const payload = await getCaseStudyBySlug(params.slug);
          if (!payload) return new Response("Not found", { status: 404 });

          const project = payload.project;
          const work = firstHexColor(project.palette);
          const title = escapeXml(projectDisplayName(project));
          const projectTitle = escapeXml(project.title);
          const client = escapeXml(project.client_name || "");
          const description = escapeXml(
            shorten(project.description || project.subtitle || "Portfolio case study"),
          );
          const year = escapeXml(project.year || "");
          const category = escapeXml(project.category || "");

          const svg =
            '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">' +
            '<rect width="1200" height="630" fill="#000000"/>' +
            '<rect x="0" y="0" width="1200" height="18" fill="' + work + '"/>' +
            '<text x="72" y="92" fill="#B9B7B0" font-family="Arial, Helvetica, sans-serif" font-size="24">' +
            escapeXml(SITE_NAME) +
            "</text>" +
            '<text x="72" y="260" fill="#F2F2EF" font-family="Arial, Helvetica, sans-serif" font-size="74" font-weight="700">' +
            title +
            "</text>" +
            '<text x="72" y="316" fill="#F2F2EF" font-family="Arial, Helvetica, sans-serif" font-size="30">' +
            projectTitle +
            "</text>" +
            '<text x="72" y="378" fill="' + work + '" font-family="Arial, Helvetica, sans-serif" font-size="22">' +
            client +
            (client && year ? " · " : "") +
            year +
            (category ? " · " + category : "") +
            "</text>" +
            '<text x="72" y="466" fill="#B9B7B0" font-family="Arial, Helvetica, sans-serif" font-size="25">' +
            description +
            "</text>" +
            '<text x="72" y="566" fill="#F2F2EF" font-family="Arial, Helvetica, sans-serif" font-size="20">edmundokutuzov.art/portfolio/' +
            escapeXml(params.slug) +
            "</text></svg>";

          return new Response(svg, {
            status: 200,
            headers: {
              "Content-Type": "image/svg+xml; charset=utf-8",
              "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
              "X-Content-Type-Options": "nosniff",
            },
          });
        } catch {
          return new Response("OG image generation failed.", { status: 500 });
        }
      },
    },
  },
});
