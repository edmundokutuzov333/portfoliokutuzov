/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { getCorsHeaders, isCorsOriginAllowed } from "@/config/server";
import { getRequestId, logObservability } from "@/lib/observability";
import { supabaseAdmin } from "@/integrations/supabase/server/index.server";
import { createShareToken } from "@/lib/studio/identity";
import { sanitizePublicIdentityDesign } from "@/lib/studio/identity-format";
import { trackStudioEvent } from "@/lib/studio/analytics.server";

const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS = 6;
const MAX_BODY_BYTES = 512 * 1024;
const MAX_TEXT = 160;
const MAX_WEBSITE = 500;
const MAX_TOKEN = 128;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function response(request: Request, requestId: string, status: number, body: unknown, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...getCorsHeaders(request), "X-Request-Id": requestId, "Content-Type": "application/json", "Cache-Control": "no-store", ...extra } });
}
function validEmail(value: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function text(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
function clientKey(request: Request) { return (request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown").slice(0, 128); }
function checkRateLimit(key: string) {
  const now = Date.now();
  for (const [entryKey, entry] of rateLimits) if (entry.resetAt <= now) rateLimits.delete(entryKey);
  const current = rateLimits.get(key);
  if (!current) { rateLimits.set(key, { count: 1, resetAt: now + WINDOW_MS }); return { allowed: true, retryAfter: 0 }; }
  if (current.count >= MAX_REQUESTS) return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export const Route = createFileRoute("/api/studio/publish")({ server: { handlers: {
  POST: async ({ request }) => {
    const requestId = getRequestId(request); const startedAt = Date.now();
    if (!isCorsOriginAllowed(request)) return response(request, requestId, 403, { error: "ORIGIN_NOT_ALLOWED" });
    const length = Number(request.headers.get("content-length") || 0);
    if (!Number.isFinite(length) || length < 0 || length > MAX_BODY_BYTES) return response(request, requestId, 413, { error: "REQUEST_TOO_LARGE" });
    const rate = checkRateLimit(clientKey(request));
    if (!rate.allowed) return response(request, requestId, 429, { error: "RATE_LIMITED" }, { "Retry-After": String(rate.retryAfter) });
    let body: any;
    try { body = await request.json(); } catch { return response(request, requestId, 400, { error: "INVALID_JSON" }); }

    const sessionId = text(body?.sessionId, 128);
    const draftToken = text(body?.draftToken, MAX_TOKEN);
    const cardId = text(body?.cardId, 64);
    const name = text(body?.name, MAX_TEXT);
    const role = text(body?.role, MAX_TEXT);
    const company = text(body?.company, MAX_TEXT);
    const email = text(body?.email, 254);
    const phone = text(body?.phone, 80);
    const website = text(body?.website, MAX_WEBSITE);
    if (sessionId.length < 20) return response(request, requestId, 400, { error: "INVALID_SESSION" });
    if (!validEmail(email)) return response(request, requestId, 400, { error: "INVALID_EMAIL" });
    if (!body?.design || body.design?.version !== 1 || body.design?.widthMm !== 90 || body.design?.heightMm !== 50 || !Array.isArray(body.design?.elements) || body.design.elements.length > 20) return response(request, requestId, 400, { error: "INVALID_DESIGN_DOCUMENT" });

    const shareToken = createShareToken();
    const now = new Date().toISOString();
    const row = {
      session_id: sessionId,
      name,
      role,
      company,
      email,
      phone,
      website,
      design_document: sanitizePublicIdentityDesign(body.design),
      status: "published",
      share_token: shareToken,
      public_enabled: true,
      published_at: now,
      last_saved_at: now,
    };
    const db = supabaseAdmin as any;
    let created: any = null;
    let error: any = null;

    if (draftToken) {
      const current = await db.from("studio_cards").select("id,revision").eq("draft_token", draftToken).maybeSingle();
      if (current.error) {
        logObservability("dependency_error", { requestId, route: "/api/studio/publish", dependency: "supabase", code: "STUDIO_DRAFT_LOOKUP_FAILED", message: current.error.message });
        return response(request, requestId, 502, { error: "PUBLISH_FAILED" });
      }
      if (!current.data) return response(request, requestId, 404, { error: "DRAFT_NOT_FOUND" });
      if (cardId && cardId !== current.data.id) return response(request, requestId, 409, { error: "DRAFT_CARD_MISMATCH" });
      const nextRevision = Number(current.data.revision || 1) + 1;
      const result = await db.from("studio_cards").update({ ...row, revision: nextRevision }).eq("draft_token", draftToken).eq("revision", current.data.revision).select("id").maybeSingle();
      created = result.data;
      error = result.error;
      if (!created && !error) return response(request, requestId, 409, { error: "REVISION_CONFLICT" });
    } else {
      const result = await db.from("studio_cards").insert({ ...row, revision: 1, draft_token: null }).select("id").single();
      created = result.data;
      error = result.error;
    }

    if (error) {
      void trackStudioEvent({ eventName: "card_published", sessionId, metadata: { outcome: "failed" } });
      logObservability("dependency_error", { requestId, route: "/api/studio/publish", dependency: "supabase", code: "STUDIO_PUBLISH_FAILED", message: error.message });
      return response(request, requestId, 502, { error: "PUBLISH_FAILED" });
    }

    void trackStudioEvent({ eventName: "card_published", sessionId, cardId: created?.id ?? null, shareToken, durationMs: Date.now() - startedAt, metadata: { outcome: "success", persisted_draft: Boolean(draftToken) } });
    logObservability("request_end", { requestId, route: "/api/studio/publish", method: "POST", status: 200, latencyMs: Date.now() - startedAt, dependency: "supabase" });
    return response(request, requestId, 200, { token: shareToken, cardId: created?.id ?? null });
  },
} } });
