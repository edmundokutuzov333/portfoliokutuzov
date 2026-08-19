import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/* ------------------------------------------------------------------ schemas */
const LineItemSchema = z.object({
  id: z.string().uuid().optional(),
  description: z.string().trim().min(1).max(300),
  detail: z.string().trim().max(600).nullable().optional(),
  qty: z.number().min(0).max(100000),
  unit: z.string().trim().min(1).max(24).default("un"),
  unit_price: z.number().min(0).max(100000000),
  discount_pct: z.number().min(0).max(100).default(0),
});

const DraftSchema = z.object({
  briefing_id: z.string().uuid(),
  currency: z.enum(["EUR", "USD", "MZN", "GBP", "BRL", "ZAR"]),
  issue_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  discount_pct: z.number().min(0).max(100).default(0),
  tax_pct: z.number().min(0).max(100).default(0),
  tax_label: z.string().trim().max(60).nullable().optional(),
  deposit_pct: z.number().min(0).max(100).default(0),
  notes: z.string().trim().max(2000).nullable().optional(),
  terms: z.string().trim().max(2000).nullable().optional(),
  items: z.array(LineItemSchema).min(1).max(60),
});

const IdSchema = z.object({ briefing_id: z.string().uuid() });
const TokenSchema = z.object({ token: z.string().min(16).max(128) });

/* ------------------------------------------------------- admin: draft + read */
export const saveInvoiceDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => DraftSchema.parse(i))
  .handler(async ({ data, context }) => {
    const S = await import("@/lib/invoice.server");
    await S.assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error: updErr } = await supabaseAdmin
      .from("briefing_submissions")
      .update({
        invoice_currency: data.currency,
        invoice_issue_date: data.issue_date ?? new Date().toISOString().slice(0, 10),
        invoice_due_date: data.due_date ?? null,
        invoice_discount_pct: data.discount_pct,
        invoice_tax_pct: data.tax_pct,
        invoice_tax_label: data.tax_label ?? null,
        invoice_deposit_pct: data.deposit_pct,
        invoice_notes: data.notes ?? null,
        invoice_terms: data.terms ?? null,
      })
      .eq("id", data.briefing_id);
    if (updErr) throw new Error(updErr.message);

    // Replace the item set atomically enough for a single-editor admin tool.
    const { error: delErr } = await supabaseAdmin
      .from("invoice_line_items")
      .delete()
      .eq("briefing_id", data.briefing_id);
    if (delErr) throw new Error(delErr.message);

    const { error: insErr } = await supabaseAdmin.from("invoice_line_items").insert(
      data.items.map((it, idx) => ({
        briefing_id: data.briefing_id,
        description: it.description,
        detail: it.detail ?? null,
        qty: it.qty,
        unit: it.unit,
        unit_price: it.unit_price,
        discount_pct: it.discount_pct,
        sort_order: idx,
      })),
    );
    if (insErr) throw new Error(insErr.message);

    const items = await S.loadItems(supabaseAdmin, data.briefing_id);
    const { data: brief } = await supabaseAdmin
      .from("briefing_submissions")
      .select("*")
      .eq("id", data.briefing_id)
      .single();
    return { ok: true, items, totals: S.totalsFor(brief, items) };
  });

export const getInvoiceDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => IdSchema.parse(i))
  .handler(async ({ data, context }) => {
    const S = await import("@/lib/invoice.server");
    await S.assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: brief, error } = await supabaseAdmin
      .from("briefing_submissions")
      .select("*")
      .eq("id", data.briefing_id)
      .single();
    if (error || !brief) throw new Error(error?.message || "Briefing not found");
    const items = await S.loadItems(supabaseAdmin, data.briefing_id);
    return {
      items,
      totals: S.totalsFor(brief, items),
      header: {
        currency: (brief.invoice_currency || "EUR").toUpperCase(),
        issue_date: brief.invoice_issue_date,
        due_date: brief.invoice_due_date,
        discount_pct: Number(brief.invoice_discount_pct ?? 0),
        tax_pct: Number(brief.invoice_tax_pct ?? 0),
        tax_label: brief.invoice_tax_label,
        deposit_pct: Number(brief.invoice_deposit_pct ?? 0),
        notes: brief.invoice_notes,
        terms: brief.invoice_terms,
        number: brief.invoice_number,
        status: brief.invoice_status ?? "draft",
        pdf_path: brief.invoice_pdf_path,
        token: brief.invoice_public_token,
        sent_at: brief.invoice_sent_at,
        viewed_at: brief.invoice_viewed_at,
        paid_at: brief.invoice_paid_at,
        reminder_count: brief.invoice_reminder_count ?? 0,
        payment_ref: brief.invoice_payment_ref,
        payment_method: brief.invoice_payment_method,
        payment_proof_path: brief.invoice_payment_proof_path,
        paid_reported_at: brief.invoice_paid_reported_at,
        suggested_amount: brief.exact_amount,
      },
    };
  });

