import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import qrcode from "qrcode-generator";
import { DEFAULT_SUPABASE_PUBLISHABLE_KEY, DEFAULT_SUPABASE_URL } from "@/config/public";
import {
  FALLBACK_CAPABILITY_GROUPS,
  FALLBACK_EXPERIENCE,
  FALLBACK_METRICS,
  FALLBACK_PRINCIPLES,
  FALLBACK_PROFILE,
  FALLBACK_SKILLS,
  sortExperience,
  type CredentialMetric,
  type CredentialSkill,
} from "@/lib/credentials-data";
import { SITE_EMAIL, SITE_PHONE, SITE_PHONE_DIGITS } from "@/lib/cms";

type PdfClient = { name: string };

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 46;

function sanitize(value: string) {
  return String(value ?? "")
    .replace(/[^\x09\x0a\x20-\x7e\u00a1-\u00ff\u20ac]/g, "");
}

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const lines: string[] = [];
  let line = "";

  for (const word of sanitize(text).split(/\s+/)) {
    const next = line ? line + " " + word : word;
    if (font.widthOfTextAtSize(next, size) <= width) {
      line = next;
      continue;
    }
    if (line) lines.push(line);
    line = word;
  }

  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function qrMatrix(value: string): boolean[][] {
  const qr = qrcode(0, "M");
  qr.addData(value);
  qr.make();
  const size = qr.getModuleCount();
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) => qr.isDark(row, column)),
  );
}

function drawQr(page: PDFPage, value: string, x: number, y: number, size: number) {
  const matrix = qrMatrix(value);
  const count = matrix.length;
  const cell = size / count;

  page.drawRectangle({
    x: x - 3,
    y: y - 3,
    width: size + 6,
    height: size + 6,
    color: rgb(1, 1, 1),
  });

  for (let row = 0; row < count; row += 1) {
    for (let column = 0; column < count; column += 1) {
      if (!matrix[row]?.[column]) continue;
      page.drawRectangle({
        x: x + column * cell,
        y: y + size - (row + 1) * cell,
        width: cell + 0.2,
        height: cell + 0.2,
        color: rgb(0, 0, 0),
      });
    }
  }
}

function addFooter(page: PDFPage, regular: PDFFont, pageNumber: number, totalPages: number) {
  page.drawLine({
    start: { x: MARGIN, y: 35 },
    end: { x: PAGE_W - MARGIN, y: 35 },
    thickness: 1,
    color: rgb(0.65, 0.65, 0.62),
  });
  page.drawText("Edmundo Kutuzov · Credentials", {
    x: MARGIN,
    y: 21,
    size: 8,
    font: regular,
    color: rgb(0.25, 0.25, 0.23),
  });
  page.drawText(String(pageNumber) + " / " + String(totalPages), {
    x: PAGE_W - MARGIN - 30,
    y: 21,
    size: 8,
    font: regular,
    color: rgb(0.25, 0.25, 0.23),
  });
}

async function fetchClients(): Promise<PdfClient[]> {
  const url = process.env.VITE_SUPABASE_URL ?? DEFAULT_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? DEFAULT_SUPABASE_PUBLISHABLE_KEY;

  try {
    const response = await fetch(
      url + "/rest/v1/clients?select=name&kind=eq.client&is_active=eq.true&order=sort_order.asc",
      { headers: { apikey: key, Accept: "application/json" } },
    );

    if (!response.ok) return [];

    const rows = (await response.json()) as Array<{ name?: string | null }>;
    return rows
      .map((row) => ({ name: String(row.name ?? "").trim() }))
      .filter((row) => row.name);
  } catch {
    return [];
  }
}

function metricSource(): CredentialMetric[] {
  return FALLBACK_METRICS;
}

function skillLevel(skill: CredentialSkill) {
  if (skill.value >= 90) return "Core";
  if (skill.value >= 70) return "Fluent";
  return "Exploring";
}

