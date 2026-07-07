import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const RESEND_GATEWAY = "https://connector-gateway.lovable.dev/resend";
const BUCKET = "site-assets";

const Input = z.object({
  briefing_id: z.string().uuid(),
  amount: z.number().positive().max(100000000),
  currency: z.enum(["EUR", "USD", "MZN", "GBP", "BRL"]),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
});

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const CURRENCY_SYMBOL: Record<string, string> = {
  EUR: "€",
  USD: "$",
  MZN: "MT ",
  GBP: "£",
  BRL: "R$",
};

const money = (amount: number, currency: string) =>
  `${CURRENCY_SYMBOL[currency] ?? ""}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}${currency === "MZN" ? "" : ""}`;

function shell(inner: string) {
  return `<div style="font-family:-apple-system,Segoe UI,Inter,sans-serif;background:#01040A;color:#e2e8f0;padding:32px">${inner}<p style="font-size:12px;color:#64748b;margin:32px 0 0">— Edmundo Kutuzov — Art Director</p></div>`;
}

async function sendMail(from: string, to: string[], subject: string, html: string, cc?: string[]) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  if (!lovableKey || !resendKey) return;
  await fetch(`${RESEND_GATEWAY}/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": resendKey,
    },
    body: JSON.stringify({ from, to, cc, subject, html }),
  });
}

function nextInvoiceNumber() {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `EK-${ymd}-${rand}`;
}

type InvoiceContext = {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string | null;
  amount: number;
  currency: string;
  notes: string | null;
  brief: {
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
  const page = pdf.addPage([595, 842]); // A4
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const reg = await pdf.embedFont(StandardFonts.Helvetica);

  const ink = rgb(0.06, 0.09, 0.15);
  const muted = rgb(0.4, 0.45, 0.55);
  const accent = rgb(0.28, 0.62, 0.88);

  const draw = (
    text: string,
    x: number,
    y: number,
    opts: { size?: number; font?: typeof reg; color?: typeof ink } = {},
  ) => {
    page.drawText(text, {
      x,
      y,
      size: opts.size ?? 10,
      font: opts.font ?? reg,
      color: opts.color ?? ink,
    });
  };

  // Header
  draw("PROFORMA INVOICE", 40, 790, { size: 10, font: bold, color: accent });
  draw(ctx.settings.studio_name || "Edmundo Kutuzov", 40, 770, { size: 18, font: bold });
  if (ctx.settings.studio_address) draw(ctx.settings.studio_address, 40, 754, { color: muted });
  if (ctx.settings.studio_email) draw(ctx.settings.studio_email, 40, 740, { color: muted });
  if (ctx.settings.studio_tax_id)
    draw(`Tax ID: ${ctx.settings.studio_tax_id}`, 40, 726, { color: muted });

  // Invoice meta
  draw("Invoice N°", 400, 790, { size: 9, color: muted });
  draw(ctx.invoiceNumber, 400, 776, { size: 12, font: bold });
  draw("Issued", 400, 758, { size: 9, color: muted });
  draw(ctx.issueDate, 400, 744);
  if (ctx.dueDate) {
    draw("Due", 400, 728, { size: 9, color: muted });
    draw(ctx.dueDate, 400, 714);
  }

  // Bill to
  page.drawRectangle({
    x: 40,
    y: 620,
    width: 515,
    height: 1,
    color: rgb(0.85, 0.88, 0.93),
  });
  draw("BILL TO", 40, 660, { size: 9, font: bold, color: muted });
  draw(ctx.brief.full_name, 40, 644, { size: 12, font: bold });
  if (ctx.brief.company_name) draw(ctx.brief.company_name, 40, 630, { color: muted });
  draw(ctx.brief.email, 300, 644, { color: muted });
  if (ctx.brief.country) draw(ctx.brief.country, 300, 630, { color: muted });

  // Line items
  draw("DESCRIPTION", 40, 590, { size: 9, font: bold, color: muted });
  draw("AMOUNT", 480, 590, { size: 9, font: bold, color: muted });
  page.drawRectangle({ x: 40, y: 585, width: 515, height: 1, color: rgb(0.85, 0.88, 0.93) });

  draw(ctx.brief.project_type, 40, 565, { font: bold });
  const notesLines = (ctx.notes || "Creative direction & production per approved briefing.")
    .split("\n")
    .slice(0, 6);
  let y = 549;
  for (const line of notesLines) {
    draw(line.slice(0, 90), 40, y, { color: muted, size: 9 });
    y -= 12;
  }

  draw(money(ctx.amount, ctx.currency), 480, 565, { font: bold });
  draw(ctx.currency, 480, 549, { color: muted, size: 9 });

  // Total
  page.drawRectangle({ x: 40, y: 460, width: 515, height: 1, color: rgb(0.85, 0.88, 0.93) });
  draw("TOTAL DUE", 380, 440, { size: 10, color: muted });
  draw(money(ctx.amount, ctx.currency), 480, 425, { size: 16, font: bold });
  draw(ctx.currency, 480, 410, { color: muted, size: 9 });

  // Payment details
  draw("PAYMENT DETAILS", 40, 380, { size: 9, font: bold, color: muted });
  let py = 362;
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
    for (const t of terms.slice(0, 4)) {
      draw(t.trim(), 40, ty, { color: muted, size: 9 });
      ty -= 12;
    }
  }

  if (ctx.settings.footer_note) {
    draw(ctx.settings.footer_note, 40, 60, { color: muted, size: 9 });
  }
  draw(
    "This is a proforma invoice — not a fiscal receipt.",
    40,
    46,
    { color: muted, size: 8 },
  );

  return await pdf.save();
}

export const generateBriefingInvoice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data, context }) => {
    // Authorize: admin only
    const { data: adminCheck, error: adminErr } = await context.supabase.rpc("is_admin");
    if (adminErr) throw new Error(adminErr.message);
    if (!adminCheck) throw new Error("Forbidden: admin only");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Load briefing
    const { data: brief, error: briefErr } = await supabaseAdmin
      .from("briefing_submissions")
      .select("id, full_name, email, company_name, country, project_type")
      .eq("id", data.briefing_id)
      .single();
    if (briefErr || !brief) throw new Error(briefErr?.message || "Briefing not found");

    // Load settings
    const { data: settingsRow } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "invoice_settings")
      .maybeSingle();
    const settings = (settingsRow?.value ?? {}) as Record<string, string>;

    const invoiceNumber = nextInvoiceNumber();
    const issueDate = new Date().toISOString().slice(0, 10);

    const pdfBytes = await buildInvoicePdf({
      invoiceNumber,
      issueDate,
      dueDate: data.due_date ?? null,
      amount: data.amount,
      currency: data.currency,
      notes: data.notes ?? null,
      brief,
      settings,
    });

    const pdfPath = `invoices/${brief.id}/${invoiceNumber}.pdf`;
    const { error: upErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(pdfPath, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });
    if (upErr) throw new Error(`Storage upload failed: ${upErr.message}`);

    const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(pdfPath);
    const invoiceUrl = pub.publicUrl;

    // Update briefing row
    const { error: updErr } = await supabaseAdmin
      .from("briefing_submissions")
      .update({
        invoice_number: invoiceNumber,
        invoice_amount: data.amount,
        invoice_currency: data.currency,
        invoice_due_date: data.due_date ?? null,
        invoice_notes: data.notes ?? null,
        invoice_pdf_path: pdfPath,
        invoice_status: "sent",
        invoice_sent_at: new Date().toISOString(),
        status: "accepted",
      })
      .eq("id", brief.id);
    if (updErr) throw new Error(updErr.message);

    // Send email
    const FROM = process.env.BRIEFING_FROM ?? "Edmundo Kutuzov <onboarding@resend.dev>";
    const ADMIN =
      process.env.BRIEFING_ADMIN_EMAIL ??
      process.env.ADMIN_EMAIL ??
      "contact@edmundokutuzov.art";
    const firstName = brief.full_name.split(" ")[0];

    const html = shell(`
      <p style="font-family:monospace;letter-spacing:.18em;color:#7dd3fc;font-size:11px;margin:0 0 16px">PROFORMA INVOICE · ${esc(invoiceNumber)}</p>
      <h1 style="font-size:26px;line-height:1.15;margin:0 0 18px;color:#f5f8ff">Hi ${esc(firstName)}, your invoice is ready.</h1>
      <p style="font-size:15px;line-height:1.7;color:#cbd5e1;margin:0 0 22px">
        Please find the proforma invoice for <b>${esc(brief.project_type)}</b> attached as a PDF link below. Once payment is confirmed, we'll kick off production.
      </p>
      <div style="border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:18px 20px;margin:20px 0">
        <p style="margin:0 0 6px;font-size:11px;font-family:monospace;letter-spacing:.18em;color:#7dd3fc">AMOUNT DUE</p>
        <p style="margin:0 0 14px;font-size:26px;font-weight:700;color:#f5f8ff">${esc(money(data.amount, data.currency))} <span style="font-size:13px;color:#94a3b8">${esc(data.currency)}</span></p>
        <p style="margin:6px 0;font-size:13px;color:#cbd5e1"><b>Invoice N°:</b> ${esc(invoiceNumber)}</p>
        <p style="margin:6px 0;font-size:13px;color:#cbd5e1"><b>Issued:</b> ${esc(issueDate)}</p>
        ${data.due_date ? `<p style="margin:6px 0;font-size:13px;color:#cbd5e1"><b>Due:</b> ${esc(data.due_date)}</p>` : ""}
      </div>
      <p style="margin:24px 0">
        <a href="${esc(invoiceUrl)}" style="display:inline-block;background:#7dd3fc;color:#01040A;padding:12px 22px;border-radius:8px;font-weight:700;text-decoration:none">Download invoice (PDF)</a>
      </p>
      ${data.notes ? `<div style="margin:20px 0"><p style="font-family:monospace;letter-spacing:.18em;color:#7dd3fc;font-size:11px;margin:0 0 8px">NOTES</p><p style="font-size:13px;line-height:1.7;color:#e2e8f0;white-space:pre-wrap;margin:0">${esc(data.notes)}</p></div>` : ""}
      ${
        settings.bank_iban || settings.mpesa_number
          ? `<div style="border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px 20px;margin:20px 0">
              <p style="font-family:monospace;letter-spacing:.18em;color:#7dd3fc;font-size:11px;margin:0 0 10px">PAYMENT DETAILS</p>
              ${settings.bank_name ? `<p style="margin:4px 0;font-size:13px;color:#cbd5e1"><b>Bank:</b> ${esc(settings.bank_name)}</p>` : ""}
              ${settings.bank_account_name ? `<p style="margin:4px 0;font-size:13px;color:#cbd5e1"><b>Account:</b> ${esc(settings.bank_account_name)}</p>` : ""}
              ${settings.bank_iban ? `<p style="margin:4px 0;font-size:13px;color:#cbd5e1"><b>IBAN:</b> ${esc(settings.bank_iban)}</p>` : ""}
              ${settings.bank_swift ? `<p style="margin:4px 0;font-size:13px;color:#cbd5e1"><b>SWIFT:</b> ${esc(settings.bank_swift)}</p>` : ""}
              ${settings.mpesa_number ? `<p style="margin:4px 0;font-size:13px;color:#cbd5e1"><b>M-Pesa:</b> ${esc(settings.mpesa_number)}</p>` : ""}
              <p style="margin:10px 0 0;font-size:12px;color:#94a3b8">Reference: <b>${esc(invoiceNumber)}</b></p>
            </div>`
          : ""
      }
      <p style="font-size:13px;line-height:1.7;color:#94a3b8;margin:20px 0 0">
        Reply to this email if anything needs adjusting.
      </p>
    `);

    await sendMail(
      FROM,
      [brief.email],
      `Invoice ${invoiceNumber} — Edmundo Kutuzov`,
      html,
      [ADMIN],
    );

    return { ok: true, invoiceNumber, invoiceUrl, pdfPath };
  });