/* ---------------------------------------------- admin: instant PDF (no save) */
export const renderInvoicePdfNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => DraftSchema.parse(i))
  .handler(async ({ data, context }) => {
    const S = await import("@/lib/invoice.server");
    await S.assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: brief, error } = await supabaseAdmin
      .from("briefing_submissions")
      .select("*")
      .eq("id", data.briefing_id)
      .single();
    if (error || !brief) throw new Error(error?.message || "Briefing not found");

    const branding = await S.loadBranding(supabaseAdmin);
    const draftBrief = {
      ...brief,
      invoice_currency: data.currency,
      invoice_issue_date: data.issue_date ?? new Date().toISOString().slice(0, 10),
      invoice_due_date: data.due_date ?? null,
      invoice_discount_pct: data.discount_pct,
      invoice_tax_pct: data.tax_pct,
      invoice_tax_label: data.tax_label ?? null,
      invoice_deposit_pct: data.deposit_pct,
      invoice_notes: data.notes ?? null,
      invoice_terms: data.terms ?? null,
    };
    const invoiceNumber = brief.invoice_number || "DRAFT";
    const bytes = await S.renderPdf({
      brief: draftBrief,
      items: data.items.map((it, idx) => ({ ...it, detail: it.detail ?? null, sort_order: idx })),
      branding,
      invoiceNumber,
      token: brief.invoice_public_token ?? null,
      status: brief.invoice_status ?? "draft",
    });
    return {
      filename: `${invoiceNumber}.pdf`,
      base64: S.toBase64(bytes),
      totals: S.totalsFor(draftBrief, data.items.map((it) => ({ ...it, detail: it.detail ?? null }))),
    };
  });

