import { createFileRoute } from "@tanstack/react-router";
import { getCaseStudyBySlug } from "@/lib/case-study.server";
import { renderCaseStudyPdf } from "@/lib/case-study-pdf.server";
import { getRequestId } from "@/lib/observability";

export const runtime = "nodejs";

// @ts-expect-error Server-only TanStack route is intentionally outside generated FileRoutesByPath.
export const Route = createFileRoute("/api/portfolio/$slug/pdf")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const requestId = getRequestId(request);

        try {
          const payload = await getCaseStudyBySlug(params.slug);

          if (!payload) {
            return new Response("Case study not found.", {
              status: 404,
              headers: { "X-Request-Id": requestId },
            });
          }

          const pdf = await renderCaseStudyPdf(payload);
          const filename = (payload.project.slug || payload.project.id) + ".pdf";

          return new Response(pdf as BodyInit, {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": 'attachment; filename="' + filename + '"',
              "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
              "X-Request-Id": requestId,
            },
          });
        } catch (error: unknown) {
          return new Response(
            error instanceof Error ? error.message : "PDF generation failed.",
            {
              status: 500,
              headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "X-Request-Id": requestId,
              },
            },
          );
        }
      },
    },
  },
});
