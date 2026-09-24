import { createFileRoute } from "@tanstack/react-router";
import { getCorsHeaders, isCorsOriginAllowed } from "@/config/server";
import { getCaseStudyBySlug } from "@/lib/case-study.server";
import { getRequestId, logObservability } from "@/lib/observability";

export const runtime = "nodejs";

function response(request: Request, requestId: string, status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...getCorsHeaders(request),
      "X-Request-Id": requestId,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}

// @ts-expect-error Server-only TanStack route is intentionally outside generated FileRoutesByPath.
export const Route = createFileRoute("/api/portfolio-case-study")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const requestId = getRequestId(request);

        if (!isCorsOriginAllowed(request)) {
          return response(request, requestId, 403, { error: "ORIGIN_NOT_ALLOWED" });
        }

        const slug = new URL(request.url).searchParams.get("slug")?.trim() || "";
        if (!slug) return response(request, requestId, 400, { error: "SLUG_REQUIRED" });

        try {
          const payload = await getCaseStudyBySlug(slug);
          if (!payload) {
            return response(request, requestId, 404, { error: "CASE_STUDY_NOT_FOUND" });
          }
          return response(request, requestId, 200, payload);
        } catch (error: unknown) {
          logObservability("dependency_error", {
            requestId,
            route: "/api/portfolio-case-study",
            dependency: "case_study",
            code: "CASE_STUDY_READ_FAILED",
            message: error instanceof Error ? error.message : "Unknown error",
          });
          return response(request, requestId, 502, { error: "CASE_STUDY_READ_FAILED" });
        }
      },
    },
  },
});