/* -------------------------------------------- admin: issue (number + upload) */
export const generateBriefingInvoice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => DraftSchema.parse(i))
  .handler(async ({ data, context }) => {
    const S = await import("@/lib/invoice.server");
    await S.assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Persist the draft first so PDF, DB and UI can never disagree.
    const { error: delErr } = await supabaseAdmin
      .from("invoice_line_items")
      .delete()
      .eq("briefing_id", data.briefing_id);
    if (delErr) throw new Error(delErr.message);
    const { error: insErr } = await supabaseAdmin.from("invoice_line_items").insert(
      data.items.map((it, idx) => ({
        briefing_id: data.briefing_id,
        description: it.description,
        detail: it.detail ?? null,
        qty: it.qty,
        unit: it.unit,
        unit_price: it.unit_price,
        discount_pct: it.discount_pct,
        sort_order: idx,
      })),
    );
    if (insErr) throw new Error(insErr.message);

    const { data: brief, error } = await supabaseAdmin
      .from("briefing_submissions")
      .select("*")
      .eq("id", data.briefing_id)
      .single();
    if (error || !brief) throw new Error(error?.message || "Briefing not found");

    const items = await S.loadItems(supabaseAdmin, data.briefing_id);
    const branding = await S.loadBranding(supabaseAdmin);

    // Sequential, gap-free numbering (atomic counter in Postgres).
    let invoiceNumber = brief.invoice_number as string | null;
    if (!invoiceNumber) {
      const { data: num, error: numErr } = await supabaseAdmin.rpc("next_invoice_number", { prefix: "EK" });
      if (numErr || !num) throw new Error(numErr?.message || "Could not allocate invoice number");
      invoiceNumber = num as string;
    }
    const token = brief.invoice_public_token || S.randomToken();
    const issueDate = data.issue_date ?? brief.invoice_issue_date ?? new Date().toISOString().slice(0, 10);

    const nextBrief = {
      ...brief,
      invoice_currency: data.currency,
      invoice_issue_date: issueDate,
      invoice_due_date: data.due_date ?? null,
      invoice_discount_pct: data.discount_pct,
      invoice_tax_pct: data.tax_pct,
      invoice_tax_label: data.tax_label ?? null,
      invoice_deposit_pct: data.deposit_pct,
      invoice_notes: data.notes ?? null,
      invoice_terms: data.terms ?? null,
    };
    const totals = S.totalsFor(nextBrief, items);

    const bytes = await S.renderPdf({
      brief: nextBrief,
      items,
      branding,
      invoiceNumber,
      token,
      status: brief.invoice_status === "paid" ? "paid" : "generated",
    });

    const pdfPath = `${brief.id}/${invoiceNumber}.pdf`;
    const { error: upErr } = await supabaseAdmin.storage
      .from(S.PDF_BUCKET)
      .upload(pdfPath, bytes, { contentType: "application/pdf", upsert: true });
    if (upErr) throw new Error(`Storage upload failed: ${upErr.message}`);

    const { error: updErr } = await supabaseAdmin
      .from("briefing_submissions")
      .update({
        invoice_number: invoiceNumber,
        invoice_currency: data.currency,
        invoice_issue_date: issueDate,
        invoice_due_date: data.due_date ?? null,
        invoice_discount_pct: data.discount_pct,
        invoice_tax_pct: data.tax_pct,
        invoice_tax_label: data.tax_label ?? null,
        invoice_deposit_pct: data.deposit_pct,
        invoice_notes: data.notes ?? null,
        invoice_terms: data.terms ?? null,
        invoice_subtotal: totals.subtotal,
        invoice_discount_amount: totals.discount_amount,
        invoice_tax_amount: totals.tax_amount,
        invoice_total: totals.total,
        invoice_deposit_amount: totals.deposit_amount,
        invoice_amount: totals.total,
        invoice_pdf_path: pdfPath,
        invoice_status: brief.invoice_status === "paid" ? "paid" : "generated",
        invoice_public_token: token,
        status: "accepted",
      })
      .eq("id", brief.id);
    if (updErr) throw new Error(updErr.message);

    await S.logEvent(supabaseAdmin, brief.id, "generated", context.userId, {
      invoice_number: invoiceNumber,
      total: totals.total,
      currency: data.currency,
    });

    return {
      ok: true,
      invoiceNumber,
      pdfPath,
      token,
      totals,
      base64: S.toBase64(bytes),
      filename: `${invoiceNumber}.pdf`,
      clientPortalUrl: `${S.siteOrigin()}/i/${token}`,
      pdfUrl: await S.signedUrl(supabaseAdmin, S.PDF_BUCKET, pdfPath),
    };
  });

/* --------------------------------------------------- admin: email preview */
export const previewInvoiceEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    IdSchema.extend({ variant: z.enum(["invoice", "reminder", "receipt"]).default("invoice") }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const S = await import("@/lib/invoice.server");
    await S.assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: brief, error } = await supabaseAdmin
      .from("briefing_submissions")
      .select("*")
      .eq("id", data.briefing_id)
      .single();
    if (error || !brief) throw new Error(error?.message || "Briefing not found");

    const branding = await S.loadBranding(supabaseAdmin);
    const items = await S.loadItems(supabaseAdmin, brief.id);
    const token = brief.invoice_public_token ?? "preview-token";
    const pdfUrl = brief.invoice_pdf_path
      ? await S.signedUrl(supabaseAdmin, S.PDF_BUCKET, brief.invoice_pdf_path)
      : "#generate-the-invoice-first";
    const portalUrl = `${S.siteOrigin()}/i/${token}`;
    const { subject, html } = S.buildInvoiceEmail({
      brief,
      branding,
      items,
      invoiceNumber: brief.invoice_number ?? "DRAFT",
      portalUrl,
      pdfUrl,
      variant: data.variant,
    });
    return { html, subject, to: [brief.email], cc: [S.adminEmail()], clientPortalUrl: portalUrl };
  });

