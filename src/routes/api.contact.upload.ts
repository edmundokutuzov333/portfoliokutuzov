import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getRequestId } from "@/lib/observability";

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_FILES = 5;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

function response(requestId: string, status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Request-Id": requestId,
    },
  });
}

// @ts-expect-error TanStack route registry does not include server-only API paths in generated FileRoutesByPath.
export const Route = createFileRoute("/api/contact/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const requestId = getRequestId(request);
        const length = Number(request.headers.get("content-length") || 0);
        if (!Number.isFinite(length) || length <= 0 || length > MAX_FILE_BYTES * MAX_FILES + 128_000) {
          return response(requestId, 413, { error: "REQUEST_TOO_LARGE" });
        }

        const contentType = request.headers.get("content-type") || "";
        const form = await request.formData().catch(() => null);
        if (!form) return response(requestId, 400, { error: "INVALID_MULTIPART" });
        const files = form.getAll("file").filter((entry): entry is File => entry instanceof File);
        if (files.length < 1 || files.length > MAX_FILES) {
          return response(requestId, 422, { error: "INVALID_FILE_COUNT" });
        }

        const uploaded: Array<{ url: string; name: string; size: number; type: string }> = [];
        for (const file of files) {
          if (!ALLOWED_TYPES.has(file.type) || file.size < 1 || file.size > MAX_FILE_BYTES) {
            return response(requestId, 422, { error: "INVALID_FILE" });
          }

          const extension = file.name.includes(".") ? "." + file.name.split(".").pop() : "";
          const path = `contact-uploads/${crypto.randomUUID()}${extension.toLowerCase()}`;
          const bytes = new Uint8Array(await file.arrayBuffer());
          const { error } = await supabaseAdmin.storage
            .from("site-assets")
            .upload(path, bytes, {
              cacheControl: "3600",
              upsert: false,
              contentType: file.type,
            });

          if (error) {
            return response(requestId, 502, { error: "UPLOAD_FAILED" });
          }

          // The object is intentionally private. The attachment URL is represented by a server path
          // and is resolved through an authenticated admin surface when needed.
          uploaded.push({
            url: `/api/contact/attachment?path=${encodeURIComponent(path)}`,
            name: file.name.slice(0, 180),
            size: file.size,
            type: file.type,
          });
        }

        return response(requestId, 200, { ok: true, files: uploaded });
      },
    },
  },
});

export const attachmentMetaSchema = z.object({
  url: z.string().max(2000),
  name: z.string().trim().max(180),
  size: z.number().int().min(0).max(MAX_FILE_BYTES),
  type: z.string().max(80),
});
