/**
 * Invoice PDF engine v2 — art-directed, multi-page, vector QR, Worker-safe.
 * Pure: takes a context object, returns PDF bytes. No Supabase, no fs, no network
 * except an optional logo fetch. Safe to unit-test/QA offline.
 */
import {
  PDFDocument,
  StandardFonts,
  rgb,
  degrees,
  type PDFFont,
  type PDFPage,
  type RGB,
} from "pdf-lib";
import qrcode from "qrcode-generator";
import { computeTotals, money, type LineItem } from "./invoice-core";

export type InvoiceBranding = {
  studio_name?: string;
  studio_email?: string;
  studio_phone?: string;
  studio_address?: string;
  studio_tax_id?: string;
  logo_url?: string;
  brand_color?: string;
  header_label?: string;
  footer_note?: string;
  legal_text?: string;
  bank_name?: string;
  bank_account_name?: string;
  bank_iban?: string;
  bank_swift?: string;
  mpesa_number?: string;
  payment_terms?: string;
};

export type InvoicePdfContext = {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string | null;
  currency: string;
  status: string;
  notes: string | null;
  terms: string | null;
  taxLabel: string | null;
  taxPct: number;
  discountPct: number;
  depositPct: number;
  items: LineItem[];
  client: {
    full_name: string;
    email: string;
    company_name?: string | null;
    country?: string | null;
    phone?: string | null;
    project_type?: string | null;
  };
  portalUrl: string | null;
  settings: InvoiceBranding;
};

/* ------------------------------------------------------------------ layout */
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const M = 46; // outer margin
const CONTENT_W = PAGE_W - M * 2;

const COL = {
  desc: M,
  qty: M + 300,
  unit: M + 350,
  price: M + 400,
  total: M + CONTENT_W,
};

/* ------------------------------------------------------------------- utils */
function hexToRgb(hex: string | undefined, fallback: [number, number, number]): RGB {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex ?? "").trim());
  if (!m) return rgb(...fallback);
  const n = parseInt(m[1]!, 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

/** Perceived luminance → pick readable ink over a colored band. */
function luminance(c: RGB): number {
  return 0.2126 * c.red + 0.7152 * c.green + 0.0722 * c.blue;
}

/** Latin-1 safe: StandardFonts cannot encode arbitrary unicode. */
function sanitize(input: string): string {
  return (
    (input ?? "")
      .replace(/\u2019|\u2018/g, "'")
      .replace(/\u201c|\u201d/g, '"')
      .replace(/\u2013|\u2014/g, "-")
      .replace(/\u2026/g, "...")
      .replace(/\u00a0/g, " ")
      // drop anything outside WinAnsi range to avoid encode crashes
      // eslint-disable-next-line no-control-regex
      .replace(/[^\x09\x0a\x20-\x7e\u00a1-\u00ff\u20ac]/g, "")
  );
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const out: string[] = [];
  for (const paragraph of sanitize(text).split("\n")) {
    let line = "";
    for (const word of paragraph.split(/\s+/)) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        line = candidate;
      } else {
        if (line) out.push(line);
        line = word;
        // hard-break absurdly long tokens (urls, ibans)
        while (font.widthOfTextAtSize(line, size) > maxWidth && line.length > 1) {
          let cut = line.length - 1;
          while (cut > 1 && font.widthOfTextAtSize(line.slice(0, cut), size) > maxWidth) cut--;
          out.push(line.slice(0, cut));
          line = line.slice(cut);
        }
      }
    }
    out.push(line);
  }
  return out.length ? out : [""];
}

/* --------------------------------------------------------------------- QR */
function qrMatrix(text: string): boolean[][] {
  const qr = qrcode(0, "M");
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount();
  const rows: boolean[][] = [];
  for (let r = 0; r < n; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < n; c++) row.push(qr.isDark(r, c));
    rows.push(row);
  }
  return rows;
}

function drawQr(page: PDFPage, text: string, x: number, y: number, size: number, color: RGB) {
  const matrix = qrMatrix(text);
  const n = matrix.length;
  const cell = size / n;
  page.drawRectangle({
    x: x - 3,
    y: y - 3,
    width: size + 6,
    height: size + 6,
    color: rgb(1, 1, 1),
  });
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!matrix[r]![c]) continue;
      page.drawRectangle({
        x: x + c * cell,
        y: y + size - (r + 1) * cell,
        width: cell + 0.2,
        height: cell + 0.2,
        color,
      });
    }
  }
}

