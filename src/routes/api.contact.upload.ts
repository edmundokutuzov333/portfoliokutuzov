import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const runtime = "nodejs";
const MAX_SIZE = 8 * 1024 * 1024;

// @ts-expect-error TanStack route registry does not include server-only API paths in generated FileRoutesByPath.
export const Route = createFileRoute("/api/contact/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const form = await request.formData();
        const file = form.get("file");
        if (!(file instanceof File)) {
          return new Response(JSON.stringify({ ok: false, error: "FILE_REQUIRED" }), {
            status: 422,
            headers: { "Content-Type": "application/json" },
          });
        }
        if (!file.type.startsWith("image/")) {
          return new Response(JSON.stringify({ ok: false, error: "IMAGE_REQUIRED" }), {
            status: 415,
            headers: { "Content-Type": "application/json" },
          });
        }
        if (file.size > MAX_SIZE) {
          return new Response(JSON.stringify({ ok: false, error: "FILE_TOO_LARGE" }), {
            status: 413,
            headers: { "Content-Type": "application/json" },
          });
        }

        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 160);
        const path = `contact-uploads//${crypto.randomUUID()}-${safeName}`;
        const { error } = await supabaseAdmin.storage.from("site-assets").upload(path, file, {
          contentType: file.type,
          upsert: false,
        });
        if (error) {
          return new Response(JSON.stringify({ ok: false, error: "UPLOAD_FAILED" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { data } = supabaseAdmin.storage.from("site-assets").getPublicUrl(path);
        return new Response(JSON.stringify({
          ok: true,
          url: data.publicUrl,
          path,
          name: file.name,
          size: file.size,
        }), {
          status: 200,
          headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        });
      },
    },
  },
});
