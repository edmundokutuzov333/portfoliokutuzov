import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const LEAD_STAGES = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
  "archived",
] as const;
export type LeadStage = (typeof LEAD_STAGES)[number];

export const BOOKING_STATUSES = [
  "requested",
  "confirmed",
  "rescheduled",
  "completed",
  "cancelled",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const AUDIENCE_STATUSES = ["active", "inactive", "unsubscribed"] as const;

const IdSchema = z.object({ id: z.string().uuid() });
const LeadListSchema = z.object({
  stage: z.enum(LEAD_STAGES).optional(),
  search: z.string().trim().max(120).optional(),
  limit: z.number().int().min(1).max(200).default(100),
});
const LeadUpdateSchema = z.object({
  id: z.string().uuid(),
  stage: z.enum(LEAD_STAGES).optional(),
  owner_user_id: z.string().uuid().nullable().optional(),
  client_id: z.string().uuid().nullable().optional(),
  project_id: z.string().uuid().nullable().optional(),
  next_action_at: z.string().datetime().nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
});
const ActivitySchema = z.object({
  lead_id: z.string().uuid(),
  activity_type: z.enum(["note", "email", "call", "meeting", "stage_change", "system", "invoice"]),
  body: z.string().trim().min(1).max(5000),
  metadata: z.record(z.string(), z.unknown()).default({}),
});
const TaskCreateSchema = z.object({
  lead_id: z.string().uuid(),
  kind: z.enum(["follow_up", "invoice_reminder", "lead_reminder", "waitlist_notification"]),
  title: z.string().trim().min(1).max(240),
  due_at: z.string().datetime(),
  owner_user_id: z.string().uuid().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});
const TaskUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "completed", "cancelled"]).optional(),
  due_at: z.string().datetime().optional(),
  owner_user_id: z.string().uuid().nullable().optional(),
});
const BookingUpdateSchema = z.object({
  id: z.string().uuid(),
  booking_status: z.enum(BOOKING_STATUSES).optional(),
  lead_id: z.string().uuid().nullable().optional(),
  client_id: z.string().uuid().nullable().optional(),
  owner_user_id: z.string().uuid().nullable().optional(),
  admin_notes: z.string().max(5000).nullable().optional(),
});
const SubscriberUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(AUDIENCE_STATUSES),
});
const WaitlistUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["active", "inactive"]),
});
const PaymentSchema = z.object({
  lead_id: z.string().uuid().nullable().optional(),
  briefing_id: z.string().uuid().nullable().optional(),
  amount: z.number().positive(),
  currency: z.string().trim().min(1).max(12),
  method: z.string().trim().max(80).nullable().optional(),
  reference: z.string().trim().max(160).nullable().optional(),
  status: z.enum(["pending", "confirmed", "rejected"]).default("confirmed"),
  paid_at: z.string().datetime().nullable().optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
});

async function assertPermission(
  context: { supabase: SupabaseClient<Database> },
  permission: "leads.read" | "leads.write" | "finance.read" | "finance.write" | "content.write",
) {
  const { data, error } = await context.supabase.rpc("admin_has_permission", { p_permission: permission });
  if (error) throw new Error(error.message);
  if (!data) throw new Response("Forbidden", { status: 403 });
}

