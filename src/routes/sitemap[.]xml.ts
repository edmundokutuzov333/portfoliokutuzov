import { createFileRoute } from "@tanstack/react-router";

const SITE_URL = "https://portfoliokutuzov.lovable.app";

const STATIC_PATHS: { path: string; priority: string; changefreq: string }[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/portfolio", priority: "0.9", changefreq: "weekly" },
  { path: "/services", priority: "0.8", changefreq: "monthly" },
  { path: "/credentials", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
];

async function fetchProjectSlugs(): Promise<{ slug: string; updated: string | null }[]> {
  try {
    const url = process.env["VITE_SUPABASE_URL"];
    const key = process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) return [];
    const res = await fetch(
      `${url}/rest/v1/projects?select=slug,updated_at&published=eq.true&order=updated_at.desc`,
      { headers: { apikey: key } },
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as { slug: string | null; updated_at: string | null }[];
    return rows
      .filter((r): r is { slug: string; updated_at: string | null } => Boolean(r.slug))
      .map((r) => ({ slug: r.slug, updated: r.updated_at }));
  } catch {
    return [];
  }
}

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);
        const projects = await fetchProjectSlugs();

        const entries = [
          ...STATIC_PATHS.map(
            (p) => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
          ),
          ...projects.map(
            (p) => `  <url>
    <loc>${SITE_URL}/portfolio/${escapeXml(encodeURIComponent(p.slug))}</loc>
    <lastmod>${(p.updated ?? today).slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`,
          ),
        ].join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;

        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
