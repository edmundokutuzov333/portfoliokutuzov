import { createFileRoute } from "@tanstack/react-router";
import { getCorsHeaders, isCorsOriginAllowed } from "@/config/server";
import { getRequestId, logObservability } from "@/lib/observability";
import { supabaseAdmin } from "@/integrations/supabase/server/index.server";
import { createShareToken } from "@/lib/studio/identity";

const MAX_BODY_BYTES = 512 * 1024;
const MAX_TEXT = 160;
const MAX_WEBSITE = 500;
const MAX_DOCUMENT_ELEMENTS = 20;

function response(request: Request, requestId: string, status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { ...getCorsHeaders(request), "X-Request-Id": requestId, "Content-Type": "application/json", "Cache-Control": "no-store" } });
}

function validEmail(value: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }

export const Route = createFileRoute("/api/studio/publish")({
  server: { handlers: {
    POST: async ({ request }) => {
      const requestId = getRequestId(request);
      if (!isCorsOriginAllowed(request)) return response(request, requestId, 403, { error: "ORIGIN_NOT_ALLOWED" });
      const length = Number(request.headers.get("content-length") || 0);
      if (length > MAX_BODY_BYTES) return response(request, requestId, 413, { error: "REQUEST_TOO_LARGE" });
      let body: any;
      try { body = await request.json(); } catch { return response(request, requestId, 400, { error: "INVALID_JSON" }); }
      const required = ["sessionId", "name", "role", "company", "email", "phone", "website", "design"];
      if (!required.every((key) => typeof body?.[key] === "string" || key === "design")) return response(request, requestId, 400, { error: "INVALID_CARD" });
      if (!body.design || body.design.widthMm !== 90 || body.design.heightMm !== 50 || !Array.isArray(body.design.elements) || body.design.elements.length > MAX_DOCUMENT_ELEMENTS) return response(request, requestId, 400, { error: "INVALID_DESIGN_DOCUMENT" });
      if (!validEmail(body.email.trim())) return response(request, requestId, 400, { error: "INVALID_EMAIL" });

      const shareToken = createShareToken();
      const row = {
        session_id: body.sessionId.slice(0, 128),
        name: body.name.trim().slice(0, MAX_TEXT),
        role: body.role.trim().slice(0, MAX_TEXT),
        company: body.company.trim().slice(0, MAX_TEXT),
        email: body.email.trim().slice(0, 254),
        phone: body.phone.trim().slice(0, 80),
        website: body.website.trim().slice(0, MAX_WEBSITE),
        design_document: body.design,
        status: "published",
        share_token: shareToken,
        public_enabled: true,
        published_at: new Date().toISOString(),
      };
      const { error } = await supabaseAdmin.from("studio_cards").insert(row as never);
      if (error) {
        logObservability("dependency_error", { requestId, route: "/api/studio/publish", dependency: "supabase", code: "STUDIO_PUBLISH_FAILED", message: error.message });
        return response(request, requestId, 502, { error: "PUBLISH_FAILED" });
      }
      logObservability("request_end", { requestId, route: "/api/studio/publish", method: "POST", status: 200, dependency: "supabase" });
      return response(request, requestId, 200, { token: shareToken });
    },
  } },
});
