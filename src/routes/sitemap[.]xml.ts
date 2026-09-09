import { createFileRoute } from "@tanstack/react-router";
import { resolvePublicSiteUrl } from "@/config/server";
import { DEFAULT_SUPABASE_PUBLISHABLE_KEY, DEFAULT_SUPABASE_URL } from "@/config/public";

const STATIC_PATHS = ["/", "/portfolio", "/services", "/credentials", "/contact"] as const;

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!);
}

function normalizeSiteUrl(value: string) {
  try {
    return new URL(value).origin;
  } catch {
    return "https://portfoliokutuzov-omega.vercel.app";
  }
}

async function fetchProjectSlugs(): Promise<Array<{ slug: string; updated_at?: string }>> {
  const url = process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY;
  try {
    const res = await fetch(
      `${url}/rest/v1/projects?select=slug,updated_at&is_published=eq.true&slug=not.is.null&order=updated_at.desc`,
      { headers: { apikey: key, Accept: "application/json" } },
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as Array<{ slug: string | null; updated_at?: string }>;
    return rows.filter((row): row is { slug: string; updated_at?: string } => Boolean(row.slug));
  } catch {
    return [];
  }
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);
        const siteUrl = normalizeSiteUrl(resolvePublicSiteUrl());
        const projects = await fetchProjectSlugs();
        const urls = [
          ...STATIC_PATHS.map((path) => ({ loc: `${siteUrl}${path}`, lastmod: today })),
          ...projects.map((project) => ({
            loc: `${siteUrl}/portfolio/${encodeURIComponent(project.slug)}`,
            lastmod: (project.updated_at ?? today).slice(0, 10),
          })),
        ];

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${escapeXml(url.loc)}</loc><lastmod>${url.lastmod}</lastmod></url>`).join("\n")}
</urlset>`;

        return new Response(body, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
          },
        });
      },
    },
  },
});
