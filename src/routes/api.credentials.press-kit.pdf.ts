import { createFileRoute } from "@tanstack/react-router";
import { renderCredentialsPdf } from "@/lib/credentials-pdf.server";
import { getRequestId } from "@/lib/observability";

export const runtime = "nodejs";

export const Route = createFileRoute("/api/credentials/press-kit.pdf")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const requestId = getRequestId(request);

        try {
          const pdf = await renderCredentialsPdf();

          return new Response(pdf as BodyInit, {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": 'attachment; filename="edmundo-kutuzov-press-kit-cv.pdf"',
              "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
              "X-Request-Id": requestId,
            },
          });
        } catch (error) {
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
