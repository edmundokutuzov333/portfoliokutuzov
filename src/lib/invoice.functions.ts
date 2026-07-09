import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const RESEND_GATEWAY = "https://connector-gateway.lovable.dev/resend";
// Invoices live in a private bucket; PDFs are only served via short-lived signed URLs.
const BUCKET = "invoices";
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

async function signedPdfUrl(admin: any, path: string): Promise<string> {
  const { data, error } = await admin.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL_SECONDS);
  if (error || !data?.signedUrl) throw new Error(error?.message || "Failed to sign invoice URL");
  return data.signedUrl;
}

const InvoiceInput = z.object({
  briefing_id: z.string().uuid(),
  amount: z.number().positive().max(100000000),
  currency: z.enum(["EUR", "USD", "MZN", "GBP", "BRL"]),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
});

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const CURRENCY_SYMBOL: Record<string, string> = {
  EUR: "€", USD: "$", MZN: "MT ", GBP: "£", BRL: "R$",
};

const money = (amount: number, currency: string) =>
  `${CURRENCY_SYMBOL[currency] ?? ""}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  })}`;

function hexToRgb01(hex: string, fallback: [number, number, number]): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex ?? "");
  if (!m) return fallback;
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function siteOrigin(): string {
  return (
    process.env.PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://portfoliokutuzov.lovable.app"
  ).replace(/\/$/, "");
}

