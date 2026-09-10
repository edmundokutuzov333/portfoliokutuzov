/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { getCorsHeaders, isCorsOriginAllowed } from "@/config/server";
import { getRequestId, logObservability } from "@/lib/observability";
import { supabaseAdmin } from "@/integrations/supabase/server/index.server";
import { createShareToken } from "@/lib/studio/identity";
import { sanitizePublicIdentityDesign } from "@/lib/studio/identity-format";
import { trackStudioEvent } from "@/lib/studio/analytics.server";

const WINDOW_MS = 5 * 60 * 1000; const MAX_REQUESTS = 6; const MAX_BODY_BYTES = 512 * 1024; const MAX_TEXT = 160; const MAX_WEBSITE = 500;
const rateLimits = new Map<string, { count: number; resetAt: number }>();
function response(request: Request, requestId: string, status: number, body: unknown, extra: Record<string, string> = {}) { return new Response(JSON.stringify(body), { status, headers: { ...getCorsHeaders(request), "X-Request-Id": requestId, "Content-Type": "application/json", "Cache-Control": "no-store", ...extra } }); }
function validEmail(value: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function clientKey(request: Request) { return (request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown").slice(0, 128); }
function checkRateLimit(key: string) { const now = Date.now(); const current = rateLimits.get(key); if (!current || current.resetAt <= now) { rateLimits.set(key, { count: 1, resetAt: now + WINDOW_MS }); return { allowed: true, retryAfter: 0 }; } if (current.count >= MAX_REQUESTS) return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) }; current.count += 1; return { allowed: true, retryAfter: 0 }; }

export const Route = createFileRoute("/api/studio/publish")({ server: { handlers: {
  POST: async ({ request }) => {
    const requestId = getRequestId(request); const startedAt = Date.now();
    if (!isCorsOriginAllowed(request)) return response(request, requestId, 403, { error: "ORIGIN_NOT_ALLOWED" });
    const length = Number(request.headers.get("content-length") || 0); if (!Number.isFinite(length) || length < 0 || length > MAX_BODY_BYTES) return response(request, requestId, 413, { error: "REQUEST_TOO_LARGE" });
    const rate = checkRateLimit(clientKey(request)); if (!rate.allowed) return response(request, requestId, 429, { error: "RATE_LIMITED" }, { "Retry-After": String(rate.retryAfter) });
    let body: any; try { body = await request.json(); } catch { return response(request, requestId, 400, { error: "INVALID_JSON" }); }
    const required = ["sessionId", "name", "role", "company", "email", "phone", "website"];
    if (!required.every((key) => typeof body?.[key] === "string") || !body?.design) return response(request, requestId, 400, { error: "INVALID_CARD" });
    if (body.design?.widthMm !== 90 || body.design?.heightMm !== 50 || !Array.isArray(body.design?.elements) || body.design.elements.length > 20) return response(request, requestId, 400, { error: "INVALID_DESIGN_DOCUMENT" });
    if (!validEmail(body.email.trim())) return response(request, requestId, 400, { error: "INVALID_EMAIL" });
    const shareToken = createShareToken();
    const row = { session_id: body.sessionId.trim().slice(0, 128), name: body.name.trim().slice(0, MAX_TEXT), role: body.role.trim().slice(0, MAX_TEXT), company: body.company.trim().slice(0, MAX_TEXT), email: body.email.trim().slice(0, 254), phone: body.phone.trim().slice(0, 80), website: body.website.trim().slice(0, MAX_WEBSITE), design_document: sanitizePublicIdentityDesign(body.design), status: "published", share_token: shareToken, public_enabled: true, published_at: new Date().toISOString() };
    const db = supabaseAdmin as any; const { data: created, error } = await db.from("studio_cards").insert(row).select("id").single();
    if (error) { void trackStudioEvent({ eventName: "card_published", sessionId: body.sessionId, metadata: { outcome: "failed" } }); logObservability("dependency_error", { requestId, route: "/api/studio/publish", dependency: "supabase", code: "STUDIO_PUBLISH_FAILED", message: error.message }); return response(request, requestId, 502, { error: "PUBLISH_FAILED" }); }
    void trackStudioEvent({ eventName: "card_published", sessionId: body.sessionId, cardId: created?.id ?? null, shareToken, durationMs: Date.now() - startedAt, metadata: { outcome: "success" } });
    logObservability("request_end", { requestId, route: "/api/studio/publish", method: "POST", status: 200, latencyMs: Date.now() - startedAt, dependency: "supabase" }); return response(request, requestId, 200, { token: shareToken });
  },
} } });