export async function renderCredentialsPdf() {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);

  pdf.setTitle("Edmundo Kutuzov · Press Kit / CV");
  pdf.setAuthor("Edmundo Kutuzov");
  pdf.setSubject("Credentials, experience, skills and selected clients");
  pdf.setCreator("edmundokutuzov.art");

  const pages: PDFPage[] = [];
  const concrete = rgb(0.839, 0.831, 0.808);
  const paper = rgb(0.949, 0.949, 0.937);
  const black = rgb(0, 0, 0);
  const steel = rgb(0.247, 0.243, 0.231);

  let page = pdf.addPage([PAGE_W, PAGE_H]);
  pages.push(page);

  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: concrete });
  page.drawRectangle({ x: 0, y: PAGE_H - 160, width: PAGE_W, height: 160, color: black });

  page.drawText("EK.", {
    x: MARGIN,
    y: PAGE_H - 76,
    size: 46,
    font: bold,
    color: paper,
  });
  page.drawText("PRESS KIT / CV", {
    x: MARGIN,
    y: PAGE_H - 105,
    size: 12,
    font: regular,
    color: rgb(0.72, 0.72, 0.69),
  });

  let cursor = PAGE_H - 215;
  page.drawText("Edmundo Kutuzov", {
    x: MARGIN,
    y: cursor,
    size: 36,
    font: bold,
    color: black,
  });
  cursor -= 28;
  page.drawText("Art Director · Graphic Designer · AI Expert", {
    x: MARGIN,
    y: cursor,
    size: 14,
    font: regular,
    color: steel,
  });

  cursor -= 34;
  for (const paragraph of FALLBACK_PROFILE.bio) {
    for (const line of wrap(paragraph, regular, 11, 350)) {
      page.drawText(line, {
        x: MARGIN,
        y: cursor,
        size: 11,
        font: regular,
        color: steel,
      });
      cursor -= 16;
    }
    cursor -= 7;
  }

  drawQr(page, "https://edmundokutuzov.art", PAGE_W - MARGIN - 92, PAGE_H - 355, 86);
  page.drawText("Portfolio", {
    x: PAGE_W - MARGIN - 92,
    y: PAGE_H - 370,
    size: 10,
    font: bold,
    color: black,
  });

  cursor = 300;
  page.drawLine({
    start: { x: MARGIN, y: cursor },
    end: { x: PAGE_W - MARGIN, y: cursor },
    thickness: 2,
    color: black,
  });
  cursor -= 25;

  page.drawText(SITE_EMAIL, {
    x: MARGIN,
    y: cursor,
    size: 11,
    font: regular,
    color: black,
  });
  page.drawText(SITE_PHONE, {
    x: MARGIN + 195,
    y: cursor,
    size: 11,
    font: regular,
    color: black,
  });
  cursor -= 17;
  page.drawText(FALLBACK_PROFILE.location, {
    x: MARGIN,
    y: cursor,
    size: 10,
    font: regular,
    color: steel,
  });
  cursor -= 24;
  page.drawText("WhatsApp", {
    x: MARGIN,
    y: cursor,
    size: 10,
    font: bold,
    color: black,
  });
  page.drawText("https://wa.me/" + SITE_PHONE_DIGITS, {
    x: MARGIN + 65,
    y: cursor,
    size: 10,
    font: regular,
    color: steel,
  });

  page = pdf.addPage([PAGE_W, PAGE_H]);
  pages.push(page);
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: paper });
  cursor = PAGE_H - MARGIN;

  const section = (title: string) => {
    page.drawText(title, {
      x: MARGIN,
      y: cursor,
      size: 24,
      font: bold,
      color: black,
    });
    cursor -= 34;
  };

  section("Numbers");
  for (const metric of metricSource()) {
    page.drawText(metric.value + "  " + metric.label, {
      x: MARGIN,
      y: cursor,
      size: 13,
      font: regular,
      color: steel,
    });
    cursor -= 22;
  }

  cursor -= 12;
  section("Experience");

  for (const item of sortExperience(FALLBACK_EXPERIENCE)) {
    page.drawText(item.period, {
      x: MARGIN,
      y: cursor,
      size: 10,
      font: regular,
      color: steel,
    });
    page.drawText(item.role, {
      x: MARGIN + 95,
      y: cursor,
      size: 11,
      font: bold,
      color: black,
    });
    page.drawText(item.company, {
      x: MARGIN + 95,
      y: cursor - 15,
      size: 10,
      font: regular,
      color: steel,
    });
    cursor -= 38;

    if (cursor < 120) {
      page = pdf.addPage([PAGE_W, PAGE_H]);
      pages.push(page);
      page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: paper });
      cursor = PAGE_H - MARGIN;
    }
  }

  section("Toolbelt");
  const skills = FALLBACK_SKILLS;

  for (const level of ["Core", "Fluent", "Exploring"]) {
    const items = skills.filter((skill) => skillLevel(skill) === level);
    if (!items.length) continue;

    page.drawText(level, {
      x: MARGIN,
      y: cursor,
      size: 12,
      font: bold,
      color: black,
    });
    cursor -= 20;

    for (const skill of items) {
      page.drawText(skill.name + " · " + String(skill.value), {
        x: MARGIN + 16,
        y: cursor,
        size: 10,
        font: regular,
        color: steel,
      });
      cursor -= 17;
    }
    cursor -= 8;
  }

  if (cursor < 250) {
    page = pdf.addPage([PAGE_W, PAGE_H]);
    pages.push(page);
    page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: paper });
    cursor = PAGE_H - MARGIN;
  }

  section("Competencies");
  for (const group of FALLBACK_CAPABILITY_GROUPS) {
    page.drawText(group.category, {
      x: MARGIN,
      y: cursor,
      size: 12,
      font: bold,
      color: black,
    });
    cursor -= 19;

    for (const item of group.items) {
      page.drawText("• " + sanitize(item), {
        x: MARGIN + 12,
        y: cursor,
        size: 10,
        font: regular,
        color: steel,
      });
      cursor -= 16;
    }
    cursor -= 7;
  }

  section("Clients");
  const clients = await fetchClients();
  const names = clients.map((item) => item.name);

  for (let index = 0; index < names.length; index += 1) {
    const x = MARGIN + (index % 2) * 250;
    const y = cursor - Math.floor(index / 2) * 18;
    page.drawText(sanitize(names[index] ?? ""), {
      x,
      y,
      size: 10,
      font: regular,
      color: steel,
    });
  }
  cursor -= Math.ceil(names.length / 2) * 18 + 25;

  if (cursor < 240) {
    page = pdf.addPage([PAGE_W, PAGE_H]);
    pages.push(page);
    page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: paper });
    cursor = PAGE_H - MARGIN;
  }

  section("Principles");
  for (const principle of FALLBACK_PRINCIPLES) {
    page.drawText(principle.key, {
      x: MARGIN,
      y: cursor,
      size: 13,
      font: bold,
      color: black,
    });
    cursor -= 19;

    for (const line of wrap(principle.value, italic, 10, 500)) {
      page.drawText(line, {
        x: MARGIN + 14,
        y: cursor,
        size: 10,
        font: italic,
        color: steel,
      });
      cursor -= 15;
    }
    cursor -= 10;
  }

  for (let index = 0; index < pages.length; index += 1) {
    addFooter(pages[index]!, regular, index + 1, pages.length);
  }

  return pdf.save();
}
