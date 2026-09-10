import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { getCorsHeaders, isCorsOriginAllowed } from "@/config/server";
import { publicConfig } from "@/config/public";
import { getRequestId } from "@/lib/observability";
import { supabaseAdmin } from "@/integrations/supabase/server/index.server";
import { trackStudioEvent } from "@/lib/studio/analytics.server";

const PUBLIC_EVENTS = new Set([
  "studio_opened",
  "card_draft_created",
  "card_saved",
  "export_started",
  "export_completed",
  "export_failed",
  "digital_card_view",
  "digital_card_share",
  "digital_card_save_contact",
  "digital_card_email_click",
  "digital_card_phone_click",
  "digital_card_website_click",
] as const);
const WINDOW_MS = 5 * 60 * 1000;
const MAX_EVENTS = 80;
const MAX_BODY_BYTES = 16 * 1024;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

type PublicEvent = (typeof PUBLIC_EVENTS)[number];
function headers(request: Request, requestId: string, extra: Record<string, string> = {}) { return { ...getCorsHeaders(request), "X-Request-Id": requestId, ...extra }; }
function clientKey(request: Request) { return (request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown").slice(0, 128); }
function checkRateLimit(key: string) { const now = Date.now(); const current = rateLimits.get(key); if (!current || current.resetAt <= now) { rateLimits.set(key, { count: 1, resetAt: now + WINDOW_MS }); return { allowed: true, retryAfter: 0 }; } if (current.count >= MAX_EVENTS) return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) }; current.count += 1; return { allowed: true, retryAfter: 0 }; }
function json(request: Request, requestId: string, status: number, payload: unknown, extra: Record<string, string> = {}) { return new Response(JSON.stringify(payload), { status, headers: headers(request, requestId, { "Content-Type": "application/json", "Cache-Control": "no-store", ...extra }) }); }
function bearer(request: Request) { const value = request.headers.get("authorization") || ""; return value.startsWith("Bearer ") ? value.slice(7).trim() : ""; }
async function authenticatedAdmin(request: Request) {
  const token = bearer(request); if (!token) return { ok: false as const, status: 401, message: "Unauthorized" };
  const url = process.env.SUPABASE_URL || publicConfig.supabase.url; const key = process.env.SUPABASE_PUBLISHABLE_KEY || publicConfig.supabase.publishableKey;
  if (!url || !key) return { ok: false as const, status: 500, message: "Supabase is not configured" };
  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, storage: undefined }, global: { headers: { Authorization: `Bearer ${token}` } } });
  const claims = await client.auth.getClaims(token); if (claims.error || !claims.data?.claims?.sub) return { ok: false as const, status: 401, message: "Invalid token" };
  const admin = await client.rpc("is_admin"); if (admin.error || !admin.data) return { ok: false as const, status: 403, message: "Admin access required" };
  return { ok: true as const, client };
}

export const Route = createFileRoute("/api/studio/admin")({
  server: { handlers: {
    OPTIONS: async ({ request }) => { const requestId = getRequestId(request); return new Response(null, { status: isCorsOriginAllowed(request) ? 204 : 403, headers: headers(request, requestId) }); },
    POST: async ({ request }) => {
      const requestId = getRequestId(request);
      if (!isCorsOriginAllowed(request)) return json(request, requestId, 403, { error: "ORIGIN_NOT_ALLOWED" });
      const length = Number(request.headers.get("content-length") || 0); if (!Number.isFinite(length) || length < 0 || length > MAX_BODY_BYTES) return json(request, requestId, 413, { error: "REQUEST_TOO_LARGE" });
      const rate = checkRateLimit(clientKey(request)); if (!rate.allowed) return json(request, requestId, 429, { error: "RATE_LIMITED" }, { "Retry-After": String(rate.retryAfter) });
      let body: unknown; try { body = await request.json(); } catch { return json(request, requestId, 400, { error: "INVALID_JSON" }); }
      if (!body || typeof body !== "object") return json(request, requestId, 400, { error: "INVALID_EVENT" });
      const event = body as Record<string, unknown>; const eventName = typeof event.eventName === "string" ? event.eventName : "";
      if (!PUBLIC_EVENTS.has(eventName as PublicEvent)) return json(request, requestId, 400, { error: "INVALID_EVENT" });
      const shareToken = typeof event.shareToken === "string" ? event.shareToken.trim().slice(0, 128) : null;
      const sessionId = typeof event.sessionId === "string" ? event.sessionId.trim().slice(0, 128) : null;
      let cardId: string | null = null;
      if (shareToken) {
        const { data: card } = await supabaseAdmin.from("studio_cards").select("id").eq("share_token", shareToken).eq("status", "published").eq("public_enabled", true).maybeSingle();
        if (!card) return json(request, requestId, 404, { error: "CARD_NOT_FOUND" });
        cardId = String((card as { id: string }).id);
      }
      await trackStudioEvent({ eventName: eventName as PublicEvent, sessionId, cardId, shareToken, provider: typeof event.provider === "string" ? event.provider : null, exportFormat: typeof event.exportFormat === "string" ? event.exportFormat : null, durationMs: typeof event.durationMs === "number" ? event.durationMs : null, metadata: typeof event.metadata === "object" && event.metadata ? event.metadata as Record<string, unknown> : undefined });
      return json(request, requestId, 202, { ok: true });
    },
    GET: async ({ request }) => {
      const requestId = getRequestId(request); const auth = await authenticatedAdmin(request); if (!auth.ok) return json(request, requestId, auth.status, { error: auth.message });
      const url = new URL(request.url); const daysRaw = Number(url.searchParams.get("days") || 30); const days = Number.isFinite(daysRaw) ? Math.max(1, Math.min(Math.round(daysRaw), 365)) : 30;
      const until = new Date(); const since = new Date(until.getTime() - days * 86_400_000);
      const { data, error } = await auth.client.rpc("studio_admin_dashboard", { p_since: since.toISOString(), p_until: until.toISOString() });
      if (error) return json(request, requestId, 502, { error: "ANALYTICS_QUERY_FAILED" });
      return json(request, requestId, 200, data ?? {});
    },
  } },
});