export const getOperationsOverview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertPermission(context, "leads.read");
    const [projects, leads, bookings, subscribers, waitlist, invoices, payments, tasks] = await Promise.all([
      context.supabase.from("projects").select("id,is_published", { count: "exact" }),
      context.supabase.from("crm_leads").select("stage"),
      context.supabase.from("booking_requests").select("booking_status"),
      context.supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }).eq("status", "active"),
      context.supabase.from("studio_waitlist").select("id", { count: "exact", head: true }).eq("status", "active"),
      context.supabase.from("briefing_submissions").select("invoice_total,invoice_currency,invoice_status,invoice_due_date"),
      context.supabase.from("crm_payments").select("briefing_id,amount,currency,status"),
      context.supabase.from("crm_tasks").select("id,due_at,status").eq("status", "pending").order("due_at").limit(20),
    ]);
    for (const result of [projects, leads, bookings, subscribers, waitlist, invoices, payments, tasks]) {
      if (result.error) throw new Error(result.error.message);
    }

    const stage_counts = Object.fromEntries(LEAD_STAGES.map((stage) => [stage, 0])) as Record<LeadStage, number>;
    for (const row of leads.data ?? []) {
      const stage = row.stage as LeadStage;
      if (stage_counts[stage] !== undefined) stage_counts[stage] += 1;
    }

    const booking_counts = Object.fromEntries(BOOKING_STATUSES.map((status) => [status, 0])) as Record<BookingStatus, number>;
    for (const row of bookings.data ?? []) {
      const status = row.booking_status as BookingStatus;
      if (booking_counts[status] !== undefined) booking_counts[status] += 1;
    }

    const paidByBriefing = new Map<string, number>();
    const paidByCurrency = new Map<string, number>();
    for (const payment of payments.data ?? []) {
      if (payment.status !== "confirmed") continue;
      if (payment.briefing_id) paidByBriefing.set(payment.briefing_id, (paidByBriefing.get(payment.briefing_id) ?? 0) + Number(payment.amount));
      paidByCurrency.set(payment.currency, (paidByCurrency.get(payment.currency) ?? 0) + Number(payment.amount));
    }

    const revenueByCurrency = new Map<string, number>();
    const outstandingByCurrency = new Map<string, number>();
    const overdueByCurrency = new Map<string, number>();
    const today = Date.now();

    for (const invoice of invoices.data ?? []) {
      const total = Number(invoice.invoice_total ?? 0);
      const currency = invoice.invoice_currency ?? "USD";
      const paid = invoice.invoice_total ? (paidByBriefing.get((invoice as { id?: string }).id ?? "") ?? 0) : 0;
      const status = String(invoice.invoice_status ?? "").toLowerCase();
      const effectivePaid = paid > 0 ? paid : status === "paid" ? total : 0;
      if (effectivePaid > 0) revenueByCurrency.set(currency, (revenueByCurrency.get(currency) ?? 0) + effectivePaid);
      const outstanding = Math.max(total - effectivePaid, 0);
      if (outstanding > 0 && status !== "cancelled") outstandingByCurrency.set(currency, (outstandingByCurrency.get(currency) ?? 0) + outstanding);
      const overdue = invoice.invoice_due_date && new Date(invoice.invoice_due_date).getTime() < today && outstanding > 0 && status !== "cancelled";
      if (overdue) overdueByCurrency.set(currency, (overdueByCurrency.get(currency) ?? 0) + outstanding);
    }

    const projectRows = projects.data ?? [];
    return {
      projects: {
        published: projectRows.filter((row) => row.is_published).length,
        drafts: projectRows.filter((row) => !row.is_published).length,
        total: projectRows.length,
      },
      leads: stage_counts,
      bookings: booking_counts,
      audience: {
        newsletter_active: subscribers.count ?? 0,
        studio_waitlist_active: waitlist.count ?? 0,
      },
      finance: {
        revenue_by_currency: Object.fromEntries(revenueByCurrency),
        outstanding_by_currency: Object.fromEntries(outstandingByCurrency),
        overdue_by_currency: Object.fromEntries(overdueByCurrency),
        paid_records: paidByCurrency.size ? Object.fromEntries(paidByCurrency) : {},
        invoices: invoices.data?.length ?? 0,
      },
      tasks: {
        pending: tasks.data?.length ?? 0,
        next: tasks.data ?? [],
      },
    };
  });

export const listAdminLeads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => LeadListSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "leads.read");
    let query = context.supabase
      .from("crm_lead_profiles")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(data.limit);
    if (data.stage) query = query.eq("stage", data.stage);
    if (data.search) {
      const needle = data.search.replace(/[^\p{L}\p{N}\s@._-]/gu, "").trim();
      if (needle) query = query.or(
        `full_name.ilike.%${needle}%,company_name.ilike.%${needle}%,email.ilike.%${needle}%,project_type.ilike.%${needle}%`,
      );
    }
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return { ok: true, rows: rows ?? [] };
  });

export const getAdminLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => IdSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "leads.read");
    const [lead, activities, tasks, payments] = await Promise.all([
      context.supabase.from("crm_lead_profiles").select("*").eq("id", data.id).single(),
      context.supabase.from("crm_activities").select("*").eq("lead_id", data.id).order("created_at", { ascending: false }).limit(100),
      context.supabase.from("crm_tasks").select("*").eq("lead_id", data.id).order("due_at", { ascending: true }).limit(50),
      context.supabase.from("crm_payments").select("*").eq("lead_id", data.id).order("created_at", { ascending: false }).limit(100),
    ]);
    if (lead.error) throw new Error(lead.error.message);
    if (activities.error) throw new Error(activities.error.message);
    if (tasks.error) throw new Error(tasks.error.message);
    if (payments.error) throw new Error(payments.error.message);
    return { ok: true, lead: lead.data, activities: activities.data ?? [], tasks: tasks.data ?? [], payments: payments.data ?? [] };
  });

export const listLeadOwners = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertPermission(context, "leads.read");
    const { data, error } = await context.supabase.rpc("admin_user_directory");
    if (error) throw new Error(error.message);
    return { ok: true, rows: data ?? [] };
  });

