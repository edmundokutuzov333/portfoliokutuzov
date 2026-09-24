import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { briefingSchema, type BriefingAttachment, type BriefReferenceLink } from "@/lib/contact-schema";
import { getRequestId } from "@/lib/observability";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 900_000;
const MAX_HONEYPOT = 180;
const RESEND_URL = "https://api.resend.com/emails";

const submitSchema = z.object({
  briefing: briefingSchema,
  source_case_slug: z.string().trim().max(160).nullable().optional(),
  attachments: z
    .array(
      z.object({
        url: z.string().url().max(2000),
        name: z.string().trim().max(180),
        size: z.number().int().min(0).max(8 * 1024 * 1024),
        width: z.number().int().positive().max(12000).optional(),
        height: z.number().int().positive().max(12000).optional(),
      }),
    )
    .max(5)
    .default([]),
  reference_links: z
    .array(
      z.object({
        url: z.string().url().max(2000),
        label: z.string().trim().max(160).optional(),
      }),
    )
    .max(12)
    .default([]),
  honeypot: z.string().max(MAX_HONEYPOT).default(""),
  locale: z.enum(["en", "pt"]).default("en"),
});

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function cleanIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return (forwarded?.split(",")[0]?.trim() || realIp || "unknown").slice(0, 128);
}

async function hashKey(value: string) {
  const salt = process.env.CONTACT_RATE_LIMIT_SALT?.trim() || "phase11-contact-rate-limit";
  const encoded = new TextEncoder().encode(value + ":" + salt);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function response(
  request: Request,
  requestId: string,
  status: number,
  body: unknown,
  extra: Record<string, string> = {},
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Request-Id": requestId,
      ...extra,
    },
  });
}

function emailCopy(locale: "en" | "pt", firstName: string, projectType: string, responseHours: string) {
  if (locale === "pt") {
    return {
      subject: "Pedido recebido — Edmundo Kutuzov",
      eyebrow: "PEDIDO RECEBIDO",
      heading: "Obrigado, " + firstName + ".",
      body:
        "O seu pedido foi recebido. Vou rever pessoalmente o briefing e responder em " +
        responseHours +
        " horas com os próximos passos.",
      project: "Projeto",
    };
  }

  return {
    subject: "Brief received — Edmundo Kutuzov",
    eyebrow: "BRIEF RECEIVED",
    heading: "Thanks, " + firstName + ".",
    body:
      "Your project brief has landed. I will review it personally and reply within " +
      responseHours +
      " hours with next steps.",
    project: "Project",
  };
}

async function sendResendEmail(to: string[], subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.BRIEFING_FROM?.trim();
  if (!apiKey || !from) return { sent: false as const, reason: "provider_not_configured" as const };

  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    return {
      sent: false as const,
      reason: "provider_rejected" as const,
      status: res.status,
    };
  }

  const data = (await res.json()) as { id?: string };
  return { sent: true as const, id: data.id ?? null };
}

function shell(inner: string) {
  return (
    '<div style="font-family:Arial,Helvetica,sans-serif;background:#D6D4CE;color:#000;padding:32px">' +
    inner +
    '<p style="font-size:12px;color:#3F3E3B;margin:32px 0 0">Edmundo Kutuzov · Art Director</p></div>'
  );
}

