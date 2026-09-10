import { createFileRoute } from "@tanstack/react-router";
import { getCorsHeaders, isCorsOriginAllowed } from "@/config/server";
import { getRequestId, logObservability } from "@/lib/observability";
import { generateMagnificBackground, MagnificBackgroundError } from "@/lib/studio/background/magnific";

const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS = 8;
const MAX_BODY_BYTES = 24 * 1024;
const MAX_PROMPT = 1200;
const MAX_NEGATIVE_PROMPT = 800;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return (forwarded?.split(",")[0]?.trim() || realIp || "unknown").slice(0, 128);
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const current = rateLimits.get(key);
  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  if (current.count >= MAX_REQUESTS) return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function headers(request: Request, requestId: string, extra: Record<string, string> = {}) {
  return { ...getCorsHeaders(request), "X-Request-Id": requestId, ...extra };
}

function errorResponse(request: Request, requestId: string, status: number, code: string, message: string, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify({ error: { code, message }, requestId }), { status, headers: headers(request, requestId, { "Content-Type": "application/json", "Cache-Control": "no-store", ...extra }) });
}

function bodyTooLarge(request: Request) {
  const contentLength = request.headers.get("content-length");
  if (!contentLength) return false;
  const size = Number(contentLength);
  return !Number.isFinite(size) || size < 0 || size > MAX_BODY_BYTES;
}

export const Route = createFileRoute("/api/studio/background")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const requestId = getRequestId(request);
        return new Response(null, { status: isCorsOriginAllowed(request) ? 204 : 403, headers: headers(request, requestId) });
      },
      GET: async ({ request }) => {
        const requestId = getRequestId(request);
        if (!isCorsOriginAllowed(request)) return errorResponse(request, requestId, 403, "ORIGIN_NOT_ALLOWED", "This origin is not allowed.");
        return new Response(JSON.stringify({ status: "healthy", endpoint: "/api/studio/background", provider: "magnific", model: "magnific-classic-fast", limits: { maxRequests: MAX_REQUESTS, windowMinutes: 5, maxBodyBytes: MAX_BODY_BYTES }, requestId }), { status: 200, headers: headers(request, requestId, { "Content-Type": "application/json", "Cache-Control": "no-store" }) });
      },
      POST: async ({ request }) => {
        const requestId = getRequestId(request);
        const startedAt = Date.now();
        if (!isCorsOriginAllowed(request)) return errorResponse(request, requestId, 403, "ORIGIN_NOT_ALLOWED", "This origin is not allowed.");
        if (bodyTooLarge(request)) return errorResponse(request, requestId, 413, "REQUEST_TOO_LARGE", "The background request payload is too large.");
        const rate = checkRateLimit(clientKey(request));
        if (!rate.allowed) return errorResponse(request, requestId, 429, "RATE_LIMITED", "Background generation rate limit exceeded.", { "Retry-After": String(rate.retryAfter) });

        let body: { prompt?: unknown; negativePrompt?: unknown };
        try { body = await request.json() as { prompt?: unknown; negativePrompt?: unknown }; } catch { return errorResponse(request, requestId, 400, "INVALID_JSON", "The request payload is not valid JSON."); }
        const prompt = typeof body.prompt === "string" ? body.prompt.trim().slice(0, MAX_PROMPT) : "";
        const negativePrompt = typeof body.negativePrompt === "string" ? body.negativePrompt.trim().slice(0, MAX_NEGATIVE_PROMPT) : undefined;
        if (prompt.length < 3) return errorResponse(request, requestId, 400, "PROMPT_TOO_SHORT", "A background prompt of at least 3 characters is required.");

        try {
          const result = await generateMagnificBackground(prompt, negativePrompt);
          logObservability("request_end", { requestId, route: "/api/studio/background", method: "POST", status: 200, latencyMs: Date.now() - startedAt, dependency: "magnific" });
          return new Response(JSON.stringify({ ...result, requestId, provider: "magnific" }), { status: 200, headers: headers(request, requestId, { "Content-Type": "application/json", "Cache-Control": "no-store" }) });
        } catch (error) {
          const message = error instanceof Error ? error.message : "unknown";
          logObservability("dependency_error", { requestId, route: "/api/studio/background", dependency: "magnific", code: "BACKGROUND_ENGINE_FAILED", message });
          if (error instanceof MagnificBackgroundError && message === "MAGNIFIC_NOT_CONFIGURED") return errorResponse(request, requestId, 503, "MAGNIFIC_NOT_CONFIGURED", "Magnific is not configured on the server.");
          if (error instanceof MagnificBackgroundError && message === "MAGNIFIC_PROMPT_TOO_SHORT") return errorResponse(request, requestId, 400, "PROMPT_TOO_SHORT", "A background prompt of at least 3 characters is required.");
          if (error instanceof MagnificBackgroundError && message === "MAGNIFIC_SAFETY_FILTERED") return errorResponse(request, requestId, 422, "MAGNIFIC_SAFETY_FILTERED", "Magnific filtered this generation for safety.");
          return errorResponse(request, requestId, 502, "BACKGROUND_ENGINE_FAILED", "Magnific could not produce a background image.");
        }
      },
    },
  },
});
