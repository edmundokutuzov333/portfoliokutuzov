import { createFileRoute } from "@tanstack/react-router";
import { getCorsHeaders, isCorsOriginAllowed } from "@/config/server";
import { getRequestId, logObservability } from "@/lib/observability";
import { trackStudioEvent } from "@/lib/studio/analytics.server";

const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_BODY_BYTES = 18 * 1024 * 1024;
const MAX_ATTACHMENT_BYTES = 6 * 1024 * 1024;
const MAX_PROVIDER_ATTEMPTS = 3;
const MAX_RATE_LIMIT_KEYS = 10_000;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function env(name: string) { return process.env[name]?.trim(); }
function isEmail(value: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function cleanText(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
function clientKey(request: Request) { return (request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown").slice(0, 128); }
function checkRateLimit(key: string) {
  const now = Date.now();
  for (const [entryKey, entry] of rateLimits) if (entry.resetAt <= now) rateLimits.delete(entryKey);
  const current = rateLimits.get(key);
  if (!current || current.resetAt <= now) {
    if (!rateLimits.has(key) && rateLimits.size >= MAX_RATE_LIMIT_KEYS) rateLimits.delete(rateLimits.keys().next().value!);
    rateLimits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  if (current.count >= MAX_REQUESTS) return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}
function decodeDataUrl(value: string, mime: string) {
  const match = value.match(/^data:([^;]+);base64,([A-Za-z0-9+/]+={0,2})$/s);
  if (!match || match[1].toLowerCase() !== mime.toLowerCase()) return null;
  const payload = match[2];
  if (payload.length % 4 !== 0) return null;
  const bytes = Buffer.from(payload, "base64");
  const canonical = bytes.toString("base64").replace(/=+$/, "");
  if (canonical !== payload.replace(/=+$/, "")) return null;
  return bytes.length <= MAX_ATTACHMENT_BYTES ? bytes.toString("base64") : null;
}
function safeHtmlText(value: string) { return value.replace(/[<>&"']/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" })[char]!); }
function safeFilename(value: string) { return (value.replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "") || "contact").slice(0, 80).toLowerCase(); }
function jsonResponse(request: Request, requestId: string, status: number, body: unknown, extra: Record<string, string> = {}) { return new Response(JSON.stringify(body), { status, headers: { ...getCorsHeaders(request), "X-Request-Id": requestId, "Content-Type": "application/json", "Cache-Control": "no-store", ...extra } }); }

async function sendWithRetry(apiKey: string, payload: Record<string, unknown>, idempotencyKey: string) {
  let lastResponse: Response | null = null;
  for (let attempt = 1; attempt <= MAX_PROVIDER_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
        body: JSON.stringify(payload),
      });
      lastResponse = response;
      if (response.ok) return response;
      if (response.status < 500 && response.status !== 429) return response;
    } catch {
      lastResponse = null;
    }
    if (attempt < MAX_PROVIDER_ATTEMPTS) await new Promise((resolve) => setTimeout(resolve, 150 * 2 ** (attempt - 1)));
  }
  return lastResponse;
}

