import { createFileRoute } from "@tanstack/react-router";

const SITE_URL = "https://portfoliokutuzov2026.lovable.app";
const STATIC_PATHS = ["/", "/portfolio", "/services", "/credentials", "/contact"];

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!,
  );
}

async function fetchProjectSlugs(): Promise<Array<{ slug: string; updated_at?: string }>> {
  const url = process.env["VITE_SUPABASE_URL"] ?? import.meta.env["VITE_SUPABASE_URL"];
  const key =
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ??
    import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return [];
  try {
    const res = await fetch(
      `${url}/rest/v1/projects?select=slug,updated_at&is_published=eq.true`,
      { headers: { apikey: key } },
    );
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
        const projects = await fetchProjectSlugs();
        const urls = [
          ...STATIC_PATHS.map((p) => ({ loc: `${SITE_URL}${p}`, lastmod: today })),
          ...projects.map((p) => ({
            loc: `${SITE_URL}/portfolio/${p.slug}`,
            lastmod: (p.updated_at ?? today).slice(0, 10),
          })),
        ];

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${escapeXml(u.loc)}</loc><lastmod>${u.lastmod}</lastmod></url>`,
  )
  .join("\n")}
</urlset>`;

        return new Response(body, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
