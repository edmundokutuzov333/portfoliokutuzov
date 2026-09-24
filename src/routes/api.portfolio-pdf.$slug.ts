import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import { createFileRoute } from "@tanstack/react-router";
import { PDFDocument, PageSizes, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { supabaseAdmin } from "@/integrations/supabase/server/index.server";
import { darkenWorkColor } from "@/lib/work-color";

const require = createRequire(import.meta.url);
const FALLBACK_WORK = "#2f4bff";

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean, 16);
  return {
    r: ((value >> 16) & 255) / 255,
    g: ((value >> 8) & 255) / 255,
    b: (value & 255) / 255,
  };
}

function paletteColor(palette: string | null) {
  const match = palette?.match(/#[0-9a-f]{6}\b/gi);
  return match?.at(-1) ?? FALLBACK_WORK;
}

function wrapText(text: string, font: any, size: number, maxWidth: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? line + " " + word : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function embedArchivo(pdf: PDFDocument) {
  try {
    const path = require.resolve("@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2");
    const bytes = await readFile(path);
    pdf.registerFontkit(fontkit);
    return await pdf.embedFont(bytes, { subset: true });
  } catch {
    return await pdf.embedFont(StandardFonts.Helvetica);
  }
}

export const Route = createFileRoute("/api/portfolio-pdf/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const slug = params.slug.trim();
        const result = await supabaseAdmin
          .from("projects")
          .select("id,slug,title,subtitle,category,year,description,client_name,palette,concept,idea,role,notes,tags,tools_used,deliverables,collaborators,is_published")
          .eq("is_published", true)
          .eq("slug", slug)
          .maybeSingle();

        if (result.error) return new Response("Could not load case study", { status: 502 });
        if (!result.data) return new Response("Case study not found", { status: 404 });

        const project = result.data;
        const pdf = await PDFDocument.create();
        pdf.setTitle(project.title);
        pdf.setAuthor("Edmundo Kutuzov");
        pdf.setSubject("Portfolio case study");
        const font = await embedArchivo(pdf);
        const bodyFont = await pdf.embedFont(StandardFonts.Helvetica);
        const { width, height } = PageSizes.A4;
        let page = pdf.addPage(PageSizes.A4);

        const work = paletteColor(project.palette);
        const workDark = darkenWorkColor(work);
        const workRgb = hexToRgb(work);
        const workDarkRgb = hexToRgb(workDark);
        const ink = rgb(0, 0, 0);
        const paper = rgb(0.949, 0.949, 0.937);
        const muted = rgb(0.247, 0.243, 0.231);
        const white = rgb(0.949, 0.949, 0.937);
        let y = height - 72;
        const margin = 52;
        const maxWidth = width - margin * 2;

        const ensureSpace = (needed: number) => {
          if (y - needed < 58) {
            page = pdf.addPage(PageSizes.A4);
            y = height - 72;
          }
        };

        const drawLabel = (text: string) => {
          ensureSpace(20);
          page.drawText(text, { x: margin, y, size: 9, font: bodyFont, color: muted });
          y -= 18;
        };

        const drawBlock = (heading: string, body: string | null | undefined) => {
          if (!body?.trim()) return;
          const lines = wrapText(body, bodyFont, 11, maxWidth);
          ensureSpace(32 + lines.length * 17);
          page.drawText(heading, { x: margin, y, size: 18, font, color: ink });
          y -= 25;
          for (const line of lines) {
            page.drawText(line, { x: margin, y, size: 11, font: bodyFont, color: muted });
            y -= 17;
          }
          y -= 12;
        };

        page.drawRectangle({ x: 0, y: height - 18, width, height: 18, color: rgb(workDarkRgb.r, workDarkRgb.g, workDarkRgb.b) });
        page.drawRectangle({ x: width - 84, y: height - 102, width: 32, height: 32, color: rgb(workRgb.r, workRgb.g, workRgb.b) });
        page.drawText("EK.", { x: margin, y, size: 14, font, color: ink });
        y -= 34;
        page.drawText(project.title, { x: margin, y, size: 34, font, color: ink, maxWidth });
        y -= 44;
        const meta = [project.client_name, project.category, project.year].filter(Boolean).join(" · ");
        if (meta) {
          page.drawText(meta, { x: margin, y, size: 10, font: bodyFont, color: muted });
          y -= 30;
        }

        drawBlock("Case summary", project.description || project.subtitle);
        drawBlock("Concept", project.concept);
        drawBlock("Process", project.idea);
        drawBlock("Role", project.role);
        drawBlock("Outcome", project.notes);

        const lists: Array<[string, unknown]> = [
          ["Tags", project.tags],
          ["Tools", project.tools_used],
          ["Deliverables", project.deliverables],
          ["Collaborators", project.collaborators],
        ];
        for (const [heading, value] of lists) {
          if (!Array.isArray(value) || value.length === 0) continue;
          const items = value.filter((item): item is string => typeof item === "string" && Boolean(item.trim()));
          if (!items.length) continue;
          ensureSpace(34 + items.length * 16);
          drawLabel(heading);
          for (const item of items) {
            page.drawText("— " + item, { x: margin, y, size: 10.5, font: bodyFont, color: muted, maxWidth });
            y -= 16;
          }
          y -= 10;
        }

        ensureSpace(90);
        page.drawRectangle({ x: margin, y: y - 2, width: maxWidth, height: 2, color: ink });
        y -= 28;
        page.drawText("edmundokutuzov.art/portfolio/" + (project.slug ?? slug), {
          x: margin,
          y,
          size: 9,
          font: bodyFont,
          color: muted,
        });
        page.drawText("Edmundo Kutuzov", {
          x: width - margin - 90,
          y,
          size: 9,
          font: bodyFont,
          color: muted,
        });

        const bytes = await pdf.save();
        return new Response(bytes, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'inline; filename="' + (project.slug ?? slug) + '-case-study.pdf"',
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        });
      },
    },
  },
});
