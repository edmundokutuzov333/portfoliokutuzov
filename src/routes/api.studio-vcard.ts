import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { publicConfig } from "@/config/public";
import { buildVCard, normalizeWebsite } from "@/lib/studio/identity-format";

const client = createClient(publicConfig.supabase.url, publicConfig.supabase.publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });

export const Route = createFileRoute("/api/studio/vcard")({
  server: { handlers: { GET: async ({ request }) => {
    const token = new URL(request.url).searchParams.get("token")?.trim().slice(0, 128) || "";
    if (!token) return new Response("Missing token", { status: 400 });
    const { data, error } = await client.from("studio_cards").select("name,role,company,email,phone,website").eq("share_token", token).eq("status", "published").eq("public_enabled", true).maybeSingle() as any;
    if (error || !data) return new Response("Not found", { status: 404, headers: { "Cache-Control": "public, max-age=60" } });
    const origin = new URL(publicConfig.siteUrl).origin;
    const url = `${origin}/card/${encodeURIComponent(token)}`;
    const vcard = buildVCard({ ...data, website: normalizeWebsite(data.website || ""), url });
    return new Response(vcard, { status: 200, headers: { "Content-Type": "text/vcard; charset=utf-8", "Content-Disposition": `attachment; filename="${(data.name || data.company || "contact").replace(/[^a-z0-9-_]+/gi, "-").toLowerCase()}.vcf"`, "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" } });
  } } },
});
