import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const RESEND_GATEWAY = "https://connector-gateway.lovable.dev/resend";

const Input = z.object({
  full_name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  company_name: z.string().trim().max(200).nullable().optional(),
  project_type: z.string().trim().max(120),
  urgency: z.string().trim().max(40),
  deadline: z.string().trim().max(40).nullable().optional(),
  currency: z.string().trim().max(8),
  budget_range: z.string().trim().max(80).nullable().optional(),
  exact_amount: z.union([z.number(), z.string()]).nullable().optional(),
  message: z.string().trim().min(1).max(4000),
  preferred_contact_method: z.string().trim().max(40).nullable().optional(),
  phone: z.string().trim().max(60).nullable().optional(),
  country: z.string().trim().max(120).nullable().optional(),
  reference_links: z
    .array(z.object({ url: z.string(), label: z.string().optional() }))
    .default([]),
  attachments: z
    .array(
      z.object({
        url: z.string(),
        name: z.string(),
        size: z.number().optional(),
      }),
    )
    .default([]),
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

export const sendBriefingEmails = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const FROM = process.env.BRIEFING_FROM ?? "Edmundo Kutuzov <onboarding@resend.dev>";
    const ADMIN =
      process.env.BRIEFING_ADMIN_EMAIL ??
      process.env.ADMIN_EMAIL ??
      "contact@edmundokutuzov.art";

    const firstName = data.full_name.split(" ")[0];

    // Client confirmation
    const clientHtml = shell(`
      <p style="font-family:monospace;letter-spacing:.18em;color:#7dd3fc;font-size:11px;margin:0 0 16px">BRIEF RECEIVED</p>
      <h1 style="font-size:28px;line-height:1.1;margin:0 0 18px;color:#f5f8ff">Thanks, ${esc(firstName)}.</h1>
      <p style="font-size:15px;line-height:1.7;color:#cbd5e1;margin:0 0 18px">
        Your briefing has landed. I read every submission personally and will get back to you within 48 hours with next steps.
      </p>
      <div style="border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px 20px;margin:20px 0">
        <p style="margin:0 0 8px;font-size:12px;color:#7dd3fc;font-family:monospace;letter-spacing:.18em">SUMMARY</p>
        <p style="margin:4px 0;font-size:14px;color:#e2e8f0"><b>Project:</b> ${esc(data.project_type)}</p>
        <p style="margin:4px 0;font-size:14px;color:#e2e8f0"><b>Urgency:</b> ${esc(data.urgency)}</p>
        ${data.budget_range ? `<p style="margin:4px 0;font-size:14px;color:#e2e8f0"><b>Budget:</b> ${esc(data.budget_range)} (${esc(data.currency)})</p>` : ""}
        ${data.deadline ? `<p style="margin:4px 0;font-size:14px;color:#e2e8f0"><b>Deadline:</b> ${esc(data.deadline)}</p>` : ""}
      </div>
      <p style="font-size:13px;line-height:1.7;color:#94a3b8;margin:16px 0 0">
        In the meantime, feel free to reply to this email if anything else comes to mind.
      </p>
    `);
    await send(FROM, [data.email], "Brief received — Edmundo Kutuzov", clientHtml);

    // Admin notification
    const refs = data.reference_links.map((l) => l.url).join("<br>");
    const atts = data.attachments
      .map((a) => `<a href="${esc(a.url)}" style="color:#7dd3fc">${esc(a.name)}</a>`)
      .join("<br>");
    const adminHtml = shell(`
      <p style="font-family:monospace;letter-spacing:.18em;color:#7dd3fc;font-size:11px;margin:0 0 16px">NEW BRIEFING</p>
      <h1 style="font-size:24px;line-height:1.15;margin:0 0 18px;color:#f5f8ff">${esc(data.full_name)}${data.company_name ? ` — ${esc(data.company_name)}` : ""}</h1>
      <div style="border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:18px 20px">
        <p style="margin:4px 0;font-size:14px"><b>Email:</b> <a href="mailto:${esc(data.email)}" style="color:#7dd3fc">${esc(data.email)}</a></p>
        ${data.phone ? `<p style="margin:4px 0;font-size:14px"><b>Phone:</b> ${esc(data.phone)}</p>` : ""}
        ${data.country ? `<p style="margin:4px 0;font-size:14px"><b>Country:</b> ${esc(data.country)}</p>` : ""}
        ${data.preferred_contact_method ? `<p style="margin:4px 0;font-size:14px"><b>Preferred contact:</b> ${esc(data.preferred_contact_method)}</p>` : ""}
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:12px 0"/>
        <p style="margin:4px 0;font-size:14px"><b>Project type:</b> ${esc(data.project_type)}</p>
        <p style="margin:4px 0;font-size:14px"><b>Urgency:</b> ${esc(data.urgency)}</p>
        ${data.deadline ? `<p style="margin:4px 0;font-size:14px"><b>Deadline:</b> ${esc(data.deadline)}</p>` : ""}
        ${data.budget_range ? `<p style="margin:4px 0;font-size:14px"><b>Budget:</b> ${esc(data.budget_range)} (${esc(data.currency)})</p>` : ""}
        ${data.exact_amount ? `<p style="margin:4px 0;font-size:14px"><b>Exact amount:</b> ${esc(data.exact_amount)} ${esc(data.currency)}</p>` : ""}
      </div>
      <div style="margin:20px 0">
        <p style="font-family:monospace;letter-spacing:.18em;color:#7dd3fc;font-size:11px;margin:0 0 8px">MESSAGE</p>
        <p style="font-size:14px;line-height:1.7;color:#e2e8f0;white-space:pre-wrap;margin:0">${esc(data.message)}</p>
      </div>
      ${refs ? `<div style="margin:20px 0"><p style="font-family:monospace;letter-spacing:.18em;color:#7dd3fc;font-size:11px;margin:0 0 8px">REFERENCES</p><p style="font-size:13px;color:#e2e8f0;word-break:break-all">${refs}</p></div>` : ""}
      ${atts ? `<div style="margin:20px 0"><p style="font-family:monospace;letter-spacing:.18em;color:#7dd3fc;font-size:11px;margin:0 0 8px">ATTACHMENTS</p><p style="font-size:13px">${atts}</p></div>` : ""}
    `);
    await send(FROM, [ADMIN], `New brief · ${data.full_name} · ${data.project_type}`, adminHtml);

    return { ok: true };
  });
