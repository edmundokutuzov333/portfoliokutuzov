import { r as rgb, P as PDFDocument, S as StandardFonts, d as degrees } from "../_libs/pdf-lib.mjs";
import { q as qrcode } from "../_libs/qrcode-generator.mjs";
import { m as money, c as computeTotals } from "./invoice-core-C88qtTBH.mjs";
import "tslib";
import "../_libs/pdf-lib__standard-fonts.mjs";
import "../_libs/pako.mjs";
import "../_libs/react.mjs";
import "../_libs/pdf-lib__upng.mjs";
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const M = 46;
const CONTENT_W = PAGE_W - M * 2;
const COL = {
  desc: M,
  qty: M + 300,
  unit: M + 350,
  price: M + 400,
  total: M + CONTENT_W,
};
function hexToRgb(hex, fallback) {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex ?? "").trim());
  if (!m) return rgb(...fallback);
  const n = parseInt(m[1], 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}
function luminance(c) {
  return 0.2126 * c.red + 0.7152 * c.green + 0.0722 * c.blue;
}
function sanitize(input) {
  return (input ?? "")
    .replace(/\u2019|\u2018/g, "'")
    .replace(/\u201c|\u201d/g, '"')
    .replace(/\u2013|\u2014/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00a0/g, " ")
    .replace(/[^\x09\x0a\x20-\x7e\u00a1-\u00ff\u20ac]/g, "");
}
function wrap(text, font, size, maxWidth) {
  const out = [];
  for (const paragraph of sanitize(text).split("\n")) {
    let line = "";
    for (const word of paragraph.split(/\s+/)) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        line = candidate;
      } else {
        if (line) out.push(line);
        line = word;
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
function qrMatrix(text) {
  const qr = qrcode(0, "M");
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount();
  const rows = [];
  for (let r = 0; r < n; r++) {
    const row = [];
    for (let c = 0; c < n; c++) row.push(qr.isDark(r, c));
    rows.push(row);
  }
  return rows;
}
function drawQr(page, text, x, y, size, color) {
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
      if (!matrix[r][c]) continue;
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
async function buildInvoicePdf(ctx) {
  const s = ctx.settings ?? {};
  const accent = hexToRgb(s.brand_color, [0.28, 0.62, 0.88]);
  const ink = rgb(0.05, 0.07, 0.11);
  const soft = rgb(0.42, 0.47, 0.55);
  const hair = rgb(0.87, 0.89, 0.93);
  const zebra = rgb(0.973, 0.98, 0.988);
  luminance(accent) > 0.62 ? ink : rgb(1, 1, 1);
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
  pdf.setCreationDate(/* @__PURE__ */ new Date());
  let logo = null;
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
    } catch {}
  }
  const pages = [];
  const text = (page2, t, x, y2, o = {}) => {
    const size = o.size ?? 9.5;
    const font = o.font ?? reg;
    const str = sanitize(t);
    let px = x;
    if (o.align === "right") px = x - font.widthOfTextAtSize(str, size);
    if (o.align === "center") px = x - font.widthOfTextAtSize(str, size) / 2;
    page2.drawText(str, { x: px, y: y2, size, font, color: o.color ?? ink });
  };
  const label = (page2, t, x, y2, color = soft, align) =>
    text(page2, t.toUpperCase(), x, y2, { size: 7.2, font: bold, color, align });
  const newPage = (first) => {
    const page2 = pdf.addPage([PAGE_W, PAGE_H]);
    pages.push(page2);
    page2.drawRectangle({ x: 0, y: PAGE_H - 6, width: PAGE_W, height: 6, color: accent });
    if (!first) {
      text(page2, `${s.studio_name ?? ""} — Invoice ${ctx.invoiceNumber}`, M, PAGE_H - 34, {
        size: 8.5,
        font: bold,
        color: soft,
      });
      page2.drawRectangle({ x: M, y: PAGE_H - 44, width: CONTENT_W, height: 0.7, color: hair });
      return { page: page2, y: PAGE_H - 72 };
    }
    return { page: page2, y: PAGE_H - 6 };
  };
  let { page, y } = newPage(true);
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
  const metaCols = [
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
  ].filter(Boolean);
  const rightLines = [
    ctx.dueDate ? `Payment due ${ctx.dueDate}` : null,
    ctx.depositPct > 0 ? `${ctx.depositPct}% deposit to start` : null,
  ].filter(Boolean);
  const infoRows = Math.max(leftLines.length, rightLines.length);
  for (let i = 0; i < infoRows; i++) {
    if (leftLines[i]) text(page, leftLines[i], M, y, { size: 8.8, color: soft });
    if (rightLines[i]) text(page, rightLines[i], M + CONTENT_W / 2, y, { size: 8.8, color: soft });
    y -= 11.5;
  }
  y -= 16;
  const tableHeader = (p, top) => {
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
  const totalsRows = [["Subtotal", money(totals.subtotal, ctx.currency), false]];
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
  const detail = (k, v) => {
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
  if (ctx.status === "paid" || ctx.status === "void") {
    const stampText = ctx.status === "paid" ? "PAID" : "VOID";
    const stampColor = ctx.status === "paid" ? rgb(0.06, 0.66, 0.44) : rgb(0.85, 0.24, 0.35);
    const first = pages[0];
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
  return await pdf.save();
}
const PDF_BUCKET = "invoices";
const PROOF_BUCKET = "invoice-proofs";
const SIGNED_URL_TTL = 60 * 60 * 24 * 7;
const RESEND_GATEWAY = "https://connector-gateway.lovable.dev/resend";
function siteOrigin() {
  return (
    process.env["PUBLIC_SITE_URL"] ||
    process.env["SITE_URL"] ||
    "https://portfoliokutuzov.lovable.app"
  ).replace(/\/$/, "");
}
function adminEmail() {
  return (
    process.env["BRIEFING_ADMIN_EMAIL"] ??
    process.env["ADMIN_EMAIL"] ??
    "contact@edmundokutuzov.art"
  );
}
function fromEmail() {
  return process.env["BRIEFING_FROM"] ?? "Edmundo Kutuzov <onboarding@resend.dev>";
}
const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
async function signedUrl(admin, bucket, path, ttl = SIGNED_URL_TTL) {
  const { data, error } = await admin.storage.from(bucket).createSignedUrl(path, ttl);
  if (error || !data?.signedUrl) throw new Error(error?.message || "Failed to sign URL");
  return data.signedUrl;
}
async function assertAdmin(context) {
  const { data, error } = await context.supabase.rpc("is_admin");
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin only");
}
async function loadBranding(admin) {
  const { data } = await admin
    .from("site_settings")
    .select("value")
    .eq("key", "invoice_settings")
    .maybeSingle();
  return data?.value ?? {};
}
async function loadItems(admin, briefingId) {
  const { data, error } = await admin
    .from("invoice_line_items")
    .select("id, description, detail, qty, unit, unit_price, discount_pct, sort_order")
    .eq("briefing_id", briefingId)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({
    id: r.id,
    description: r.description,
    detail: r.detail,
    qty: Number(r.qty),
    unit: r.unit,
    unit_price: Number(r.unit_price),
    discount_pct: Number(r.discount_pct),
    sort_order: r.sort_order,
  }));
}
function itemsOrFallback(items, brief) {
  if (items.length) return items;
  return [
    {
      description: brief.project_type || "Creative direction & production",
      detail: brief.invoice_notes ?? null,
      qty: 1,
      unit: "project",
      unit_price: Number(brief.invoice_amount ?? 0),
      discount_pct: 0,
    },
  ];
}
async function logEvent(admin, briefingId, eventType, actor, detail = {}, recipients) {
  await admin.from("invoice_events").insert({
    briefing_id: briefingId,
    event_type: eventType,
    actor,
    recipients: recipients ?? null,
    detail,
  });
}
function toPdfContext(a) {
  return {
    invoiceNumber: a.invoiceNumber,
    issueDate: a.brief.invoice_issue_date ?? /* @__PURE__ */ new Date().toISOString().slice(0, 10),
    dueDate: a.brief.invoice_due_date ?? null,
    currency: (a.brief.invoice_currency || "EUR").toUpperCase(),
    status: a.status ?? a.brief.invoice_status ?? "draft",
    notes: a.brief.invoice_notes ?? null,
    terms: a.brief.invoice_terms ?? null,
    taxLabel: a.brief.invoice_tax_label ?? null,
    taxPct: Number(a.brief.invoice_tax_pct ?? 0),
    discountPct: Number(a.brief.invoice_discount_pct ?? 0),
    depositPct: Number(a.brief.invoice_deposit_pct ?? 0),
    items: itemsOrFallback(a.items, a.brief),
    client: {
      full_name: a.brief.full_name,
      email: a.brief.email,
      company_name: a.brief.company_name,
      country: a.brief.country,
      phone: a.brief.phone,
      project_type: a.brief.project_type,
    },
    portalUrl: a.token ? `${siteOrigin()}/i/${a.token}` : null,
    settings: a.branding,
  };
}
async function renderPdf(a) {
  return await buildInvoicePdf(toPdfContext(a));
}
function totalsFor(brief, items) {
  return computeTotals({
    items: itemsOrFallback(items, brief),
    discount_pct: Number(brief.invoice_discount_pct ?? 0),
    tax_pct: Number(brief.invoice_tax_pct ?? 0),
    deposit_pct: Number(brief.invoice_deposit_pct ?? 0),
  });
}
async function sendMail(args) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const resendKey = process.env["RESEND_API_KEY"];
  if (!lovableKey || !resendKey) return { skipped: true };
  const res = await fetch(`${RESEND_GATEWAY}/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": resendKey,
    },
    body: JSON.stringify({
      from: fromEmail(),
      to: args.to,
      cc: args.cc,
      subject: args.subject,
      html: args.html,
      attachments: args.attachment ? [args.attachment] : void 0,
    }),
  });
  return { skipped: false, ok: res.ok, status: res.status };
}
function buildInvoiceEmail(a) {
  const s = a.branding;
  const accent = s.brand_color || "#7dd3fc";
  const currency = (a.brief.invoice_currency || "EUR").toUpperCase();
  const t = totalsFor(a.brief, a.items);
  const firstName = String(a.brief.full_name ?? "").split(" ")[0] || "there";
  const studio = s.studio_name || "Edmundo Kutuzov";
  const heading =
    a.variant === "receipt"
      ? `Payment received — thank you, ${esc(firstName)}.`
      : a.variant === "reminder"
        ? `A gentle reminder, ${esc(firstName)}.`
        : `Hi ${esc(firstName)}, your invoice is ready.`;
  const lead =
    a.variant === "receipt"
      ? `We've confirmed payment for <b>${esc(a.brief.project_type)}</b>. Your invoice is now marked as paid — the PDF below is your record.`
      : a.variant === "reminder"
        ? `Invoice <b>${esc(a.invoiceNumber)}</b> for <b>${esc(a.brief.project_type)}</b> is still open${a.brief.invoice_due_date ? ` and was due on ${esc(a.brief.invoice_due_date)}` : ""}. If it's already on its way, please ignore this note.`
        : `Please find the invoice for <b>${esc(a.brief.project_type)}</b> below. Once payment is confirmed we kick off production straight away.`;
  const rows = t.lines
    .slice(0, 12)
    .map(
      (l) => `<tr>
        <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-size:13px;color:#e2e8f0">
          <b>${esc(l.description)}</b>${l.detail ? `<br><span style="color:#94a3b8;font-size:12px">${esc(l.detail)}</span>` : ""}
        </td>
        <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-size:13px;color:#94a3b8;text-align:right;white-space:nowrap">${esc(l.qty)} × ${esc(money(l.unit_price, currency))}</td>
        <td style="padding:8px 0 8px 14px;border-bottom:1px solid rgba(255,255,255,0.07);font-size:13px;color:#f5f8ff;text-align:right;white-space:nowrap"><b>${esc(money(l.net, currency))}</b></td>
      </tr>`,
    )
    .join("");
  const payLine = (k, v) =>
    v
      ? `<p style="margin:4px 0;font-size:13px;color:#cbd5e1"><span style="color:#94a3b8">${esc(k)}:</span> <b>${esc(v)}</b></p>`
      : "";
  const html = `<div style="font-family:-apple-system,Segoe UI,Inter,Helvetica,sans-serif;background:#01040A;color:#e2e8f0;padding:32px">
    <div style="max-width:600px;margin:0 auto">
      <p style="font-family:ui-monospace,monospace;letter-spacing:.18em;color:${accent};font-size:11px;margin:0 0 14px">
        ${esc(s.header_label || "PROFORMA INVOICE")} · ${esc(a.invoiceNumber)}
      </p>
      <h1 style="font-size:25px;line-height:1.18;margin:0 0 16px;color:#f5f8ff">${heading}</h1>
      <p style="font-size:15px;line-height:1.7;color:#cbd5e1;margin:0 0 22px">${lead}</p>

      <div style="border:1px solid rgba(255,255,255,0.09);border-radius:12px;padding:20px">
        <p style="margin:0 0 6px;font-family:ui-monospace,monospace;letter-spacing:.18em;color:${accent};font-size:10px">
          ${a.variant === "receipt" ? "AMOUNT PAID" : "AMOUNT DUE"}
        </p>
        <p style="margin:0 0 16px;font-size:28px;font-weight:700;color:#f5f8ff">
          ${esc(money(a.variant === "receipt" ? t.total : t.deposit_amount > 0 ? t.deposit_amount : t.total, currency))}
          <span style="font-size:13px;color:#94a3b8">${esc(currency)}</span>
        </p>
        <table style="width:100%;border-collapse:collapse">${rows}</table>
        <p style="margin:14px 0 0;font-size:13px;color:#cbd5e1;text-align:right">
          Subtotal ${esc(money(t.subtotal, currency))}${t.discount_amount ? ` · Discount -${esc(money(t.discount_amount, currency))}` : ""}${t.tax_amount ? ` · ${esc(s.studio_tax_id ? a.brief.invoice_tax_label || "Tax" : a.brief.invoice_tax_label || "Tax")} ${esc(money(t.tax_amount, currency))}` : ""}
          <br><b style="color:#f5f8ff;font-size:15px">Total ${esc(money(t.total, currency))} ${esc(currency)}</b>
          ${t.deposit_amount > 0 ? `<br><span style="color:${accent}">Deposit now ${esc(money(t.deposit_amount, currency))} · balance ${esc(money(t.balance, currency))}</span>` : ""}
        </p>
      </div>

      <p style="margin:26px 0 6px">
        <a href="${esc(a.portalUrl)}" style="display:inline-block;background:${accent};color:#01040A;padding:13px 22px;border-radius:9px;font-weight:700;text-decoration:none;margin:0 8px 8px 0">Open invoice portal</a>
        <a href="${esc(a.pdfUrl)}" style="display:inline-block;border:1px solid ${accent};color:${accent};padding:13px 22px;border-radius:9px;font-weight:700;text-decoration:none">Download PDF</a>
      </p>

      ${
        a.variant === "receipt"
          ? ""
          : `<div style="margin:24px 0;border-top:1px solid rgba(255,255,255,0.08);padding-top:16px">
              <p style="font-family:ui-monospace,monospace;letter-spacing:.18em;color:${accent};font-size:10px;margin:0 0 8px">PAYMENT DETAILS</p>
              ${payLine("Bank", s.bank_name)}${payLine("Account", s.bank_account_name)}${payLine("IBAN", s.bank_iban)}${payLine("SWIFT / BIC", s.bank_swift)}${payLine("M-Pesa", s.mpesa_number)}${payLine("Reference", a.invoiceNumber)}
            </div>`
      }

      ${a.brief.invoice_notes ? `<div style="margin:20px 0"><p style="font-family:ui-monospace,monospace;letter-spacing:.18em;color:${accent};font-size:10px;margin:0 0 8px">NOTES</p><p style="font-size:13px;line-height:1.7;color:#e2e8f0;white-space:pre-wrap;margin:0">${esc(a.brief.invoice_notes)}</p></div>` : ""}
      ${a.brief.invoice_terms || s.payment_terms ? `<p style="font-size:12px;line-height:1.7;color:#94a3b8;margin:18px 0 0">${esc(a.brief.invoice_terms || s.payment_terms)}</p>` : ""}
      ${s.legal_text ? `<p style="font-size:11px;line-height:1.6;color:#64748b;margin:18px 0 0">${esc(s.legal_text)}</p>` : ""}
      <p style="font-size:12px;color:#64748b;margin:28px 0 0">— ${esc(studio)}${s.footer_note ? ` · ${esc(s.footer_note)}` : ""}</p>
    </div>
  </div>`;
  const subjectPrefix =
    a.variant === "receipt"
      ? "Payment received"
      : a.variant === "reminder"
        ? "Reminder: invoice"
        : "Invoice";
  return { subject: `${subjectPrefix} ${a.invoiceNumber} — ${studio}`, html };
}
function toBase64(bytes) {
  let binary = "";
  const chunk = 32768;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}
export {
  PDF_BUCKET,
  PROOF_BUCKET,
  adminEmail,
  assertAdmin,
  buildInvoiceEmail,
  esc,
  fromEmail,
  itemsOrFallback,
  loadBranding,
  loadItems,
  logEvent,
  randomToken,
  renderPdf,
  sendMail,
  signedUrl,
  siteOrigin,
  toBase64,
  toPdfContext,
  totalsFor,
};
