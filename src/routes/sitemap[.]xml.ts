import { createFileRoute } from "@tanstack/react-router";
import { DEFAULT_SUPABASE_PUBLISHABLE_KEY, DEFAULT_SUPABASE_URL } from "@/config/public";
import { resolvePublicSiteUrl } from "@/config/server";

const STATIC_PATHS = ["/", "/portfolio", "/services", "/credentials", "/contact", "/studio"] as const;
const FALLBACK_ORIGIN = "https://portfoliokutuzov-omega.vercel.app";
function origin(value: string) {
  try {
    return new URL(value).origin;
  } catch {
    return FALLBACK_ORIGIN;
  }
}
function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!);
}
async function fetchProjectSlugs() {
  const url = process.env.VITE_SUPABASE_URL ?? DEFAULT_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? DEFAULT_SUPABASE_PUBLISHABLE_KEY;
  try {
    const res = await fetch(`${url}/rest/v1/projects?select=slug,updated_at&is_published=eq.true&slug=not.is.null&order=updated_at.desc`, { headers: { apikey: key, Accept: "application/json" } });
    if (!res.ok) return [];
    const rows = (await res.json()) as Array<{ slug: string | null; updated_at?: string }>;
    return rows.filter((r): r is { slug: string; updated_at?: string } => Boolean(r.slug));
  } catch {
    return [];
  }
}
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);
        const site = origin(resolvePublicSiteUrl());
        const projects = await fetchProjectSlugs();
        const urls = [
          ...STATIC_PATHS.map((path) => ({ loc: `${site}${path}`, lastmod: today })),
          ...projects.map((p) => ({ loc: `${site}/portfolio/${encodeURIComponent(p.slug)}`, lastmod: (p.updated_at ?? today).slice(0, 10) })),
        ];
        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${escapeXml(u.loc)}</loc><lastmod>${u.lastmod}</lastmod></url>`).join("\n")}\n</urlset>`;
        return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" } });
      },
    },
  },
});