/* ------------------------------------------------------------------- build */
export async function buildInvoicePdf(ctx: InvoicePdfContext): Promise<Uint8Array> {
  const s = ctx.settings ?? {};
  const accent = hexToRgb(s.brand_color, [0.28, 0.62, 0.88]);
  const ink = rgb(0.05, 0.07, 0.11);
  const soft = rgb(0.42, 0.47, 0.55);
  const hair = rgb(0.87, 0.89, 0.93);
  const zebra = rgb(0.973, 0.98, 0.988);
  const bandInk = luminance(accent) > 0.62 ? ink : rgb(1, 1, 1);

  const totals = computeTotals({
    items: ctx.items,
    discount_pct: ctx.discountPct,
    tax_pct: ctx.taxPct,
    deposit_pct: ctx.depositPct,
  });

  const pdf = await PDFDocument.create();
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const reg = await pdf.embedFont(StandardFonts.Helvetica);
  const obl = await pdf.embedFont(StandardFonts.HelveticaOblique);

  pdf.setTitle(`${s.studio_name ?? "Invoice"} — ${ctx.invoiceNumber}`);
  pdf.setAuthor(s.studio_name ?? "Studio");
  pdf.setSubject(`Invoice ${ctx.invoiceNumber}`);
  pdf.setCreator("Edmundo Kutuzov — Invoicing 2.0");
  pdf.setProducer("Edmundo Kutuzov — Invoicing 2.0");
  pdf.setCreationDate(new Date());

  // Optional logo, fetched once and reused across pages
  let logo: { img: Awaited<ReturnType<typeof pdf.embedPng>>; w: number; h: number } | null = null;
  if (s.logo_url) {
    try {
      const res = await fetch(s.logo_url);
      if (res.ok) {
        const bytes = new Uint8Array(await res.arrayBuffer());
        const ct = res.headers.get("content-type") ?? "";
        const img =
          ct.includes("png") || s.logo_url.toLowerCase().endsWith(".png")
            ? await pdf.embedPng(bytes)
            : await pdf.embedJpg(bytes);
        const scale = Math.min(118 / img.width, 34 / img.height);
        logo = { img, w: img.width * scale, h: img.height * scale };
      }
    } catch {
      /* logo is decorative — never fail the invoice over it */
    }
  }

  const pages: PDFPage[] = [];

  const text = (
    page: PDFPage,
    t: string,
    x: number,
    y: number,
    o: { size?: number; font?: PDFFont; color?: RGB; align?: "left" | "right" | "center" } = {},
  ) => {
    const size = o.size ?? 9.5;
    const font = o.font ?? reg;
    const str = sanitize(t);
    let px = x;
    if (o.align === "right") px = x - font.widthOfTextAtSize(str, size);
    if (o.align === "center") px = x - font.widthOfTextAtSize(str, size) / 2;
    page.drawText(str, { x: px, y, size, font, color: o.color ?? ink });
  };

  const label = (
    page: PDFPage,
    t: string,
    x: number,
    y: number,
    color = soft,
    align?: "left" | "right",
  ) => text(page, t.toUpperCase(), x, y, { size: 7.2, font: bold, color, align });

  /** New page + chrome. Returns the cursor y where content may start. */
  const newPage = (first: boolean): { page: PDFPage; y: number } => {
    const page = pdf.addPage([PAGE_W, PAGE_H]);
    pages.push(page);

    // top accent band
    page.drawRectangle({ x: 0, y: PAGE_H - 6, width: PAGE_W, height: 6, color: accent });

    if (!first) {
      text(page, `${s.studio_name ?? ""} — Invoice ${ctx.invoiceNumber}`, M, PAGE_H - 34, {
        size: 8.5,
        font: bold,
        color: soft,
      });
      page.drawRectangle({ x: M, y: PAGE_H - 44, width: CONTENT_W, height: 0.7, color: hair });
      return { page, y: PAGE_H - 72 };
    }
    return { page, y: PAGE_H - 6 };
  };

  /* ============================== PAGE 1 HEADER ============================== */
  let { page, y } = newPage(true);

  // Masthead block: dark plate with studio identity + invoice number
  const plateH = 118;
  const plateY = PAGE_H - 6 - plateH;
  page.drawRectangle({
    x: 0,
    y: plateY,
    width: PAGE_W,
    height: plateH,
    color: rgb(0.016, 0.031, 0.055),
  });
  page.drawRectangle({ x: 0, y: plateY, width: 4, height: plateH, color: accent });

  if (logo) {
    page.drawImage(logo.img, {
      x: M,
      y: plateY + plateH - 26 - logo.h,
      width: logo.w,
      height: logo.h,
    });
  }
  const identY = logo ? plateY + plateH - 34 - logo.h - 18 : plateY + plateH - 46;
  text(page, s.studio_name ?? "Studio", M, identY, { size: 20, font: bold, color: rgb(1, 1, 1) });
  let metaY = identY - 15;
  for (const line of [
    s.studio_address,
    s.studio_email,
    s.studio_phone,
    s.studio_tax_id && `Tax ID: ${s.studio_tax_id}`,
  ]) {
    if (!line) continue;
    text(page, line, M, metaY, { size: 8.4, color: rgb(0.62, 0.68, 0.76) });
    metaY -= 11;
  }

  // right-hand invoice identity
  const rightX = PAGE_W - M;
  label(page, s.header_label ?? "Proforma Invoice", rightX, plateY + plateH - 34, accent, "right");
  text(page, ctx.invoiceNumber, rightX, plateY + plateH - 60, {
    size: 21,
    font: bold,
    color: rgb(1, 1, 1),
    align: "right",
  });
  text(page, `${money(totals.total, ctx.currency)} ${ctx.currency}`, rightX, plateY + plateH - 80, {
    size: 12,
    font: bold,
    color: accent,
    align: "right",
  });
  const statusText =
    ctx.status === "paid" ? "PAID IN FULL" : ctx.status === "void" ? "VOID" : "AMOUNT DUE";
  text(page, statusText, rightX, plateY + plateH - 95, {
    size: 7.5,
    font: bold,
    color: rgb(0.62, 0.68, 0.76),
    align: "right",
  });

  y = plateY - 30;

  /* ============================== META STRIP ============================== */
  const metaCols: Array<[string, string]> = [
    ["Issued", ctx.issueDate],
    ["Due", ctx.dueDate ?? "On receipt"],
    ["Reference", ctx.invoiceNumber],
    ["Currency", ctx.currency],
  ];
  const colW = CONTENT_W / metaCols.length;
  metaCols.forEach(([k, v], i) => {
    const x = M + i * colW;
    label(page, k, x, y);
    text(page, v, x, y - 14, { size: 10, font: bold });
  });
  y -= 34;
  page.drawRectangle({ x: M, y, width: CONTENT_W, height: 0.7, color: hair });
  y -= 26;

  /* ============================== BILL TO ============================== */
  label(page, "Billed to", M, y);
  label(page, "Engagement", M + CONTENT_W / 2, y);
  y -= 15;
  text(page, ctx.client.full_name, M, y, { size: 12, font: bold });
  text(page, ctx.client.project_type ?? "Creative direction", M + CONTENT_W / 2, y, {
    size: 12,
    font: bold,
  });
  y -= 13;
  const leftLines = [
    ctx.client.company_name,
    ctx.client.email,
    ctx.client.phone,
    ctx.client.country,
  ].filter(Boolean) as string[];
  const rightLines = [
    ctx.dueDate ? `Payment due ${ctx.dueDate}` : null,
    ctx.depositPct > 0 ? `${ctx.depositPct}% deposit to start` : null,
  ].filter(Boolean) as string[];
  const infoRows = Math.max(leftLines.length, rightLines.length);
  for (let i = 0; i < infoRows; i++) {
    if (leftLines[i]) text(page, leftLines[i]!, M, y, { size: 8.8, color: soft });
    if (rightLines[i]) text(page, rightLines[i]!, M + CONTENT_W / 2, y, { size: 8.8, color: soft });
    y -= 11.5;
  }
  y -= 16;

  /* ============================== ITEMS TABLE ============================== */
  const tableHeader = (p: PDFPage, top: number): number => {
    p.drawRectangle({
      x: M,
      y: top - 16,
      width: CONTENT_W,
      height: 20,
      color: rgb(0.055, 0.09, 0.14),
    });
    label(p, "Description", COL.desc + 8, top - 10, rgb(0.72, 0.78, 0.86));
    label(p, "Qty", COL.qty + 34, top - 10, rgb(0.72, 0.78, 0.86), "right");
    label(p, "Unit", COL.unit, top - 10, rgb(0.72, 0.78, 0.86));
    label(p, "Rate", COL.price + 44, top - 10, rgb(0.72, 0.78, 0.86), "right");
    label(p, "Amount", COL.total - 8, top - 10, rgb(0.72, 0.78, 0.86), "right");
    return top - 26;
  };

  y = tableHeader(page, y);

  const descW = COL.qty - COL.desc - 24;
  let zebraFlag = false;

  for (const line of totals.lines) {
    const titleLines = wrap(line.description || "Item", bold, 9.8, descW);
    const detailLines = line.detail ? wrap(line.detail, reg, 8.4, descW) : [];
    const rowH =
      12 +
      titleLines.length * 12.5 +
      detailLines.length * 10.5 +
      (line.discount_pct > 0 ? 10.5 : 0);

    if (y - rowH < 190) {
      // continue on a fresh page
      const next = newPage(false);
      page = next.page;
      y = tableHeader(page, next.y);
    }

    if (zebraFlag) {
      page.drawRectangle({ x: M, y: y - rowH + 9, width: CONTENT_W, height: rowH, color: zebra });
    }
    zebraFlag = !zebraFlag;

    let ty = y;
    for (const t of titleLines) {
      text(page, t, COL.desc + 8, ty, { size: 9.8, font: bold });
      ty -= 12.5;
    }
    for (const d of detailLines) {
      text(page, d, COL.desc + 8, ty, { size: 8.4, color: soft });
      ty -= 10.5;
    }
    if (line.discount_pct > 0) {
      text(page, `line discount -${line.discount_pct}%`, COL.desc + 8, ty, {
        size: 8,
        font: obl,
        color: accent,
      });
      ty -= 10.5;
    }

    text(page, String(line.qty), COL.qty + 34, y, { size: 9.6, align: "right" });
    text(page, line.unit ?? "un", COL.unit, y, { size: 9, color: soft });
    text(page, money(line.unit_price, ctx.currency), COL.price + 44, y, {
      size: 9.6,
      align: "right",
    });
    text(page, money(line.net, ctx.currency), COL.total - 8, y, {
      size: 9.8,
      font: bold,
      align: "right",
    });

    y = y - rowH;
    page.drawRectangle({ x: M, y: y + 6, width: CONTENT_W, height: 0.6, color: hair });
  }

  /* ============================== TOTALS ============================== */
  const totalsRows: Array<[string, string, boolean]> = [
    ["Subtotal", money(totals.subtotal, ctx.currency), false],
  ];
  if (totals.discount_amount > 0)
    totalsRows.push([
      `Discount (${ctx.discountPct}%)`,
      `-${money(totals.discount_amount, ctx.currency)}`,
      false,
    ]);
  if (ctx.taxPct > 0)
    totalsRows.push([
      ctx.taxLabel || `Tax (${ctx.taxPct}%)`,
      money(totals.tax_amount, ctx.currency),
      false,
    ]);

  const totalsH = 30 + totalsRows.length * 16 + 46 + (totals.deposit_amount > 0 ? 34 : 0);
  if (y - totalsH < 170) {
    const next = newPage(false);
    page = next.page;
    y = next.y;
  }
  y -= 14;

  const tx = COL.total;
  for (const [k, v] of totalsRows) {
    text(page, k, tx - 150, y, { size: 9.2, color: soft });
    text(page, v, tx, y, { size: 9.6, align: "right" });
    y -= 16;
  }
  y -= 4;
  page.drawRectangle({ x: tx - 220, y, width: 220, height: 0.8, color: hair });
  y -= 24;
  page.drawRectangle({
    x: tx - 220,
    y: y - 8,
    width: 220,
    height: 30,
    color: accent,
    opacity: 0.1,
  });
  text(page, "TOTAL", tx - 210, y, { size: 9.5, font: bold, color: soft });
  text(page, `${money(totals.total, ctx.currency)} ${ctx.currency}`, tx - 8, y, {
    size: 14,
    font: bold,
    color: accent,
    align: "right",
  });
  y -= 30;

  if (totals.deposit_amount > 0) {
    text(page, `Deposit due now (${ctx.depositPct}%)`, tx - 210, y, { size: 9, font: bold });
    text(page, `${money(totals.deposit_amount, ctx.currency)} ${ctx.currency}`, tx - 8, y, {
      size: 10.5,
      font: bold,
      align: "right",
    });
    y -= 14;
    text(page, "Balance on delivery", tx - 210, y, { size: 8.6, color: soft });
    text(page, money(totals.balance, ctx.currency), tx - 8, y, {
      size: 8.8,
      color: soft,
      align: "right",
    });
    y -= 20;
  }

  /* ============================== NOTES / PAYMENT / QR ============================== */
  const blockH = 210;
  if (y - blockH < 90) {
    const next = newPage(false);
    page = next.page;
    y = next.y;
  }

  const leftW = CONTENT_W * 0.52;
  let ly = y - 10;

  label(page, "Payment details", M, ly);
  ly -= 15;
  const detail = (k: string, v?: string | null) => {
    if (!v) return;
    text(page, k, M, ly, { size: 8.4, color: soft });
    for (const l of wrap(v, bold, 9, leftW - 96)) {
      text(page, l, M + 96, ly, { size: 9, font: bold });
      ly -= 11.5;
    }
    ly -= 2.5;
  };
  detail("Bank", s.bank_name);
  detail("Account name", s.bank_account_name);
  detail("IBAN / Account", s.bank_iban);
  detail("SWIFT / BIC", s.bank_swift);
  detail("M-Pesa", s.mpesa_number);
  detail("Payment reference", ctx.invoiceNumber);

  // right column: notes + QR
  let ry = y - 10;
  const rx = M + leftW + 16;
  const rw = CONTENT_W - leftW - 16;

  if (ctx.notes) {
    label(page, "Notes", rx, ry);
    ry -= 14;
    for (const l of wrap(ctx.notes, reg, 8.8, rw).slice(0, 8)) {
      text(page, l, rx, ry, { size: 8.8, color: soft });
      ry -= 11;
    }
    ry -= 8;
  }

  if (ctx.portalUrl) {
    label(page, "Pay & track online", rx, ry);
    ry -= 76;
    drawQr(page, ctx.portalUrl, rx, ry, 66, rgb(0.05, 0.07, 0.11));
    text(page, "Scan to open your", rx + 76, ry + 46, { size: 8.4, color: soft });
    text(page, "secure invoice portal", rx + 76, ry + 35, { size: 8.4, color: soft });
    text(page, "Confirm payment &", rx + 76, ry + 20, { size: 8.4, color: soft });
    text(page, "download this PDF", rx + 76, ry + 9, { size: 8.4, color: soft });
    ry -= 12;
  }

  /* ============================== FOOTERS ============================== */
  const total = pages.length;
  pages.forEach((p, i) => {
    let fy = 96;
    if (i === total - 1) {
      const terms = ctx.terms || s.payment_terms;
      if (terms) {
        label(p, "Terms", M, fy, soft);
        fy -= 12;
        for (const l of wrap(terms, reg, 8, CONTENT_W).slice(0, 3)) {
          text(p, l, M, fy, { size: 8, color: soft });
          fy -= 9.6;
        }
        fy -= 4;
      }
      if (s.legal_text) {
        for (const l of wrap(s.legal_text, reg, 7.4, CONTENT_W).slice(0, 4)) {
          text(p, l, M, fy, { size: 7.4, color: rgb(0.55, 0.6, 0.68) });
          fy -= 9;
        }
      }
    }
    p.drawRectangle({ x: M, y: 40, width: CONTENT_W, height: 0.7, color: hair });
    text(p, `${s.studio_name ?? ""}${s.footer_note ? ` — ${s.footer_note}` : ""}`, M, 28, {
      size: 7.6,
      color: soft,
    });
    text(p, `${ctx.invoiceNumber} · page ${i + 1} of ${total}`, PAGE_W - M, 28, {
      size: 7.6,
      color: soft,
      align: "right",
    });
    p.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: 4, color: accent });
  });

  /* ============================== STAMP ============================== */
  if (ctx.status === "paid" || ctx.status === "void") {
    const stampText = ctx.status === "paid" ? "PAID" : "VOID";
    const stampColor = ctx.status === "paid" ? rgb(0.06, 0.66, 0.44) : rgb(0.85, 0.24, 0.35);
    const first = pages[0]!;
    first.drawText(stampText, {
      x: 140,
      y: 300,
      size: 96,
      font: bold,
      color: stampColor,
      opacity: 0.12,
      rotate: degrees(26),
    });
  }

  void bandInk;
  return await pdf.save();
}