export const Route = createFileRoute("/api/contact/submit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const requestId = getRequestId(request);

        const contentLength = Number(request.headers.get("content-length") || 0);
        if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
          return response(request, requestId, 413, { error: "REQUEST_TOO_LARGE" });
        }

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return response(request, requestId, 400, { error: "INVALID_JSON" });
        }

        const parsed = submitSchema.safeParse(raw);
        if (!parsed.success) {
          return response(request, requestId, 422, {
            error: "VALIDATION_FAILED",
            issues: parsed.error.issues,
          });
        }

        if (parsed.data.honeypot.trim()) {
          return response(request, requestId, 200, {
            ok: true,
            accepted: false,
            ignored: "honeypot",
          });
        }

        const rateKey = await hashKey(cleanIp(request));
        const { data: rate, error: rateError } = await supabaseAdmin.rpc(
          "check_contact_rate_limit",
          {
            p_key: rateKey,
            p_window_seconds: 900,
            p_max_requests: 5,
          },
        );

        if (rateError) {
          return response(request, requestId, 503, {
            error: "RATE_LIMIT_PROVIDER_UNAVAILABLE",
          });
        }

        const rateRow = Array.isArray(rate) ? rate[0] : rate;
        if (!rateRow?.allowed) {
          return response(
            request,
            requestId,
            429,
            { error: "RATE_LIMITED" },
            {
              "Retry-After": String(rateRow?.retry_after_seconds ?? 900),
            },
          );
        }

        const body = parsed.data;
        const fullName = body.briefing.full_name.trim();
        const firstName = fullName.split(/\s+/)[0] || "there";
        const landingPage = new URL(request.url).origin + "/contact";

        const { data: inserted, error: insertError } = await supabaseAdmin
          .from("briefing_submissions")
          .insert({
            ...body.briefing,
            source_case_slug: body.source_case_slug || null,
            attachments: body.attachments as BriefingAttachment[],
            reference_links: body.reference_links as BriefReferenceLink[],
            source: "website",
            user_agent: request.headers.get("user-agent")?.slice(0, 240) || null,
            landing_page: landingPage,
          })
          .select("id,created_at")
          .single();

        if (insertError || !inserted) {
          return response(request, requestId, 500, {
            error: "SUBMISSION_FAILED",
            message: insertError?.message || "Unable to save the briefing.",
          });
        }

        const responseHours = process.env.CONTACT_RESPONSE_HOURS?.trim() || "48";
        const copy = emailCopy(body.locale, firstName, body.briefing.project_type, responseHours);
        const confirmationHtml = shell(
          '<p style="font-size:12px;letter-spacing:.12em;color:#3F3E3B;margin:0 0 16px">' +
            escapeHtml(copy.eyebrow) +
            '</p><h1 style="font-size:32px;line-height:1.05;margin:0 0 18px">' +
            escapeHtml(copy.heading) +
            '</h1><p style="font-size:15px;line-height:1.7;margin:0 0 18px">' +
            escapeHtml(copy.body) +
            '</p><p style="font-size:14px;margin:0"><strong>' +
            escapeHtml(copy.project) +
            ":</strong> " +
            escapeHtml(body.briefing.project_type) +
            "</p>",
        );

        const adminEmail = process.env.BRIEFING_ADMIN_EMAIL?.trim() || process.env.ADMIN_EMAIL?.trim();
        const adminHtml = shell(
          '<p style="font-size:12px;letter-spacing:.12em;color:#3F3E3B;margin:0 0 16px">NEW CONTACT LEAD</p>' +
            '<h1 style="font-size:28px;line-height:1.05;margin:0 0 18px">' +
            escapeHtml(fullName) +
            (body.briefing.company_name ? " · " + escapeHtml(body.briefing.company_name) : "") +
            "</h1>" +
            '<p style="font-size:14px;line-height:1.7;margin:0"><strong>Email:</strong> ' +
            escapeHtml(body.briefing.email) +
            "</p>" +
            '<p style="font-size:14px;line-height:1.7;margin:0"><strong>Project:</strong> ' +
            escapeHtml(body.briefing.project_type) +
            "</p>" +
            '<p style="font-size:14px;line-height:1.7;margin:0"><strong>Urgency:</strong> ' +
            escapeHtml(body.briefing.urgency) +
            "</p>" +
            '<p style="font-size:14px;line-height:1.7;margin:0"><strong>Admin:</strong> <a href="' +
            escapeHtml(new URL(request.url).origin + "/admin") +
            '">Open Control Room</a></p>',
        );

        const clientSend = await sendResendEmail([body.briefing.email], copy.subject, confirmationHtml);
        const adminSend = adminEmail
          ? await sendResendEmail([adminEmail], "New contact lead · " + fullName, adminHtml)
          : { sent: false as const, reason: "admin_recipient_missing" as const };

        return response(request, requestId, 200, {
          ok: true,
          accepted: true,
          briefing_id: inserted.id,
          created_at: inserted.created_at,
          email: {
            confirmation: clientSend,
            internal: adminSend,
          },
        });
      },
    },
  },
});
