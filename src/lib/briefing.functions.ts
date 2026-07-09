import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const RESEND_GATEWAY = "https://connector-gateway.lovable.dev/resend";

// Only accept an opaque briefing id. All email content is derived server-side
// from the corresponding briefing_submissions row via the service-role client,
// so this endpoint cannot be abused as an open email relay: an attacker cannot
// choose the recipient, sender, subject, or HTML body.
const Input = z.object({
  briefing_id: z.string().uuid(),
});

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

function shell(inner: string) {
  return `<div style="font-family:-apple-system,Segoe UI,Inter,sans-serif;background:#01040A;color:#e2e8f0;padding:32px">${inner}<p style="font-size:12px;color:#64748b;margin:32px 0 0">— Edmundo Kutuzov — Art Director</p></div>`;
}

async function send(from: string, to: string[], subject: string, html: string) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  if (!lovableKey || !resendKey) return;
  try {
    await fetch(`${RESEND_GATEWAY}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
  } catch {
    /* best-effort */
  }
}

type RefLink = { url: string; label?: string };
type Attachment = { url: string; name: string; size?: number };

export const sendBriefingEmails = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    // Load the submission server-side; only rows created via the (RLS-protected)
    // insert path can trigger emails, and their content — including the
    // recipient — cannot be tampered with by the caller.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: brief, error } = await supabaseAdmin
      .from("briefing_submissions")
      .select(
        "id, full_name, email, company_name, project_type, urgency, deadline, currency, budget_range, exact_amount, message, preferred_contact_method, phone, country, reference_links, attachments, confirmation_sent_at",
      )
      .eq("id", data.briefing_id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!brief) throw new Error("Briefing not found");

    // Idempotency: never send a second confirmation for the same row.
    if (brief.confirmation_sent_at) {
      return { ok: true, skipped: "already-sent" as const };
    }

    const FROM = process.env.BRIEFING_FROM ?? "Edmundo Kutuzov <onboarding@resend.dev>";
    const ADMIN =
      process.env.BRIEFING_ADMIN_EMAIL ??
      process.env.ADMIN_EMAIL ??
      "contact@edmundokutuzov.art";

    const firstName = (brief.full_name ?? "").split(" ")[0] || "there";
    const refLinks = (Array.isArray(brief.reference_links) ? brief.reference_links : []) as RefLink[];
    const attachments = (Array.isArray(brief.attachments) ? brief.attachments : []) as Attachment[];

    // Client confirmation
    const clientHtml = shell(`
      <p style="font-family:monospace;letter-spacing:.18em;color:#7dd3fc;font-size:11px;margin:0 0 16px">BRIEF RECEIVED</p>
      <h1 style="font-size:28px;line-height:1.1;margin:0 0 18px;color:#f5f8ff">Thanks, ${esc(firstName)}.</h1>
      <p style="font-size:15px;line-height:1.7;color:#cbd5e1;margin:0 0 18px">
        Your briefing has landed. I read every submission personally and will get back to you within 48 hours with next steps.
      </p>
      <div style="border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px 20px;margin:20px 0">
        <p style="margin:0 0 8px;font-size:12px;color:#7dd3fc;font-family:monospace;letter-spacing:.18em">SUMMARY</p>
        <p style="margin:4px 0;font-size:14px;color:#e2e8f0"><b>Project:</b> ${esc(brief.project_type)}</p>
        <p style="margin:4px 0;font-size:14px;color:#e2e8f0"><b>Urgency:</b> ${esc(brief.urgency)}</p>
        ${brief.budget_range ? `<p style="margin:4px 0;font-size:14px;color:#e2e8f0"><b>Budget:</b> ${esc(brief.budget_range)} (${esc(brief.currency)})</p>` : ""}
        ${brief.deadline ? `<p style="margin:4px 0;font-size:14px;color:#e2e8f0"><b>Deadline:</b> ${esc(brief.deadline)}</p>` : ""}
      </div>
      <p style="font-size:13px;line-height:1.7;color:#94a3b8;margin:16px 0 0">
        In the meantime, feel free to reply to this email if anything else comes to mind.
      </p>
    `);
    await send(FROM, [brief.email], "Brief received — Edmundo Kutuzov", clientHtml);

    // Admin notification
    const refs = refLinks.map((l) => esc(l.url)).join("<br>");
    const atts = attachments
      .map((a) => `<a href="${esc(a.url)}" style="color:#7dd3fc">${esc(a.name)}</a>`)
      .join("<br>");
    const adminHtml = shell(`
      <p style="font-family:monospace;letter-spacing:.18em;color:#7dd3fc;font-size:11px;margin:0 0 16px">NEW BRIEFING</p>
      <h1 style="font-size:24px;line-height:1.15;margin:0 0 18px;color:#f5f8ff">${esc(brief.full_name)}${brief.company_name ? ` — ${esc(brief.company_name)}` : ""}</h1>
      <div style="border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:18px 20px">
        <p style="margin:4px 0;font-size:14px"><b>Email:</b> <a href="mailto:${esc(brief.email)}" style="color:#7dd3fc">${esc(brief.email)}</a></p>
        ${brief.phone ? `<p style="margin:4px 0;font-size:14px"><b>Phone:</b> ${esc(brief.phone)}</p>` : ""}
        ${brief.country ? `<p style="margin:4px 0;font-size:14px"><b>Country:</b> ${esc(brief.country)}</p>` : ""}
        ${brief.preferred_contact_method ? `<p style="margin:4px 0;font-size:14px"><b>Preferred contact:</b> ${esc(brief.preferred_contact_method)}</p>` : ""}
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:12px 0"/>
        <p style="margin:4px 0;font-size:14px"><b>Project type:</b> ${esc(brief.project_type)}</p>
        <p style="margin:4px 0;font-size:14px"><b>Urgency:</b> ${esc(brief.urgency)}</p>
        ${brief.deadline ? `<p style="margin:4px 0;font-size:14px"><b>Deadline:</b> ${esc(brief.deadline)}</p>` : ""}
        ${brief.budget_range ? `<p style="margin:4px 0;font-size:14px"><b>Budget:</b> ${esc(brief.budget_range)} (${esc(brief.currency)})</p>` : ""}
        ${brief.exact_amount ? `<p style="margin:4px 0;font-size:14px"><b>Exact amount:</b> ${esc(String(brief.exact_amount))} ${esc(brief.currency)}</p>` : ""}
      </div>
      <div style="margin:20px 0">
        <p style="font-family:monospace;letter-spacing:.18em;color:#7dd3fc;font-size:11px;margin:0 0 8px">MESSAGE</p>
        <p style="font-size:14px;line-height:1.7;color:#e2e8f0;white-space:pre-wrap;margin:0">${esc(brief.message)}</p>
      </div>
      ${refs ? `<div style="margin:20px 0"><p style="font-family:monospace;letter-spacing:.18em;color:#7dd3fc;font-size:11px;margin:0 0 8px">REFERENCES</p><p style="font-size:13px;color:#e2e8f0;word-break:break-all">${refs}</p></div>` : ""}
      ${atts ? `<div style="margin:20px 0"><p style="font-family:monospace;letter-spacing:.18em;color:#7dd3fc;font-size:11px;margin:0 0 8px">ATTACHMENTS</p><p style="font-size:13px">${atts}</p></div>` : ""}
    `);
    await send(FROM, [ADMIN], `New brief · ${brief.full_name} · ${brief.project_type}`, adminHtml);

    // Mark the row so we don't ever re-send.
    await supabaseAdmin
      .from("briefing_submissions")
      .update({ confirmation_sent_at: new Date().toISOString() })
      .eq("id", brief.id);

    return { ok: true };
  });
