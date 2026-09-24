import { createRequire } from "node:module";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, PageSizes, rgb, type PDFPage, type PDFFont } from "pdf-lib";
import type { CaseStudyPayload } from "@/lib/case-study";
import { firstHexColor, projectDisplayName } from "@/lib/case-study";

const require = createRequire(import.meta.url);

async function findArchivoFont(directory: string): Promise<string | null> {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const absolute = join(directory, entry.name);

    if (entry.isDirectory()) {
      const nested = await findArchivoFont(absolute);
      if (nested) return nested;
      continue;
    }

    const lower = entry.name.toLowerCase();

    if (
      lower.endsWith(".woff2") &&
      lower.includes("latin-ext") &&
      lower.includes("normal")
    ) {
      return absolute;
    }
  }

  return null;
}

function hexRgb(hex: string) {
  return rgb(
    Number.parseInt(hex.slice(1, 3), 16) / 255,
    Number.parseInt(hex.slice(3, 5), 16) / 255,
    Number.parseInt(hex.slice(5, 7), 16) / 255,
  );
}

function wrapText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? line + " " + word : word;

    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      line = candidate;
    } else if (line) {
      lines.push(line);
      line = word;
    } else {
      lines.push(word);
    }
  }

  if (line) lines.push(line);
  return lines;
}

function addText(
  doc: PDFDocument,
  state: { page: PDFPage; y: number },
  text: string,
  font: PDFFont,
  size: number,
  color: ReturnType<typeof rgb>,
  maxWidth: number,
  lineHeight: number,
  margin: number,
) {
  for (const line of wrapText(text, font, size, maxWidth)) {
    if (state.y < 62) {
      state.page = doc.addPage(PageSizes.A4);
      state.y = state.page.getHeight() - 58;
    }

    state.page.drawText(line, {
      x: margin,
      y: state.y,
      size,
      font,
      color,
    });

    state.y -= lineHeight;
  }

  state.y -= 4;
}

export async function renderCaseStudyPdf(
  payload: CaseStudyPayload,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  const packageJson = require.resolve("@fontsource-variable/archivo/package.json");
  const fontPath = await findArchivoFont(dirname(packageJson));

  if (!fontPath) {
    throw new Error("Archivo font package does not expose a usable Latin-ext font.");
  }

  const fontData = await readFile(fontPath);
  const font = await doc.embedFont(fontData, { subset: true });

  const page = doc.addPage(PageSizes.A4);
  const margin = 48;
  const contentWidth = page.getWidth() - margin * 2;
  const work = firstHexColor(payload.project.palette);
  const accent = hexRgb(work);
  const black = rgb(0, 0, 0);
  const concrete = rgb(0.84, 0.83, 0.79);
  const smoke = rgb(0.32, 0.31, 0.29);

  page.drawRectangle({
    x: 0,
    y: 0,
    width: page.getWidth(),
    height: page.getHeight(),
    color: concrete,
  });

  page.drawRectangle({
    x: 0,
    y: page.getHeight() - 14,
    width: page.getWidth(),
    height: 14,
    color: accent,
  });

  const state = {
    page,
    y: page.getHeight() - 58,
  };

  state.page.drawText("EDMUNDO KUTUZOV", {
    x: margin,
    y: state.y,
    size: 10,
    font,
    color: smoke,
  });

  state.y -= 36;

  addText(
    doc,
    state,
    projectDisplayName(payload.project),
    font,
    28,
    black,
    contentWidth,
    32,
    margin,
  );

  const meta = [
    payload.project.year,
    payload.project.category,
    payload.project.client_name,
  ]
    .filter(Boolean)
    .join(" · ");

  if (meta) {
    addText(doc, state, meta, font, 11, smoke, contentWidth, 16, margin);
  }

  const description = payload.project.description || payload.project.concept || "";

  if (description) {
    state.y -= 8;
    addText(
      doc,
      state,
      description,
      font,
      12,
      black,
      contentWidth,
      19,
      margin,
    );
  }

  const metadata: Array<[string, string]> = [
    ["Project", payload.project.title],
    ...(payload.project.role
      ? [["Role", payload.project.role] as [string, string]]
      : []),
    ...(payload.project.tools_used?.length
      ? [["Tools", payload.project.tools_used.join(", ")] as [string, string]]
      : []),
    ...(payload.project.deliverables?.length
      ? [["Deliverables", payload.project.deliverables.join(", ")] as [string, string]]
      : []),
  ];

  if (metadata.length) {
    state.y -= 14;
    state.page.drawText("Project information", {
      x: margin,
      y: state.y,
      size: 14,
      font,
      color: black,
    });

    state.y -= 24;

    for (const [label, value] of metadata) {
      state.page.drawText(label, {
        x: margin,
        y: state.y,
        size: 9,
        font,
        color: smoke,
      });

      state.y -= 14;
      addText(doc, state, value, font, 11, black, contentWidth, 16, margin);
      state.y -= 4;
    }
  }

  for (const section of payload.sections) {
    const body = section.body?.trim();
    if (!body) continue;

    state.y -= 8;
    state.page.drawText(section.heading?.trim() || section.section_type, {
      x: margin,
      y: state.y,
      size: 15,
      font,
      color: black,
    });

    state.y -= 22;
    addText(doc, state, body, font, 11, black, contentWidth, 17, margin);
  }

  if (payload.metrics.length) {
    state.y -= 10;
    state.page.drawText("Results", {
      x: margin,
      y: state.y,
      size: 15,
      font,
      color: black,
    });

    state.y -= 24;

    for (const metric of payload.metrics) {
      addText(
        doc,
        state,
        metric.value + "  " + metric.label,
        font,
        13,
        black,
        contentWidth,
        18,
        margin,
      );
    }
  }

  if (payload.credits.length || payload.project.collaborators?.length) {
    state.y -= 10;
    state.page.drawText("Credits", {
      x: margin,
      y: state.y,
      size: 15,
      font,
      color: black,
    });

    state.y -= 24;

    const lines = payload.credits.length
      ? payload.credits.map(
          (item) =>
            item.role +
            ": " +
            item.name +
            (item.organization ? " · " + item.organization : ""),
        )
      : (payload.project.collaborators ?? []).map((name) => name);

    for (const line of lines) {
      addText(doc, state, line, font, 11, black, contentWidth, 16, margin);
    }
  }

  for (const pdfPage of doc.getPages()) {
    pdfPage.drawText("edmundokutuzov.art", {
      x: margin,
      y: 32,
      size: 8,
      font,
      color: smoke,
    });
  }

  doc.setTitle(projectDisplayName(payload.project) + " · Edmundo Kutuzov");
  doc.setAuthor("Edmundo Kutuzov");
  doc.setSubject("Portfolio case study");

  return doc.save();
}
