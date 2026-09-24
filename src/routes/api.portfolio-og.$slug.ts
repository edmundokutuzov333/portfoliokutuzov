import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/server/index.server";
import { darkenWorkColor } from "@/lib/work-color";

const FALLBACK = "#2f4bff";

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  })[character] ?? character);
}

function paletteColor(palette: string | null) {
  const match = palette?.match(/#[0-9a-f]{6}\b/gi);
  return match?.at(-1) ?? FALLBACK;
}

function splitLines(value: string, max = 28) {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

export const Route = createFileRoute("/api/portfolio-og/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const slug = params.slug.trim();
        const result = await supabaseAdmin
          .from("projects")
          .select("title,client_name,year,category,palette")
          .eq("is_published", true)
          .eq("slug", slug)
          .maybeSingle();

        const title = result.data?.title ?? slug.replace(/-/g, " ");
        const client = result.data?.client_name ?? "";
        const year = result.data?.year ?? "";
        const category = result.data?.category ?? "";
        const work = paletteColor(result.data?.palette ?? null);
        const workDark = darkenWorkColor(work);
        const lines = splitLines(title);
        const titleMarkup = lines.map((line, index) =>
          '<text x="72" y="' + (245 + index * 92) + '" fill="#F2F2EF" font-family="Arial, Helvetica, sans-serif" font-size="88" font-weight="800" letter-spacing="-4">' +
          escapeXml(line) +
          "</text>",
        ).join("");

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#000000"/>
  <rect x="72" y="74" width="90" height="12" fill="${work}"/>
  <text x="72" y="138" fill="#B9B7B0" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="600">EDMUNDO KUTUZOV · CASE STUDY</text>
  ${titleMarkup}
  <rect x="72" y="510" width="1056" height="2" fill="#3F3E3B"/>
  <text x="72" y="560" fill="#F2F2EF" font-family="Arial, Helvetica, sans-serif" font-size="22">${escapeXml([client, category, year].filter(Boolean).join(" · "))}</text>
  <rect x="1068" y="72" width="60" height="60" fill="${workDark}"/>
</svg>`;

        return new Response(svg, {
          status: result.error ? 502 : 200,
          headers: {
            "Content-Type": "image/svg+xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        });
      },
    },
  },
});
