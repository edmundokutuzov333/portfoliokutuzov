import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { publicConfig } from "@/config/public";
import { buildVCard, normalizeWebsite } from "@/lib/studio/identity-format";

const client = createClient(publicConfig.supabase.url, publicConfig.supabase.publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });

export const Route = createFileRoute("/card/$token.vcf")({
  server: { handlers: { GET: async ({ params }) => {
    const token = params.token.replace(/\.vcf$/i, "").slice(0, 128);
    const { data, error } = await client.from("studio_cards").select("name,role,company,email,phone,website").eq("share_token", token).eq("status", "published").eq("public_enabled", true).maybeSingle() as any;
    if (error || !data) return new Response("Not found", { status: 404, headers: { "Cache-Control": "public, max-age=60" } });
    const origin = new URL(publicConfig.siteUrl).origin;
    const url = `${origin}/card/${encodeURIComponent(token)}`;
    const vcard = buildVCard({ ...data, website: normalizeWebsite(data.website || ""), url });
    return new Response(vcard, { status: 200, headers: { "Content-Type": "text/vcard; charset=utf-8", "Content-Disposition": `attachment; filename="${(data.name || data.company || "contact").replace(/[^a-z0-9-_]+/gi, "-").toLowerCase()}.vcf"`, "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" } });
  } } },
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: () => null,
});
