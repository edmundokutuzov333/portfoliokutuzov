import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getRequestId } from "@/lib/observability";

export const runtime = "nodejs";

async function isAdminRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7).trim();
  if (!token) return false;
  const { data } = await supabaseAdmin.auth.getUser(token);
  if (!data.user) return false;
  const { data: admin } = await supabaseAdmin
    .from("admin_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  return Boolean(admin?.user_id);
}

export const Route = createFileRoute("/api/contact/attachment")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const requestId = getRequestId(request);
        if (!(await isAdminRequest(request))) {
          return new Response(JSON.stringify({ error: "UNAUTHORIZED" }), {
            status: 401,
            headers: { "Content-Type": "application/json", "X-Request-Id": requestId, "Cache-Control": "no-store" },
          });
        }

        const url = new URL(request.url);
        const path = url.searchParams.get("path") || "";
        if (!path.startsWith("contact-uploads/") || path.includes("..")) {
          return new Response(JSON.stringify({ error: "INVALID_PATH" }), {
            status: 400,
            headers: { "Content-Type": "application/json", "X-Request-Id": requestId, "Cache-Control": "no-store" },
          });
        }

        const { data, error } = await supabaseAdmin.storage.from("contact-uploads").createSignedUrl(path, 300);
        if (error || !data?.signedUrl) {
          return new Response(JSON.stringify({ error: "NOT_FOUND" }), {
            status: 404,
            headers: { "Content-Type": "application/json", "X-Request-Id": requestId, "Cache-Control": "no-store" },
          });
        }

        return Response.redirect(data.signedUrl, 302);
      },
    },
  },
});
