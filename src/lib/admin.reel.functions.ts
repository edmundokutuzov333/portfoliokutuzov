import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/server/index.server";

async function assertContentWrite(context: { supabase: any }) {
  const { data, error } = await context.supabase.rpc("admin_has_permission", { p_permission: "content.write" });
  if (error) throw new Error(error.message); if (!data) throw new Response("Forbidden", { status: 403 });
}

const ReelPatch = z.object({ id: z.string().uuid(), display_order: z.number().int(), is_published: z.boolean(), accent_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).nullable().optional() });

export const listAdminReelItems = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator(() => ({})).handler(async ({ context }) => {
  await assertContentWrite(context); const { data, error } = await (supabaseAdmin as any).from("reel_items").select("*").order("display_order");
  if (error) throw new Error(error.message); return { rows: data ?? [] };
});

export const updateAdminReelItem = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((i: unknown) => ReelPatch.parse(i)).handler(async ({ data, context }) => {
  await assertContentWrite(context); const { data: row, error } = await (supabaseAdmin as any).from("reel_items").update({ display_order: data.display_order, is_published: data.is_published, accent_color: data.accent_color ?? null, updated_at: new Date().toISOString() }).eq("id", data.id).select("*").single();
  if (error) throw new Error(error.message); return { row };
});
