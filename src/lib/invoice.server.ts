/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Server-only invoicing helpers. Never reachable from the client bundle
 * (blocked by the *.server.ts filename convention).
 */
import type { InvoiceBranding, InvoicePdfContext } from "./invoice-pdf.server";
import { buildInvoicePdf } from "./invoice-pdf.server";
import { computeTotals, money, type LineItem } from "./invoice-core";

export const PDF_BUCKET = "invoices";
export const PROOF_BUCKET = "invoice-proofs";
const SIGNED_URL_TTL = 60 * 60 * 24 * 7; // 7 days
const RESEND_GATEWAY = "https://connector-gateway.lovable.dev/resend";

/* --------------------------------------------------------------- utilities */
export function siteOrigin(): string {
  return (
    process.env["PUBLIC_SITE_URL"] ||
    process.env["SITE_URL"] ||
    "https://portfoliokutuzov.lovable.app"
  ).replace(/\/$/, "");
}

export function adminEmail(): string {
  return (
    process.env["BRIEFING_ADMIN_EMAIL"] ??
    process.env["ADMIN_EMAIL"] ??
    "contact@edmundokutuzov.art"
  );
}

export function fromEmail(): string {
  return process.env["BRIEFING_FROM"] ?? "Edmundo Kutuzov <onboarding@resend.dev>";
}

export const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function signedUrl(admin: any, bucket: string, path: string, ttl = SIGNED_URL_TTL) {
  const { data, error } = await admin.storage.from(bucket).createSignedUrl(path, ttl);
  if (error || !data?.signedUrl) throw new Error(error?.message || "Failed to sign URL");
  return data.signedUrl as string;
}

export async function assertAdmin(context: { supabase: any }) {
  const { data, error } = await context.supabase.rpc("is_admin");
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin only");
}

export async function loadBranding(admin: any): Promise<InvoiceBranding> {
  const { data } = await admin
    .from("site_settings")
    .select("value")
    .eq("key", "invoice_settings")
    .maybeSingle();
  return (data?.value ?? {}) as InvoiceBranding;
}

export async function loadItems(admin: any, briefingId: string): Promise<LineItem[]> {
  const { data, error } = await admin
    .from("invoice_line_items")
    .select("id, description, detail, qty, unit, unit_price, discount_pct, sort_order")
    .eq("briefing_id", briefingId)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r: any) => ({
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

/** Fallback so a legacy single-amount invoice still renders as a line item. */
export function itemsOrFallback(items: LineItem[], brief: any): LineItem[] {
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

export async function logEvent(
  admin: any,
  briefingId: string,
  eventType: string,
  actor: string,
  detail: Record<string, unknown> = {},
  recipients?: string[],
) {
  await admin.from("invoice_events").insert({
    briefing_id: briefingId,
    event_type: eventType,
    actor,
    recipients: recipients ?? null,
    detail,
  });
}

/* ------------------------------------------------------------ pdf assembly */
export type BuildArgs = {
  brief: any;
  items: LineItem[];
  branding: InvoiceBranding;
  invoiceNumber: string;
  token: string | null;
  status?: string;
};

export function toPdfContext(a: BuildArgs): InvoicePdfContext {
  return {
    invoiceNumber: a.invoiceNumber,
    issueDate: a.brief.invoice_issue_date ?? new Date().toISOString().slice(0, 10),
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

export async function renderPdf(a: BuildArgs): Promise<Uint8Array> {
  return await buildInvoicePdf(toPdfContext(a));
}

export function totalsFor(brief: any, items: LineItem[]) {
  return computeTotals({
    items: itemsOrFallback(items, brief),
    discount_pct: Number(brief.invoice_discount_pct ?? 0),
    tax_pct: Number(brief.invoice_tax_pct ?? 0),
    deposit_pct: Number(brief.invoice_deposit_pct ?? 0),
  });
}

/* ---------------------------------------------------------------- mailing */
export async function sendMail(args: {
  to: string[];
  subject: string;
  html: string;
  cc?: string[];
  attachment?: { filename: string; content: string };
}) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const resendKey = process.env["RESEND_API_KEY"];
  if (!lovableKey || !resendKey) return { skipped: true as const };
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
      attachments: args.attachment ? [args.attachment] : undefined,
    }),
  });
  return { skipped: false as const, ok: res.ok, status: res.status };
}

/* ------------------------------------------------------------ email design */
type EmailArgs = {
  brief: any;
  branding: InvoiceBranding;
  items: LineItem[];
  invoiceNumber: string;
  portalUrl: string;
  pdfUrl: string;
  variant: "invoice" | "reminder" | "receipt";
};

export function buildInvoiceEmail(a: EmailArgs): { subject: string; html: string } {
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

  const payLine = (k: string, v?: string | null) =>
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

/** base64 for email attachments / instant browser download. */
export function toBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}