/* ------------------------------------------------------- admin: send / remind */
const SendSchema = IdSchema.extend({
  to_override: z.array(z.string().email()).max(5).optional(),
  cc_override: z.array(z.string().email()).max(5).optional(),
  attach_pdf: z.boolean().default(true),
  variant: z.enum(["invoice", "reminder", "receipt"]).default("invoice"),
});

export const sendBriefingInvoice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => SendSchema.parse(i))
  .handler(async ({ data, context }) => {
    const S = await import("@/lib/invoice.server");
    await S.assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: brief, error } = await supabaseAdmin
      .from("briefing_submissions")
      .select("*")
      .eq("id", data.briefing_id)
      .single();
    if (error || !brief) throw new Error(error?.message || "Briefing not found");
    if (!brief.invoice_number || !brief.invoice_pdf_path) throw new Error("Issue the invoice first");

    const branding = await S.loadBranding(supabaseAdmin);
    const items = await S.loadItems(supabaseAdmin, brief.id);
    const pdfUrl = await S.signedUrl(supabaseAdmin, S.PDF_BUCKET, brief.invoice_pdf_path);
    const portalUrl = `${S.siteOrigin()}/i/${brief.invoice_public_token}`;
    const { subject, html } = S.buildInvoiceEmail({
      brief,
      branding,
      items,
      invoiceNumber: brief.invoice_number,
      portalUrl,
      pdfUrl,
      variant: data.variant,
    });

    let attachment: { filename: string; content: string } | undefined;
    if (data.attach_pdf) {
      const { data: file } = await supabaseAdmin.storage.from(S.PDF_BUCKET).download(brief.invoice_pdf_path);
      if (file) {
        attachment = {
          filename: `${brief.invoice_number}.pdf`,
          content: S.toBase64(new Uint8Array(await file.arrayBuffer())),
        };
      }
    }

    const to = data.to_override?.length ? data.to_override : [brief.email];
    const cc = data.cc_override?.length ? data.cc_override : [S.adminEmail()];
    const result = await S.sendMail({ to, cc, subject, html, attachment });

    if (data.variant === "reminder") {
      await supabaseAdmin
        .from("briefing_submissions")
        .update({
          invoice_reminder_count: Number(brief.invoice_reminder_count ?? 0) + 1,
          invoice_last_reminder_at: new Date().toISOString(),
        })
        .eq("id", brief.id);
    } else if (data.variant === "invoice") {
      await supabaseAdmin
        .from("briefing_submissions")
        .update({
          invoice_status: brief.invoice_status === "paid" ? "paid" : "sent",
          invoice_sent_at: new Date().toISOString(),
        })
        .eq("id", brief.id);
    }

    await S.logEvent(
      supabaseAdmin,
      brief.id,
      data.variant === "reminder" ? "reminder" : data.variant === "receipt" ? "receipt" : "sent",
      context.userId,
      {
        subject,
        attached: Boolean(attachment),
        delivery: result.skipped ? "no-provider-configured" : result.ok ? "delivered" : `error-${result.status}`,
      },
      [...to, ...cc],
    );

    return { ok: true, delivery: result };
  });

/* ------------------------------------------------------------ admin: status */
export const setInvoiceStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    IdSchema.extend({
      status: z.enum(["draft", "generated", "sent", "viewed", "paid", "void"]),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const S = await import("@/lib/invoice.server");
    await S.assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: { invoice_status: typeof data.status; invoice_paid_at?: string } = {
      invoice_status: data.status,
    };
    if (data.status === "paid") patch.invoice_paid_at = new Date().toISOString();
    const { error } = await supabaseAdmin
      .from("briefing_submissions")
      .update(patch)
      .eq("id", data.briefing_id);
    if (error) throw new Error(error.message);
    await S.logEvent(supabaseAdmin, data.briefing_id, `status:${data.status}`, context.userId);
    return { ok: true };
  });

