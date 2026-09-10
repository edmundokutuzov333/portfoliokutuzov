import { createFileRoute } from "@tanstack/react-router";
import { getCorsHeaders, isCorsOriginAllowed } from "@/config/server";
import { getRequestId, logObservability } from "@/lib/observability";
import { runCreativeEngine } from "@/lib/studio/ai/creative-engine";
import { CREATIVE_PROVIDER_VALUES, type CreativeEngineRequest } from "@/lib/studio/ai/creative-types";
import { trackStudioEvent } from "@/lib/studio/analytics.server";

const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS = 12;
const MAX_BODY_BYTES = 512 * 1024;
const MAX_BRIEF = 1600;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: Request) { const forwarded = request.headers.get("x-forwarded-for"); const realIp = request.headers.get("x-real-ip"); return (forwarded?.split(",")[0]?.trim() || realIp || "unknown").slice(0, 128); }
function checkRateLimit(key: string) { const now = Date.now(); const current = rateLimits.get(key); if (!current || current.resetAt <= now) { rateLimits.set(key, { count: 1, resetAt: now + WINDOW_MS }); return { allowed: true, retryAfter: 0 }; } if (current.count >= MAX_REQUESTS) return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) }; current.count += 1; return { allowed: true, retryAfter: 0 }; }
function headers(request: Request, requestId: string, extra: Record<string, string> = {}) { return { ...getCorsHeaders(request), "X-Request-Id": requestId, ...extra }; }
function errorResponse(request: Request, requestId: string, status: number, code: string, message: string, extra: Record<string, string> = {}) { return new Response(JSON.stringify({ error: { code, message }, requestId }), { status, headers: headers(request, requestId, { "Content-Type": "application/json", "Cache-Control": "no-store", ...extra }) }); }
function acceptableBody(request: Request) { const length = request.headers.get("content-length"); if (!length) return true; const bytes = Number(length); return Number.isFinite(bytes) && bytes >= 0 && bytes <= MAX_BODY_BYTES; }

export const Route = createFileRoute("/api/studio/creative")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => { const requestId = getRequestId(request); return new Response(null, { status: isCorsOriginAllowed(request) ? 204 : 403, headers: headers(request, requestId) }); },
      GET: async ({ request }) => { const requestId = getRequestId(request); if (!isCorsOriginAllowed(request)) return errorResponse(request, requestId, 403, "ORIGIN_NOT_ALLOWED", "This origin is not allowed."); return new Response(JSON.stringify({ status: "healthy", endpoint: "/api/studio/creative", providers: CREATIVE_PROVIDER_VALUES, limits: { maxRequests: MAX_REQUESTS, windowMinutes: 5, maxBodyBytes: MAX_BODY_BYTES }, requestId }), { status: 200, headers: headers(request, requestId, { "Content-Type": "application/json", "Cache-Control": "no-store" }) }); },
      POST: async ({ request }) => {
        const requestId = getRequestId(request); const startedAt = Date.now();
        if (!isCorsOriginAllowed(request)) return errorResponse(request, requestId, 403, "ORIGIN_NOT_ALLOWED", "This origin is not allowed.");
        if (!acceptableBody(request)) return errorResponse(request, requestId, 413, "REQUEST_TOO_LARGE", "The creative request payload is too large.");
        const rate = checkRateLimit(clientKey(request)); if (!rate.allowed) return errorResponse(request, requestId, 429, "RATE_LIMITED", "Creative generation rate limit exceeded.", { "Retry-After": String(rate.retryAfter) });
        let body: CreativeEngineRequest; try { body = (await request.json()) as CreativeEngineRequest; } catch { return errorResponse(request, requestId, 400, "INVALID_JSON", "The request payload is not valid JSON."); }
        if (!body?.design || body.design.widthMm !== 90 || body.design.heightMm !== 50 || !Array.isArray(body.design.elements)) return errorResponse(request, requestId, 400, "INVALID_DESIGN_DOCUMENT", "A valid 90 × 50 mm studio design document is required.");
        if (body.brief && body.brief.length > MAX_BRIEF) return errorResponse(request, requestId, 413, "BRIEF_TOO_LONG", `The brief may contain at most ${MAX_BRIEF} characters.`);
        if (body.provider && !CREATIVE_PROVIDER_VALUES.includes(body.provider)) return errorResponse(request, requestId, 400, "INVALID_PROVIDER", "Unsupported creative provider.");
        void trackStudioEvent({ eventName: "ai_request", provider: body.provider ?? "auto", metadata: { surface: "creative_engine" } });
        try {
          const result = await runCreativeEngine({ ...body, brief: body.brief?.slice(0, MAX_BRIEF) });
          const provider = result.providers.map((item) => item.provider).join(",") || body.provider || "unknown";
          void trackStudioEvent({ eventName: "ai_success", provider, durationMs: Date.now() - startedAt, metadata: { surface: "creative_engine", provider_count: result.providers.length } });
          logObservability("request_end", { requestId, route: "/api/studio/creative", method: "POST", status: 200, latencyMs: Date.now() - startedAt, dependency: provider });
          return new Response(JSON.stringify(result), { status: 200, headers: headers(request, requestId, { "Content-Type": "application/json", "Cache-Control": "no-store" }) });
        } catch (error) {
          const message = error instanceof Error ? error.message : "unknown";
          void trackStudioEvent({ eventName: "ai_failed", provider: body.provider ?? "auto", durationMs: Date.now() - startedAt, metadata: { surface: "creative_engine" } });
          logObservability("dependency_error", { requestId, route: "/api/studio/creative", code: "CREATIVE_ENGINE_FAILED", message });
          if (message === "CREATIVE_ENGINE_NO_PROVIDER_AVAILABLE") return errorResponse(request, requestId, 503, "AI_PROVIDERS_UNAVAILABLE", "No configured AI creative provider is currently available.");
          if (message === "OPENAI_NOT_CONFIGURED") return errorResponse(request, requestId, 503, "OPENAI_NOT_CONFIGURED", "OpenAI is not configured on the server.");
          if (message === "GEMINI_NOT_CONFIGURED") return errorResponse(request, requestId, 503, "GEMINI_NOT_CONFIGURED", "Gemini is not configured on the server.");
          return errorResponse(request, requestId, 502, "CREATIVE_ENGINE_FAILED", "The creative provider could not produce a valid recommendation.");
        }
      },
    },
  },
});
