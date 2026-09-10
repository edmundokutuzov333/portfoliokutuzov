/* eslint-disable @typescript-eslint/no-explicit-any */
import { randomBytes } from "node:crypto";
import { createFileRoute } from "@tanstack/react-router";
import { getCorsHeaders, isCorsOriginAllowed } from "@/config/server";
import { getRequestId, logObservability } from "@/lib/observability";
import { supabaseAdmin } from "@/integrations/supabase/server/index.server";
import { sanitizePublicIdentityDesign } from "@/lib/studio/identity-format";
import { trackStudioEvent } from "@/lib/studio/analytics.server";

const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS = 60;
const MAX_RATE_LIMIT_KEYS = 10_000;
const MAX_BODY_BYTES = 2 * 1024 * 1024;
const MAX_TEXT = 160;
const MAX_WEBSITE = 500;
const MAX_SESSION_ID = 128;
const MAX_DRAFT_TOKEN = 128;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

type CardBody = {
  id?: unknown;
  draftToken?: unknown;
  sessionId?: unknown;
  name?: unknown;
  role?: unknown;
  company?: unknown;
  email?: unknown;
  phone?: unknown;
  website?: unknown;
  design?: unknown;
  revision?: unknown;
};

function clientKey(request: Request) {
  return (request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown").slice(0, 128);
}

function checkRateLimit(key: string) {
  const now = Date.now();
  for (const [entryKey, entry] of rateLimits) if (entry.resetAt <= now) rateLimits.delete(entryKey);
  const current = rateLimits.get(key);
  if (!current) {
    if (rateLimits.size >= MAX_RATE_LIMIT_KEYS) rateLimits.delete(rateLimits.keys().next().value!);
    rateLimits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  if (current.count >= MAX_REQUESTS) return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function headers(request: Request, requestId: string, extra: Record<string, string> = {}) {
  return { ...getCorsHeaders(request), "X-Request-Id": requestId, "Content-Type": "application/json", "Cache-Control": "no-store", ...extra };
}

function json(request: Request, requestId: string, status: number, body: unknown, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: headers(request, requestId, extra) });
}

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validEmail(value: string) {
  return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validDesign(value: unknown) {
  if (!value || typeof value !== "object") return false;
  const design = value as Record<string, unknown>;
  return design.version === 1 && design.widthMm === 90 && design.heightMm === 50 && Array.isArray(design.elements) && design.elements.length <= 20;
}

function createDraftToken() {
  return randomBytes(36).toString("base64url");
}

function publicRecord(row: any) {
  return {
    id: row.id,
    draftToken: row.draft_token,
    sessionId: row.session_id,
    name: row.name,
    role: row.role,
    company: row.company,
    email: row.email,
    phone: row.phone,
    website: row.website,
    design: row.design_document,
    revision: row.revision,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const SELECT = "id,draft_token,session_id,name,role,company,email,phone,website,design_document,revision,status,created_at,updated_at";

export const Route = createFileRoute("/api/studio/card")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const requestId = getRequestId(request);
        return new Response(null, { status: isCorsOriginAllowed(request) ? 204 : 403, headers: headers(request, requestId) });
      },
      GET: async ({ request }) => {
        const requestId = getRequestId(request);
        if (!isCorsOriginAllowed(request)) return json(request, requestId, 403, { error: "ORIGIN_NOT_ALLOWED" });
        const rate = checkRateLimit(clientKey(request));
        if (!rate.allowed) return json(request, requestId, 429, { error: "RATE_LIMITED" }, { "Retry-After": String(rate.retryAfter) });
        const token = text(new URL(request.url).searchParams.get("draftToken"), MAX_DRAFT_TOKEN);
        if (!token) return json(request, requestId, 400, { error: "DRAFT_TOKEN_REQUIRED" });
        const { data, error } = await (supabaseAdmin as any).from("studio_cards").select(SELECT).eq("draft_token", token).maybeSingle();
        if (error) {
          logObservability("dependency_error", { requestId, route: "/api/studio/card", dependency: "supabase", code: "STUDIO_CARD_READ_FAILED", message: error.message });
          return json(request, requestId, 502, { error: "CARD_READ_FAILED" });
        }
        if (!data) return json(request, requestId, 404, { error: "CARD_NOT_FOUND" });
        return json(request, requestId, 200, { card: publicRecord(data) });
      },
      POST: async ({ request }) => {
        const requestId = getRequestId(request);
        const startedAt = Date.now();
        if (!isCorsOriginAllowed(request)) return json(request, requestId, 403, { error: "ORIGIN_NOT_ALLOWED" });
        const length = Number(request.headers.get("content-length") || 0);
        if (!Number.isFinite(length) || length < 0 || length > MAX_BODY_BYTES) return json(request, requestId, 413, { error: "REQUEST_TOO_LARGE" });
        const rate = checkRateLimit(clientKey(request));
        if (!rate.allowed) return json(request, requestId, 429, { error: "RATE_LIMITED" }, { "Retry-After": String(rate.retryAfter) });
        let body: CardBody;
        try { body = (await request.json()) as CardBody; } catch { return json(request, requestId, 400, { error: "INVALID_JSON" }); }

        const sessionId = text(body.sessionId, MAX_SESSION_ID);
        const draftToken = text(body.draftToken, MAX_DRAFT_TOKEN);
        const id = text(body.id, 64);
        const name = text(body.name, MAX_TEXT);
        const role = text(body.role, MAX_TEXT);
        const company = text(body.company, MAX_TEXT);
        const email = text(body.email, 254);
        const phone = text(body.phone, 80);
        const website = text(body.website, MAX_WEBSITE);
        const suppliedRevision = body.revision === undefined || body.revision === null || body.revision === "" ? undefined : Number(body.revision);
        if (sessionId.length < 20) return json(request, requestId, 400, { error: "INVALID_SESSION" });
        if (suppliedRevision !== undefined && (!Number.isInteger(suppliedRevision) || suppliedRevision < 1)) return json(request, requestId, 400, { error: "INVALID_REVISION" });
        if (!validEmail(email)) return json(request, requestId, 400, { error: "INVALID_EMAIL" });
        if (!validDesign(body.design)) return json(request, requestId, 400, { error: "INVALID_DESIGN_DOCUMENT" });
        const design = sanitizePublicIdentityDesign(body.design);
        const db = supabaseAdmin as any;

        if (!draftToken) {
          const newToken = createDraftToken();
          const payload = { session_id: sessionId, draft_token: newToken, name, role, company, email, phone, website, design_document: design, revision: 1, status: "draft", last_saved_at: new Date().toISOString() };
          const { data, error } = await db.from("studio_cards").insert(payload).select(SELECT).single();
          if (error) {
            logObservability("dependency_error", { requestId, route: "/api/studio/card", dependency: "supabase", code: "STUDIO_CARD_CREATE_FAILED", message: error.message });
            return json(request, requestId, 502, { error: "CARD_SAVE_FAILED" });
          }
          void trackStudioEvent({ eventName: "card_saved", sessionId, cardId: data.id, metadata: { mode: "create", revision: 1 } });
          logObservability("request_end", { requestId, route: "/api/studio/card", method: "POST", status: 200, latencyMs: Date.now() - startedAt, dependency: "supabase" });
          return json(request, requestId, 200, { card: publicRecord(data) });
        }

        const currentResult = await db.from("studio_cards").select(SELECT).eq("draft_token", draftToken).maybeSingle();
        if (currentResult.error) {
          logObservability("dependency_error", { requestId, route: "/api/studio/card", dependency: "supabase", code: "STUDIO_CARD_LOOKUP_FAILED", message: currentResult.error.message });
          return json(request, requestId, 502, { error: "CARD_READ_FAILED" });
        }
        const current = currentResult.data;
        if (!current) return json(request, requestId, 404, { error: "CARD_NOT_FOUND" });
        if (id && id !== current.id) return json(request, requestId, 409, { error: "CARD_TOKEN_MISMATCH" });
        if (current.session_id !== sessionId) return json(request, requestId, 403, { error: "SESSION_MISMATCH" });
        const expectedRevision = suppliedRevision ?? Number(current.revision || 1);
        const nextRevision = expectedRevision + 1;

        const { data, error } = await db
          .from("studio_cards")
          .update({ name, role, company, email, phone, website, design_document: design, revision: nextRevision, last_saved_at: new Date().toISOString(), status: current.status === "published" ? "published" : "saved" })
          .eq("draft_token", draftToken)
          .eq("session_id", sessionId)
          .eq("revision", expectedRevision)
          .select(SELECT)
          .maybeSingle();

        if (error) {
          logObservability("dependency_error", { requestId, route: "/api/studio/card", dependency: "supabase", code: "STUDIO_CARD_UPDATE_FAILED", message: error.message });
          return json(request, requestId, 502, { error: "CARD_SAVE_FAILED" });
        }
        if (!data) {
          const latest = await db.from("studio_cards").select(SELECT).eq("draft_token", draftToken).maybeSingle();
          if (!latest.data) return json(request, requestId, 404, { error: "CARD_NOT_FOUND" });
          void trackStudioEvent({ eventName: "card_save_conflict", sessionId, cardId: latest.data.id, metadata: { expected_revision: expectedRevision, actual_revision: latest.data.revision } });
          return json(request, requestId, 409, { error: "REVISION_CONFLICT", card: publicRecord(latest.data) });
        }
        void trackStudioEvent({ eventName: "card_saved", sessionId, cardId: data.id, metadata: { mode: "update", revision: data.revision } });
        logObservability("request_end", { requestId, route: "/api/studio/card", method: "POST", status: 200, latencyMs: Date.now() - startedAt, dependency: "supabase" });
        return json(request, requestId, 200, { card: publicRecord(data) });
      },
    },
  },
});