export const updateAdminLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => LeadUpdateSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "leads.write");
    const { id, ...patch } = data;
    const { data: row, error } = await context.supabase.from("crm_leads").update(patch).eq("id", id).select("*").single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const addLeadActivity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => ActivitySchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "leads.write");
    const { data: row, error } = await context.supabase
      .from("crm_activities")
      .insert({ ...data, actor_user_id: (await context.supabase.auth.getUser()).data.user?.id ?? null })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const createLeadTask = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => TaskCreateSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "leads.write");
    const { data: row, error } = await context.supabase.from("crm_tasks").insert(data).select("*").single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const updateLeadTask = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => TaskUpdateSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "leads.write");
    const { id, ...patch } = data;
    const { data: row, error } = await context.supabase.from("crm_tasks").update(patch).eq("id", id).select("*").single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const listAdminBookings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertPermission(context, "leads.read");
    const { data, error } = await context.supabase.from("booking_requests").select("*").order("preferred_date", { ascending: true }).order("created_at", { ascending: false }).limit(200);
    if (error) throw new Error(error.message);
    return { ok: true, rows: data ?? [] };
  });

export const updateAdminBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => BookingUpdateSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "leads.write");
    const { id, ...patch } = data;
    const { data: row, error } = await context.supabase.from("booking_requests").update(patch).eq("id", id).select("*").single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const listAdminAudience = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertPermission(context, "leads.read");
    const [subscribers, waitlist] = await Promise.all([
      context.supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }).limit(500),
      context.supabase.from("studio_waitlist").select("*").order("created_at", { ascending: false }).limit(500),
    ]);
    if (subscribers.error) throw new Error(subscribers.error.message);
    if (waitlist.error) throw new Error(waitlist.error.message);
    return { ok: true, subscribers: subscribers.data ?? [], waitlist: waitlist.data ?? [] };
  });

export const updateAdminSubscriber = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => SubscriberUpdateSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "leads.write");
    const { data: row, error } = await context.supabase.from("newsletter_subscribers").update({
      status: data.status,
      is_active: data.status === "active",
      updated_at: new Date().toISOString(),
    }).eq("id", data.id).select("*").single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const updateAdminWaitlist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => WaitlistUpdateSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "leads.write");
    const { data: row, error } = await context.supabase.from("studio_waitlist").update({ status: data.status }).eq("id", data.id).select("*").single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const listAdminClientsCRM = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertPermission(context, "leads.read");
    const [clients, projects, leads] = await Promise.all([
      context.supabase.from("clients").select("*").order("sort_order"),
      context.supabase.from("projects").select("id,client_id,is_published"),
      context.supabase.from("crm_leads").select("id,client_id,stage"),
    ]);
    if (clients.error) throw new Error(clients.error.message);
    if (projects.error) throw new Error(projects.error.message);
    if (leads.error) throw new Error(leads.error.message);
    return {
      ok: true,
      rows: (clients.data ?? []).map((client) => ({
        ...client,
        project_count: (projects.data ?? []).filter((project) => project.client_id === client.id).length,
        lead_count: (leads.data ?? []).filter((lead) => lead.client_id === client.id).length,
        active_lead_count: (leads.data ?? []).filter((lead) => lead.client_id === client.id && !["won", "lost", "archived"].includes(lead.stage)).length,
      })),
    };
  });

function csvCell(value: unknown) {
  const text = String(value ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ");
  return `"${text}"`;
}

export const exportAdminAudience = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertPermission(context, "leads.read");
    const [subscribers, waitlist] = await Promise.all([
      context.supabase.from("newsletter_subscribers").select("email,name,source,status,created_at"),
      context.supabase.from("studio_waitlist").select("email,source,status,created_at"),
    ]);
    if (subscribers.error) throw new Error(subscribers.error.message);
    if (waitlist.error) throw new Error(waitlist.error.message);
    const lines = [
      ["type", "email", "name", "source", "status", "created_at"].map(csvCell).join(","),
      ...(subscribers.data ?? []).map((r) => ["newsletter", r.email, r.name, r.source, r.status, r.created_at].map(csvCell).join(",")),
      ...(waitlist.data ?? []).map((r) => ["studio_waitlist", r.email, "", r.source, r.status, r.created_at].map(csvCell).join(",")),
    ];
    return { ok: true, csv: lines.join("\n") };
  });

export const createProjectFromLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => IdSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const { data: projectId, error } = await context.supabase.rpc("admin_create_project_from_lead", { p_lead_id: data.id });
    if (error) throw new Error(error.message);
    return { ok: true, project_id: projectId };
  });

export const recordInvoicePayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => PaymentSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "finance.write");
    const { data: result, error } = await context.supabase.rpc("admin_record_invoice_payment", {
      p_lead_id: data.lead_id ?? null,
      p_briefing_id: data.briefing_id ?? null,
      p_amount: data.amount,
      p_currency: data.currency,
      p_method: data.method ?? null,
      p_reference: data.reference ?? null,
      p_status: data.status,
      p_paid_at: data.paid_at ?? null,
      p_notes: data.notes ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true, result };
  });

export const getStudioOperationsSnapshot = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertPermission(context, "leads.read");
    const since = new Date(Date.now() - 30 * 86400000).toISOString();
    const { data, error } = await context.supabase.rpc("studio_admin_dashboard", {
      p_since: since,
      p_until: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);
    return { ok: true, data: data ?? {} };
  });