async function sendMail(from: string, to: string[], subject: string, html: string, cc?: string[]) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  if (!lovableKey || !resendKey) return { skipped: true as const };
  const res = await fetch(`${RESEND_GATEWAY}/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": resendKey,
    },
    body: JSON.stringify({ from, to, cc, subject, html }),
  });
  return { skipped: false as const, ok: res.ok, status: res.status };
}

function nextInvoiceNumber() {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `EK-${ymd}-${rand}`;
}

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

type InvoiceContext = {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string | null;
  amount: number;
  currency: string;
  notes: string | null;
  brief: {
    id: string;
    full_name: string;
    email: string;
    company_name: string | null;
    country: string | null;
    project_type: string;
  };
  settings: Record<string, string>;
};

async function buildInvoicePdf(ctx: InvoiceContext): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const reg = await pdf.embedFont(StandardFonts.Helvetica);

  const [ar, ag, ab] = hexToRgb01(ctx.settings.brand_color || "#48A0E0", [0.28, 0.62, 0.88]);
  const accent = rgb(ar, ag, ab);
  const ink = rgb(0.06, 0.09, 0.15);
  const muted = rgb(0.4, 0.45, 0.55);
  const rule = rgb(0.85, 0.88, 0.93);

  const draw = (t: string, x: number, y: number, o: { size?: number; font?: typeof reg; color?: typeof ink } = {}) =>
    page.drawText(t, { x, y, size: o.size ?? 10, font: o.font ?? reg, color: o.color ?? ink });

  // Optional logo
  if (ctx.settings.logo_url) {
    try {
      const res = await fetch(ctx.settings.logo_url);
      if (res.ok) {
        const bytes = new Uint8Array(await res.arrayBuffer());
        const ct = res.headers.get("content-type") || "";
        const img = ct.includes("png") ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
        const scale = Math.min(120 / img.width, 40 / img.height);
        page.drawImage(img, { x: 40, y: 790, width: img.width * scale, height: img.height * scale });
      }
    } catch { /* ignore */ }
  }

  draw(ctx.settings.header_label || "PROFORMA INVOICE", 40, 762, { size: 10, font: bold, color: accent });
  draw(ctx.settings.studio_name || "Edmundo Kutuzov", 40, 744, { size: 18, font: bold });
  if (ctx.settings.studio_address) draw(ctx.settings.studio_address, 40, 728, { color: muted });
  if (ctx.settings.studio_email) draw(ctx.settings.studio_email, 40, 714, { color: muted });
  if (ctx.settings.studio_tax_id) draw(`Tax ID: ${ctx.settings.studio_tax_id}`, 40, 700, { color: muted });

  draw("Invoice N°", 400, 762, { size: 9, color: muted });
  draw(ctx.invoiceNumber, 400, 748, { size: 12, font: bold });
  draw("Issued", 400, 730, { size: 9, color: muted });
  draw(ctx.issueDate, 400, 716);
  if (ctx.dueDate) {
    draw("Due", 400, 700, { size: 9, color: muted });
    draw(ctx.dueDate, 400, 686);
  }

  page.drawRectangle({ x: 40, y: 660, width: 515, height: 1, color: rule });
  draw("BILL TO", 40, 640, { size: 9, font: bold, color: muted });
  draw(ctx.brief.full_name, 40, 624, { size: 12, font: bold });
  if (ctx.brief.company_name) draw(ctx.brief.company_name, 40, 610, { color: muted });
  draw(ctx.brief.email, 300, 624, { color: muted });
  if (ctx.brief.country) draw(ctx.brief.country, 300, 610, { color: muted });

  draw("DESCRIPTION", 40, 578, { size: 9, font: bold, color: muted });
  draw("AMOUNT", 480, 578, { size: 9, font: bold, color: muted });
  page.drawRectangle({ x: 40, y: 573, width: 515, height: 1, color: rule });

  draw(ctx.brief.project_type, 40, 553, { font: bold });
  const notesLines = (ctx.notes || "Creative direction & production per approved briefing.")
    .split("\n").slice(0, 6);
  let y = 537;
  for (const line of notesLines) { draw(line.slice(0, 90), 40, y, { color: muted, size: 9 }); y -= 12; }

  draw(money(ctx.amount, ctx.currency), 480, 553, { font: bold });
  draw(ctx.currency, 480, 537, { color: muted, size: 9 });

  page.drawRectangle({ x: 40, y: 452, width: 515, height: 1, color: rule });
  draw("TOTAL DUE", 380, 432, { size: 10, color: muted });
  draw(money(ctx.amount, ctx.currency), 480, 417, { size: 16, font: bold, color: accent });
  draw(ctx.currency, 480, 402, { color: muted, size: 9 });

  draw("PAYMENT DETAILS", 40, 372, { size: 9, font: bold, color: muted });
  let py = 354;
  const detail = (label: string, val?: string) => {
    if (!val) return;
    draw(label, 40, py, { size: 9, color: muted });
    draw(val, 150, py);
    py -= 14;
  };
  detail("Bank", ctx.settings.bank_name);
  detail("Account name", ctx.settings.bank_account_name);
  detail("IBAN", ctx.settings.bank_iban);
  detail("SWIFT / BIC", ctx.settings.bank_swift);
  detail("M-Pesa", ctx.settings.mpesa_number);
  detail("Reference", ctx.invoiceNumber);

  if (ctx.settings.payment_terms) {
    draw("TERMS", 40, py - 10, { size: 9, font: bold, color: muted });
    const terms = ctx.settings.payment_terms.match(/.{1,90}(\s|$)/g) ?? [];
    let ty = py - 26;
    for (const t of terms.slice(0, 4)) { draw(t.trim(), 40, ty, { color: muted, size: 9 }); ty -= 12; }
  }

  if (ctx.settings.legal_text) {
    const legal = ctx.settings.legal_text.match(/.{1,110}(\s|$)/g) ?? [];
    let ly = 90;
    for (const l of legal.slice(0, 4)) { draw(l.trim(), 40, ly, { color: muted, size: 8 }); ly -= 10; }
  }
  if (ctx.settings.footer_note) draw(ctx.settings.footer_note, 40, 46, { color: muted, size: 9 });
  draw("This is a proforma invoice — not a fiscal receipt.", 40, 34, { color: muted, size: 8 });

  return await pdf.save();
}

function buildEmailHtml(args: {
  brief: InvoiceContext["brief"];
  invoiceNumber: string;
  issueDate: string;
  dueDate: string | null;
  amount: number;
  currency: string;
  notes: string | null;
  invoiceUrl: string;
  clientPortalUrl: string;
  settings: Record<string, string>;
}) {
  const s = args.settings;
  const accent = s.brand_color || "#7dd3fc";
  const firstName = args.brief.full_name.split(" ")[0];
  const inner = `
    <p style="font-family:monospace;letter-spacing:.18em;color:${accent};font-size:11px;margin:0 0 16px">${esc(s.header_label || "PROFORMA INVOICE")} · ${esc(args.invoiceNumber)}</p>
    <h1 style="font-size:26px;line-height:1.15;margin:0 0 18px;color:#f5f8ff">Hi ${esc(firstName)}, your invoice is ready.</h1>
    <p style="font-size:15px;line-height:1.7;color:#cbd5e1;margin:0 0 22px">
      Please find the invoice for <b>${esc(args.brief.project_type)}</b>. Once payment is confirmed, we'll kick off production.
    </p>
    <div style="border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:18px 20px;margin:20px 0">
      <p style="margin:0 0 6px;font-size:11px;font-family:monospace;letter-spacing:.18em;color:${accent}">AMOUNT DUE</p>
      <p style="margin:0 0 14px;font-size:26px;font-weight:700;color:#f5f8ff">${esc(money(args.amount, args.currency))} <span style="font-size:13px;color:#94a3b8">${esc(args.currency)}</span></p>
      <p style="margin:6px 0;font-size:13px;color:#cbd5e1"><b>Invoice N°:</b> ${esc(args.invoiceNumber)}</p>
      <p style="margin:6px 0;font-size:13px;color:#cbd5e1"><b>Issued:</b> ${esc(args.issueDate)}</p>
      ${args.dueDate ? `<p style="margin:6px 0;font-size:13px;color:#cbd5e1"><b>Due:</b> ${esc(args.dueDate)}</p>` : ""}
    </div>
    <p style="margin:24px 0">
      <a href="${esc(args.clientPortalUrl)}" style="display:inline-block;background:${accent};color:#01040A;padding:12px 22px;border-radius:8px;font-weight:700;text-decoration:none;margin-right:8px">View invoice & payment details</a>
      <a href="${esc(args.invoiceUrl)}" style="display:inline-block;border:1px solid ${accent};color:${accent};padding:12px 22px;border-radius:8px;font-weight:700;text-decoration:none">Download PDF</a>
    </p>
    ${args.notes ? `<div style="margin:20px 0"><p style="font-family:monospace;letter-spacing:.18em;color:${accent};font-size:11px;margin:0 0 8px">NOTES</p><p style="font-size:13px;line-height:1.7;color:#e2e8f0;white-space:pre-wrap;margin:0">${esc(args.notes)}</p></div>` : ""}
    ${s.legal_text ? `<p style="font-size:11px;line-height:1.6;color:#64748b;margin:24px 0 0">${esc(s.legal_text)}</p>` : ""}
    <p style="font-size:13px;line-height:1.7;color:#94a3b8;margin:20px 0 0">Reply to this email if anything needs adjusting.</p>
  `;
  return `<div style="font-family:-apple-system,Segoe UI,Inter,sans-serif;background:#01040A;color:#e2e8f0;padding:32px">${inner}<p style="font-size:12px;color:#64748b;margin:32px 0 0">— ${esc(s.studio_name || "Edmundo Kutuzov")} — ${esc(s.footer_note || "Art Director")}</p></div>`;
}

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("is_admin");
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin only");
}

async function loadInvoiceSettings(admin: any): Promise<Record<string, string>> {
  const { data } = await admin.from("site_settings").select("value").eq("key", "invoice_settings").maybeSingle();
  return (data?.value ?? {}) as Record<string, string>;
}

// --------- Server functions ---------

export const previewInvoiceEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => InvoiceInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: brief, error } = await supabaseAdmin
      .from("briefing_submissions")
      .select("id, full_name, email, company_name, country, project_type, invoice_number, invoice_public_token, invoice_pdf_path")
      .eq("id", data.briefing_id)
      .single();
    if (error || !brief) throw new Error(error?.message || "Briefing not found");

    const settings = await loadInvoiceSettings(supabaseAdmin);
    const invoiceNumber = brief.invoice_number || `PREVIEW-${nextInvoiceNumber()}`;
    const token = brief.invoice_public_token || "preview-token";
    const invoiceUrl = brief.invoice_pdf_path
      ? await signedPdfUrl(supabaseAdmin, brief.invoice_pdf_path)
      : "#pdf-generated-on-send";
    const clientPortalUrl = `${siteOrigin()}/i/${token}`;

    const html = buildEmailHtml({
      brief,
      invoiceNumber,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: data.due_date ?? null,
      amount: data.amount,
      currency: data.currency,
      notes: data.notes ?? null,
      invoiceUrl,
      clientPortalUrl,
      settings,
    });

    const subject = `Invoice ${invoiceNumber} — ${settings.studio_name || "Edmundo Kutuzov"}`;
    const ADMIN = process.env.BRIEFING_ADMIN_EMAIL ?? process.env.ADMIN_EMAIL ?? "contact@edmundokutuzov.art";
    return { html, subject, to: [brief.email], cc: [ADMIN], invoiceNumber, clientPortalUrl };
  });

export const generateBriefingInvoice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => InvoiceInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: brief, error: briefErr } = await supabaseAdmin
      .from("briefing_submissions")
      .select("id, full_name, email, company_name, country, project_type, invoice_public_token")
      .eq("id", data.briefing_id)
      .single();
    if (briefErr || !brief) throw new Error(briefErr?.message || "Briefing not found");

    const settings = await loadInvoiceSettings(supabaseAdmin);
    const invoiceNumber = nextInvoiceNumber();
    const issueDate = new Date().toISOString().slice(0, 10);
    const token = brief.invoice_public_token || randomToken();

    const pdfBytes = await buildInvoicePdf({
      invoiceNumber, issueDate,
      dueDate: data.due_date ?? null,
      amount: data.amount, currency: data.currency,
      notes: data.notes ?? null,
      brief, settings,
    });

    const pdfPath = `${brief.id}/${invoiceNumber}.pdf`;
    const { error: upErr } = await supabaseAdmin.storage.from(BUCKET).upload(pdfPath, pdfBytes, {
      contentType: "application/pdf", upsert: true,
    });
    if (upErr) throw new Error(`Storage upload failed: ${upErr.message}`);

    const invoiceUrl = await signedPdfUrl(supabaseAdmin, pdfPath);
    const clientPortalUrl = `${siteOrigin()}/i/${token}`;

    const { error: updErr } = await supabaseAdmin
      .from("briefing_submissions")
      .update({
        invoice_number: invoiceNumber,
        invoice_amount: data.amount,
        invoice_currency: data.currency,
        invoice_due_date: data.due_date ?? null,
        invoice_notes: data.notes ?? null,
        invoice_pdf_path: pdfPath,
        invoice_status: "generated",
        invoice_public_token: token,
        status: "accepted",
      })
      .eq("id", brief.id);
    if (updErr) throw new Error(updErr.message);

    await supabaseAdmin.from("invoice_events").insert({
      briefing_id: brief.id,
      event_type: "generated",
      actor: context.userId,
      detail: { invoice_number: invoiceNumber, amount: data.amount, currency: data.currency },
    });

    return { ok: true, invoiceNumber, invoiceUrl, pdfPath, clientPortalUrl, token };
  });

export const sendBriefingInvoice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      briefing_id: z.string().uuid(),
      to_override: z.array(z.string().email()).optional(),
      cc_override: z.array(z.string().email()).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: brief, error } = await supabaseAdmin
      .from("briefing_submissions")
      .select("*")
      .eq("id", data.briefing_id)
      .single();
    if (error || !brief) throw new Error(error?.message || "Briefing not found");
    if (!brief.invoice_number || !brief.invoice_pdf_path) throw new Error("Generate the invoice first");

    const settings = await loadInvoiceSettings(supabaseAdmin);
    const invoiceUrl = await signedPdfUrl(supabaseAdmin, brief.invoice_pdf_path);
    const clientPortalUrl = `${siteOrigin()}/i/${brief.invoice_public_token}`;

    const html = buildEmailHtml({
      brief,
      invoiceNumber: brief.invoice_number,
      issueDate: (brief.invoice_sent_at || new Date().toISOString()).slice(0, 10),
      dueDate: brief.invoice_due_date,
      amount: Number(brief.invoice_amount ?? 0),
      currency: brief.invoice_currency || "EUR",
      notes: brief.invoice_notes,
      invoiceUrl, clientPortalUrl, settings,
    });

    const FROM = process.env.BRIEFING_FROM ?? "Edmundo Kutuzov <onboarding@resend.dev>";
    const ADMIN = process.env.BRIEFING_ADMIN_EMAIL ?? process.env.ADMIN_EMAIL ?? "contact@edmundokutuzov.art";
    const to = data.to_override?.length ? data.to_override : [brief.email];
    const cc = data.cc_override?.length ? data.cc_override : [ADMIN];
    const subject = `Invoice ${brief.invoice_number} — ${settings.studio_name || "Edmundo Kutuzov"}`;
    const result = await sendMail(FROM, to, subject, html, cc);

    await supabaseAdmin.from("briefing_submissions").update({
      invoice_status: "sent",
      invoice_sent_at: new Date().toISOString(),
    }).eq("id", brief.id);

    await supabaseAdmin.from("invoice_events").insert({
      briefing_id: brief.id,
      event_type: "sent",
      actor: context.userId,
      recipients: [...to, ...cc],
      detail: {
        invoice_number: brief.invoice_number,
        subject,
        delivery: result.skipped ? "no-provider-configured" : result.ok ? "delivered" : `error-${result.status}`,
      },
    });

    return { ok: true, delivery: result };
  });

export const setInvoiceStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      briefing_id: z.string().uuid(),
      status: z.enum(["draft", "generated", "sent", "viewed", "paid", "void"]),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: { invoice_status: typeof data.status; invoice_paid_at?: string } = { invoice_status: data.status };
    if (data.status === "paid") patch.invoice_paid_at = new Date().toISOString();
    const { error } = await supabaseAdmin.from("briefing_submissions").update(patch).eq("id", data.briefing_id);
    if (error) throw new Error(error.message);

    await supabaseAdmin.from("invoice_events").insert({
      briefing_id: data.briefing_id,
      event_type: `status:${data.status}`,
      actor: context.userId,
      detail: {},
    });
    return { ok: true };
  });

export const listInvoiceEvents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ briefing_id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("invoice_events")
      .select("id, event_type, actor, recipients, detail, created_at")
      .eq("briefing_id", data.briefing_id)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

// --------- Public: fetch invoice by token, log view ---------

export const getPublicInvoice = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => z.object({ token: z.string().min(16).max(128) }).parse(i))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: brief, error } = await supabaseAdmin
      .from("briefing_submissions")
      .select("id, full_name, company_name, project_type, invoice_number, invoice_amount, invoice_currency, invoice_due_date, invoice_pdf_path, invoice_status, invoice_sent_at, invoice_paid_at, invoice_viewed_at, invoice_notes")
      .eq("invoice_public_token", data.token)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!brief || !brief.invoice_pdf_path) throw new Error("Invoice not found");

    const settings = await loadInvoiceSettings(supabaseAdmin);
    const pdfUrl = supabaseAdmin.storage.from(BUCKET).getPublicUrl(brief.invoice_pdf_path).data.publicUrl;

    // Log the view (first time only updates viewed_at + bumps status if still 'sent')
    if (!brief.invoice_viewed_at) {
      await supabaseAdmin.from("briefing_submissions").update({
        invoice_viewed_at: new Date().toISOString(),
        invoice_status: brief.invoice_status === "sent" ? "viewed" : brief.invoice_status,
      }).eq("id", brief.id);
    }
    await supabaseAdmin.from("invoice_events").insert({
      briefing_id: brief.id,
      event_type: "viewed",
      actor: "public",
      detail: {},
    });

    return {
      client: {
        name: brief.full_name,
        company: brief.company_name,
      },
      invoice: {
        number: brief.invoice_number,
        amount: brief.invoice_amount,
        currency: brief.invoice_currency,
        due_date: brief.invoice_due_date,
        status: brief.invoice_status,
        sent_at: brief.invoice_sent_at,
        paid_at: brief.invoice_paid_at,
        project_type: brief.project_type,
        notes: brief.invoice_notes,
        pdf_url: pdfUrl,
      },
      branding: {
        studio_name: settings.studio_name || "Edmundo Kutuzov",
        brand_color: settings.brand_color || "#7dd3fc",
        logo_url: settings.logo_url || null,
        header_label: settings.header_label || "PROFORMA INVOICE",
        footer_note: settings.footer_note || null,
        legal_text: settings.legal_text || null,
      },
      payment: {
        bank_name: settings.bank_name || null,
        bank_account_name: settings.bank_account_name || null,
        bank_iban: settings.bank_iban || null,
        bank_swift: settings.bank_swift || null,
        mpesa_number: settings.mpesa_number || null,
        payment_terms: settings.payment_terms || null,
      },
    };
  });
