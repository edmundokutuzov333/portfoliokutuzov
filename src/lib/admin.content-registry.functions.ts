import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/server/index.server";
import type { SupabaseClient } from "@supabase/supabase-js";

async function assertContentWrite(context: { supabase: SupabaseClient<any> }) {
  const { data, error } = await context.supabase.rpc("admin_has_permission", { p_permission: "content.write" });
  if (error) throw new Error(error.message);
  if (!data) throw new Response("Forbidden", { status: 403 });
}

const FaqSchema = z.object({ id: z.string().uuid().optional(), question: z.string().trim().min(1).max(500), answer: z.string().trim().min(1).max(5000), question_pt: z.string().trim().max(500).nullable().optional(), answer_pt: z.string().trim().max(5000).nullable().optional(), sort_order: z.number().int().min(-100000).max(100000), is_published: z.boolean() });
const TestimonialSchema = z.object({ id: z.string().uuid().optional(), quote: z.string().trim().min(1).max(3000), quote_pt: z.string().trim().max(3000).nullable().optional(), person: z.string().trim().min(1).max(200), role: z.string().trim().max(200).nullable().optional(), company: z.string().trim().max(200).nullable().optional(), sort_order: z.number().int().min(-100000).max(100000), is_published: z.boolean() });
const MetricSchema = z.object({ id: z.string().uuid().optional(), metric_key: z.string().trim().min(1).max(100), value: z.string().trim().max(120).nullable().optional(), value_pt: z.string().trim().max(120).nullable().optional(), label: z.string().trim().min(1).max(160), label_pt: z.string().trim().max(160).nullable().optional(), sort_order: z.number().int().min(-100000).max(100000), is_active: z.boolean() });

export const listAdminContentRegistry = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator(() => ({})).handler(async ({ context }) => {
  await assertContentWrite(context);
  const db = supabaseAdmin as any;
  const [{ data: faq, error: faqError }, { data: testimonials, error: testimonialError }, { data: metrics, error: metricError }] = await Promise.all([
    db.from("faq_entries").select("*").order("sort_order").order("created_at"),
    db.from("testimonials").select("*").order("sort_order").order("created_at"),
    db.from("site_metrics").select("*").order("sort_order").order("created_at"),
  ]);
  if (faqError) throw new Error(faqError.message);
  if (testimonialError) throw new Error(testimonialError.message);
  if (metricError) throw new Error(metricError.message);
  return { faq: faq ?? [], testimonials: testimonials ?? [], metrics: metrics ?? [] };
});

export const upsertAdminFaq = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((i: unknown) => FaqSchema.parse(i)).handler(async ({ data, context }) => {
  await assertContentWrite(context); const db = supabaseAdmin as any;
  const { data: row, error } = await db.from("faq_entries").upsert({ ...data, id: data.id ?? undefined, updated_at: new Date().toISOString() }).select("*").single();
  if (error) throw new Error(error.message); return { ok: true, row };
});
export const deleteAdminFaq = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i)).handler(async ({ data, context }) => {
  await assertContentWrite(context); const { error } = await (supabaseAdmin as any).from("faq_entries").delete().eq("id", data.id); if (error) throw new Error(error.message); return { ok: true };
});

export const upsertAdminTestimonial = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((i: unknown) => TestimonialSchema.parse(i)).handler(async ({ data, context }) => {
  await assertContentWrite(context); const { data: row, error } = await (supabaseAdmin as any).from("testimonials").upsert({ ...data, id: data.id ?? undefined, updated_at: new Date().toISOString() }).select("*").single(); if (error) throw new Error(error.message); return { ok: true, row };
});
export const deleteAdminTestimonial = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i)).handler(async ({ data, context }) => {
  await assertContentWrite(context); const { error } = await (supabaseAdmin as any).from("testimonials").delete().eq("id", data.id); if (error) throw new Error(error.message); return { ok: true };
});

export const upsertAdminSiteMetric = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((i: unknown) => MetricSchema.parse(i)).handler(async ({ data, context }) => {
  await assertContentWrite(context); const { data: row, error } = await (supabaseAdmin as any).from("site_metrics").upsert({ ...data, id: data.id ?? undefined, updated_at: new Date().toISOString() }).select("*").single(); if (error) throw new Error(error.message); return { ok: true, row };
});
export const deleteAdminSiteMetric = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i)).handler(async ({ data, context }) => {
  await assertContentWrite(context); const { error } = await (supabaseAdmin as any).from("site_metrics").delete().eq("id", data.id); if (error) throw new Error(error.message); return { ok: true };
});