export const Route = createFileRoute("/api/studio/email")({
  server: { handlers: { POST: async ({ request }) => {
    const requestId = getRequestId(request);
    const startedAt = Date.now();
    if (!isCorsOriginAllowed(request)) return jsonResponse(request, requestId, 403, { error: "ORIGIN_NOT_ALLOWED" });
    const length = Number(request.headers.get("content-length") || 0);
    if (!Number.isFinite(length) || length < 0 || length > MAX_BODY_BYTES) return jsonResponse(request, requestId, 413, { error: "REQUEST_TOO_LARGE" });
    const rate = checkRateLimit(clientKey(request));
    if (!rate.allowed) return jsonResponse(request, requestId, 429, { error: "RATE_LIMITED" }, { "Retry-After": String(rate.retryAfter) });
    const apiKey = env("RESEND_API_KEY");
    const from = env("STUDIO_EMAIL_FROM");
    if (!apiKey || !from) return jsonResponse(request, requestId, 503, { error: "EMAIL_NOT_CONFIGURED" });
    let body: any;
    try { body = await request.json(); } catch { return jsonResponse(request, requestId, 400, { error: "INVALID_JSON" }); }
    const to = cleanText(body.to, 254); const digitalUrl = cleanText(body.digitalUrl, 2000); const name = cleanText(body.name, 160) || "Digital business card"; const vcard = cleanText(body.vcard, 12000);
    if (!isEmail(to) || !/^https?:\/\//i.test(digitalUrl) || !vcard.startsWith("BEGIN:VCARD") || !vcard.endsWith("END:VCARD\r\n")) return jsonResponse(request, requestId, 400, { error: "INVALID_EMAIL_PAYLOAD" });
    void trackStudioEvent({ eventName: "email_started", metadata: { has_png: Boolean(body.pngDataUrl), has_pdf: Boolean(body.pdfDataUrl) } });
    const filename = safeFilename(name);
    const attachments: Array<{ filename: string; content: string; content_type: string }> = [{ filename: `${filename}.vcf`, content: Buffer.from(vcard, "utf8").toString("base64"), content_type: "text/vcard" }];
    const png = typeof body.pngDataUrl === "string" ? decodeDataUrl(body.pngDataUrl, "image/png") : null;
    const pdf = typeof body.pdfDataUrl === "string" ? decodeDataUrl(body.pdfDataUrl, "application/pdf") : null;
    if (body.pngDataUrl && !png) return jsonResponse(request, requestId, 413, { error: "PNG_TOO_LARGE_OR_INVALID" });
    if (body.pdfDataUrl && !pdf) return jsonResponse(request, requestId, 413, { error: "PDF_TOO_LARGE_OR_INVALID" });
    if (png) attachments.push({ filename: "business-card.png", content: png, content_type: "image/png" });
    if (pdf) attachments.push({ filename: "business-card.pdf", content: pdf, content_type: "application/pdf" });
    const displayName = safeHtmlText(name); const safeUrl = digitalUrl.replace(/[\"']/g, (char) => char === '"' ? "&quot;" : "&#39;");
    const html = `<div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:0 auto;color:#111"><p style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#64748b">Kutuzov Studio / Digital Identity</p><h1 style="font-size:28px;margin:16px 0 8px">${displayName}</h1><p style="color:#475569">Your digital business card is ready.</p><p><a href="${safeUrl}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#0284c7;color:#fff;text-decoration:none;font-weight:700">Open digital card</a></p><p style="font-size:12px;color:#64748b">The email includes your vCard plus the available PNG and PDF exports.</p></div>`;
    const text = `Kutuzov Studio / Digital Identity\n\n${name}\n\nOpen your digital card: ${digitalUrl}\n\nAttachments: vCard${png ? ", PNG" : ""}${pdf ? ", PDF" : ""}.`;
    const providerPayload = { from, to: [to], subject: `${name} · Digital business card`, html, text, attachments };
    const res = await sendWithRetry(apiKey, providerPayload, `studio-email/${requestId}`);
    if (!res?.ok) {
      const detail = res ? await res.text().catch(() => "") : "network_error";
      void trackStudioEvent({ eventName: "email_failed", durationMs: Date.now() - startedAt, metadata: { provider: "resend" } });
      logObservability("dependency_error", { requestId, route: "/api/studio/email", dependency: "resend", code: "STUDIO_EMAIL_FAILED", message: detail.slice(0, 300) });
      return jsonResponse(request, requestId, 502, { error: "EMAIL_DELIVERY_FAILED" });
    }
    void trackStudioEvent({ eventName: "email_sent", durationMs: Date.now() - startedAt, metadata: { provider: "resend", attachment_count: attachments.length } });
    logObservability("request_end", { requestId, route: "/api/studio/email", method: "POST", status: 200, dependency: "resend", latencyMs: Date.now() - startedAt }); return jsonResponse(request, requestId, 200, { sent: true });
  } } },
});
