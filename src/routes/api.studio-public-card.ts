/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { getCorsHeaders, isCorsOriginAllowed } from "@/config/server";
import { getRequestId, logObservability } from "@/lib/observability";
import { supabaseAdmin } from "@/integrations/supabase/server/index.server";
import { sanitizePublicIdentityDesign } from "@/lib/studio/identity-format";

const MAX_TOKEN = 128;

function response(request: Request, requestId: string, status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...getCorsHeaders(request), "X-Request-Id": requestId, "Content-Type": "application/json", "Cache-Control": "public, max-age=60, stale-while-revalidate=300" },
  });
}

export const Route = createFileRoute("/api/studio/public-card")({
  server: { handlers: {
    GET: async ({ request }) => {
      const requestId = getRequestId(request);
      if (!isCorsOriginAllowed(request)) return response(request, requestId, 403, { error: "ORIGIN_NOT_ALLOWED" });
      const token = new URL(request.url).searchParams.get("token")?.trim().slice(0, MAX_TOKEN) || "";
      if (!token) return response(request, requestId, 400, { error: "TOKEN_REQUIRED" });
      const { data, error } = await (supabaseAdmin as any)
        .from("studio_cards")
        .select("name,role,company,email,phone,website,design_document,status,public_enabled")
        .eq("share_token", token)
        .eq("status", "published")
        .eq("public_enabled", true)
        .maybeSingle();
      if (error) {
        logObservability("dependency_error", { requestId, route: "/api/studio/public-card", dependency: "supabase", code: "PUBLIC_CARD_READ_FAILED", message: error.message });
        return response(request, requestId, 502, { error: "PUBLIC_CARD_READ_FAILED" });
      }
      if (!data) return response(request, requestId, 404, { error: "CARD_NOT_FOUND" });
      return response(request, requestId, 200, {
        card: {
          name: data.name,
          role: data.role,
          company: data.company,
          email: data.email,
          phone: data.phone,
          website: data.website,
          design: sanitizePublicIdentityDesign(data.design_document),
        },
      });
    },
  } },
});