export const listInvoiceEvents = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => IdSchema.parse(i))
  .handler(async ({ data, context }) => {
    const S = await import("@/lib/invoice.server");
    await S.assertAdmin(context);
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

/* --------------------------------------------------- admin: workspace / KPIs */
export const getInvoiceWorkspace = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const S = await import("@/lib/invoice.server");
    await S.assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("briefing_submissions")
      .select(
        "id, full_name, company_name, email, project_type, invoice_number, invoice_status, invoice_total, invoice_amount, invoice_currency, invoice_due_date, invoice_issue_date, invoice_sent_at, invoice_paid_at, invoice_viewed_at, invoice_deposit_amount, invoice_reminder_count, invoice_paid_reported_at, invoice_public_token",
      )
      .not("invoice_number", "is", null)
      .order("invoice_issue_date", { ascending: false, nullsFirst: false })
      .limit(300);
    if (error) throw new Error(error.message);

    const today = new Date().toISOString().slice(0, 10);
    const list = (rows ?? []).map((r) => {
      const total = Number(r.invoice_total ?? r.invoice_amount ?? 0);
      const overdue =
        r.invoice_status !== "paid" &&
        r.invoice_status !== "void" &&
        Boolean(r.invoice_due_date) &&
        String(r.invoice_due_date) < today;
      return { ...r, total, overdue };
    });

    const sum = (f: (r: (typeof list)[number]) => boolean) =>
      list.filter(f).reduce((a, r) => a + r.total, 0);

    return {
      invoices: list,
      kpis: {
        count: list.length,
        outstanding: sum((r) => r.invoice_status !== "paid" && r.invoice_status !== "void"),
        overdue: sum((r) => r.overdue),
        paid: sum((r) => r.invoice_status === "paid"),
        awaitingConfirmation: list.filter((r) => r.invoice_paid_reported_at && r.invoice_status !== "paid").length,
      },
    };
  });

/* ------------------------------------------------------------ public portal */
export const getPublicInvoice = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => TokenSchema.parse(i))
  .handler(async ({ data }) => {
    const S = await import("@/lib/invoice.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: brief, error } = await supabaseAdmin
      .from("briefing_submissions")
      .select("*")
      .eq("invoice_public_token", data.token)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!brief || !brief.invoice_pdf_path) throw new Error("Invoice not found");

    const branding = await S.loadBranding(supabaseAdmin);
    const items = await S.loadItems(supabaseAdmin, brief.id);
    const totals = S.totalsFor(brief, items);
    const pdfUrl = await S.signedUrl(supabaseAdmin, S.PDF_BUCKET, brief.invoice_pdf_path);

    if (!brief.invoice_viewed_at) {
      await supabaseAdmin
        .from("briefing_submissions")
        .update({
          invoice_viewed_at: new Date().toISOString(),
          invoice_status: brief.invoice_status === "sent" ? "viewed" : brief.invoice_status,
        })
        .eq("id", brief.id);
      await S.logEvent(supabaseAdmin, brief.id, "viewed", "public");
    }

    return {
      client: { name: brief.full_name, company: brief.company_name },
      invoice: {
        number: brief.invoice_number,
        currency: (brief.invoice_currency || "EUR").toUpperCase(),
        issue_date: brief.invoice_issue_date,
        due_date: brief.invoice_due_date,
        status: brief.invoice_status,
        sent_at: brief.invoice_sent_at,
        paid_at: brief.invoice_paid_at,
        paid_reported_at: brief.invoice_paid_reported_at,
        project_type: brief.project_type,
        notes: brief.invoice_notes,
        terms: brief.invoice_terms ?? branding.payment_terms ?? null,
        tax_label: brief.invoice_tax_label,
        tax_pct: Number(brief.invoice_tax_pct ?? 0),
        discount_pct: Number(brief.invoice_discount_pct ?? 0),
        deposit_pct: Number(brief.invoice_deposit_pct ?? 0),
        pdf_url: pdfUrl,
      },
      items: totals.lines.map((l) => ({
        description: l.description,
        detail: l.detail ?? null,
        qty: l.qty,
        unit: l.unit,
        unit_price: l.unit_price,
        discount_pct: l.discount_pct,
        net: l.net,
      })),
      totals: {
        subtotal: totals.subtotal,
        discount_amount: totals.discount_amount,
        tax_amount: totals.tax_amount,
        total: totals.total,
        deposit_amount: totals.deposit_amount,
        balance: totals.balance,
      },
      branding: {
        studio_name: branding.studio_name || "Edmundo Kutuzov",
        brand_color: branding.brand_color || "#7dd3fc",
        logo_url: branding.logo_url || null,
        header_label: branding.header_label || "PROFORMA INVOICE",
        footer_note: branding.footer_note || null,
        legal_text: branding.legal_text || null,
        studio_email: branding.studio_email || null,
      },
      payment: {
        bank_name: branding.bank_name || null,
        bank_account_name: branding.bank_account_name || null,
        bank_iban: branding.bank_iban || null,
        bank_swift: branding.bank_swift || null,
        mpesa_number: branding.mpesa_number || null,
        payment_terms: branding.payment_terms || null,
      },
    };
  });

/** Client-side proof upload: short-lived signed upload URL into a private bucket. */
export const createProofUploadUrl = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    TokenSchema.extend({
      filename: z.string().trim().min(1).max(120),
      content_type: z.enum(["image/png", "image/jpeg", "image/webp", "application/pdf"]),
    }).parse(i),
  )
  .handler(async ({ data }) => {
    const S = await import("@/lib/invoice.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: brief, error } = await supabaseAdmin
      .from("briefing_submissions")
      .select("id, invoice_number")
      .eq("invoice_public_token", data.token)
      .maybeSingle();
    if (error || !brief) throw new Error("Invoice not found");

    const ext = data.content_type === "application/pdf" ? "pdf" : data.content_type.split("/")[1];
    const path = `${brief.id}/${Date.now()}-proof.${ext}`;
    const { data: signed, error: sErr } = await supabaseAdmin.storage
      .from(S.PROOF_BUCKET)
      .createSignedUploadUrl(path);
    if (sErr || !signed) throw new Error(sErr?.message || "Could not prepare upload");
    return { path, token: signed.token, signedUrl: signed.signedUrl, bucket: S.PROOF_BUCKET };
  });

/** Client confirms they have paid; admin still verifies before marking paid. */
export const reportInvoicePayment = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    TokenSchema.extend({
      method: z.enum(["bank_transfer", "mpesa", "card", "other"]),
      reference: z.string().trim().max(120).nullable().optional(),
      proof_path: z.string().trim().max(300).nullable().optional(),
    }).parse(i),
  )
  .handler(async ({ data }) => {
    const S = await import("@/lib/invoice.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: brief, error } = await supabaseAdmin
      .from("briefing_submissions")
      .select("id, full_name, email, invoice_number, invoice_currency, invoice_total, invoice_public_token")
      .eq("invoice_public_token", data.token)
      .maybeSingle();
    if (error || !brief) throw new Error("Invoice not found");

    const { error: updErr } = await supabaseAdmin
      .from("briefing_submissions")
      .update({
        invoice_payment_method: data.method,
        invoice_payment_ref: data.reference ?? null,
        invoice_payment_proof_path: data.proof_path ?? null,
        invoice_paid_reported_at: new Date().toISOString(),
      })
      .eq("id", brief.id);
    if (updErr) throw new Error(updErr.message);

    await S.logEvent(supabaseAdmin, brief.id, "payment-reported", "public", {
      method: data.method,
      reference: data.reference ?? null,
      proof: Boolean(data.proof_path),
    });

    const branding = await S.loadBranding(supabaseAdmin);
    await S.sendMail({
      to: [S.adminEmail()],
      subject: `Payment reported — ${brief.invoice_number}`,
      html: `<div style="font-family:Inter,sans-serif">
        <h2>Payment reported</h2>
        <p><b>${S.esc(brief.full_name)}</b> reported payment for invoice <b>${S.esc(brief.invoice_number)}</b>
        (${S.esc(brief.invoice_currency)} ${S.esc(brief.invoice_total)}).</p>
        <p>Method: <b>${S.esc(data.method)}</b><br/>Reference: <b>${S.esc(data.reference ?? "—")}</b><br/>
        Proof attached in storage: <b>${S.esc(data.proof_path ?? "none")}</b></p>
        <p>Verify the funds, then mark the invoice as paid in the control room.</p>
        <p style="color:#64748b;font-size:12px">${S.esc(branding.studio_name ?? "")}</p>
      </div>`,
    });

    return { ok: true };
  });
