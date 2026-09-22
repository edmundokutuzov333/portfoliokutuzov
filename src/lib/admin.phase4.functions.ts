import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { resolvePublicSiteUrl } from "@/config/server";

type AdminContext = { supabase: SupabaseClient<Database> };

const ENTITY_TYPES = [
  "site_settings",
  "projects",
  "clients",
  "services",
  "stats",
  "about_method",
] as const;
type Phase4EntityType = (typeof ENTITY_TYPES)[number];

const DraftCreateSchema = z.object({
  entity_type: z.enum(ENTITY_TYPES),
  entity_id: z.string().trim().min(1).max(160),
  label: z.string().trim().min(1).max(240),
  payload: z.record(z.string(), z.unknown()).optional(),
});
const DraftUpdateSchema = z.object({
  id: z.string().uuid(),
  payload: z.record(z.string(), z.unknown()),
  status: z.enum(["draft", "review"]).optional(),
});
const DraftListSchema = z.object({
  status: z.enum(["all", "draft", "review", "published", "discarded"]).default("all"),
  limit: z.number().int().min(1).max(300).default(100),
});
const DraftIdSchema = z.object({ id: z.string().uuid() });
const DraftPublishSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(100),
  note: z.string().trim().max(1000).nullable().optional(),
});
const SearchSchema = z.object({
  query: z.string().trim().max(120).default(""),
  limit: z.number().int().min(1).max(50).default(30),
});
const AuditRangeSchema = z.object({
  limit: z.number().int().min(1).max(300).default(200),
  action: z.enum(["create", "update", "delete"]).optional(),
  entity_type: z.string().trim().min(1).max(80).optional(),
  search: z.string().trim().max(120).optional(),
  since: z.string().datetime().nullable().optional(),
  until: z.string().datetime().nullable().optional(),
});
const RestoreAuditSchema = z.object({
  id: z.string().uuid(),
  snapshot: z.record(z.string(), z.unknown()),
  entity_type: z.enum(ENTITY_TYPES),
  entity_id: z.string().min(1).max(160),
});

async function assertPermission(context: AdminContext, permission: Parameters<typeof permissionName>[0]) {
  const { data, error } = await context.supabase.rpc("admin_has_permission", {
    p_permission: permission,
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Response("Forbidden", { status: 403 });
}
async function assertEntityWritePermission(
  context: AdminContext,
  entity_type: Phase4EntityType,
  entity_id: string,
) {
  await assertPermission(context, "content.write");
  if (entity_type === "site_settings" && entity_id === "invoice_settings") {
    await assertPermission(context, "finance.write");
  }
}

async function assertDraftWritePermission(context: AdminContext, id: string) {
  const { data, error } = await context.supabase
    .from("admin_drafts")
    .select("entity_type,entity_id")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  await assertEntityWritePermission(context, data.entity_type as Phase4EntityType, data.entity_id);
  return data;
}

function permissionName(
  permission:
    | "content.read"
    | "content.write"
    | "leads.read"
    | "finance.read"
    | "finance.write"
    | "media.manage"
    | "system.audit.read",
) {
  return permission;
}

async function loadLiveEntity(context: AdminContext, entity_type: Phase4EntityType, entity_id: string) {
  if (entity_type === "site_settings") {
    const { data, error } = await context.supabase.from("site_settings").select("key,value,updated_at").eq("key", entity_id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error("Site setting not found");
    return { snapshot: (data.value ?? {}) as Record<string, unknown>, updated_at: data.updated_at };
  }
  if (!z.string().uuid().safeParse(entity_id).success) throw new Error("Invalid entity id");
  if (entity_type === "projects") {
    const { data, error } = await context.supabase.from("projects").select("*").eq("id", entity_id).single();
    if (error) throw new Error(error.message);
    return { snapshot: data as unknown as Record<string, unknown>, updated_at: data.updated_at };
  }
  if (entity_type === "clients") {
    const { data, error } = await context.supabase.from("clients").select("*").eq("id", entity_id).single();
    if (error) throw new Error(error.message);
    return { snapshot: data as unknown as Record<string, unknown>, updated_at: data.updated_at };
  }
  if (entity_type === "services") {
    const { data, error } = await context.supabase.from("services").select("*").eq("id", entity_id).single();
    if (error) throw new Error(error.message);
    return { snapshot: data as unknown as Record<string, unknown>, updated_at: data.updated_at };
  }
  if (entity_type === "stats") {
    const { data, error } = await context.supabase.from("stats").select("*").eq("id", entity_id).single();
    if (error) throw new Error(error.message);
    return { snapshot: data as unknown as Record<string, unknown>, updated_at: data.updated_at };
  }
  const { data, error } = await context.supabase.from("about_method").select("*").eq("id", entity_id).single();
  if (error) throw new Error(error.message);
  return { snapshot: data as unknown as Record<string, unknown>, updated_at: data.updated_at };
}

export const listAdminEditableEntities = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(() => ({}))
  .handler(async ({ context }) => {
    await assertPermission(context, "content.read");
    const { data, error } = await context.supabase.rpc("admin_editable_entity_directory");
    if (error) throw new Error(error.message);
    return { ok: true, entities: (data ?? {}) as Record<string, Array<{ id: string; label: string; meta: string | null }>> };
  });

export const getAdminAnalyticsOverview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => z.object({ days: z.number().int().min(1).max(90).default(30) }).parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "system.audit.read");
    const since = new Date(Date.now() - data.days * 86400000).toISOString();
    const { data: rows, error } = await context.supabase
      .from("analytics_events")
      .select("action,page,device,element,session_id,created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: true })
      .limit(20000);
    if (error) throw new Error(error.message);

    const events = rows ?? [];
    const pages = new Map<string, number>();
    const actions = new Map<string, number>();
    const devices = new Map<string, number>();
    const daily = new Map<string, number>();

    for (const event of events) {
      pages.set(event.page, (pages.get(event.page) ?? 0) + 1);
      actions.set(event.action, (actions.get(event.action) ?? 0) + 1);
      const device = event.device ?? "unknown";
      devices.set(device, (devices.get(device) ?? 0) + 1);
      const day = event.created_at.slice(0, 10);
      daily.set(day, (daily.get(day) ?? 0) + 1);
    }

    const top = (map: Map<string, number>) =>
      [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([name, count]) => ({ name, count }));

    return {
      ok: true,
      summary: {
        events: events.length,
        sessions: new Set(events.map((event) => event.session_id).filter(Boolean)).size,
        pages: pages.size,
        actions: actions.size,
      },
      top_pages: top(pages),
      top_actions: top(actions),
      devices: top(devices),
      daily: [...daily.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([day, count]) => ({ day, count })),
    };
  });

export const createAdminDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => DraftCreateSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertEntityWritePermission(context, data.entity_type, data.entity_id);
    const { data: existing, error: existingError } = await context.supabase
      .from("admin_drafts").select("*").eq("entity_type", data.entity_type).eq("entity_id", data.entity_id)
      .in("status", ["draft", "review"]).maybeSingle();
    if (existingError) throw new Error(existingError.message);
    if (existing) return { ok: true, row: existing, created: false };

    const live = await loadLiveEntity(context, data.entity_type, data.entity_id);
    const payload = data.payload ?? live.snapshot;
    const userId = (await context.supabase.auth.getUser()).data.user?.id ?? null;
    const { data: row, error } = await context.supabase.from("admin_drafts").insert({
      entity_type: data.entity_type,
      entity_id: data.entity_id,
      label: data.label,
      payload: payload as never,
      baseline_snapshot: live.snapshot as never,
      baseline_updated_at: live.updated_at,
      status: "draft",
      created_by: userId,
      updated_by: userId,
    }).select("*").single();
    if (error) throw new Error(error.message);
    return { ok: true, row, created: true };
  });

export const getAdminDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => DraftIdSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.read");
    const { data: row, error } = await context.supabase.from("admin_drafts").select("*").eq("id", data.id).single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const listAdminDrafts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => DraftListSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.read");
    let query = context.supabase.from("admin_drafts").select("*").order("updated_at", { ascending: false }).limit(data.limit);
    if (data.status !== "all") query = query.eq("status", data.status);
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return { ok: true, rows: rows ?? [] };
  });

export const updateAdminDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => DraftUpdateSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertDraftWritePermission(context, data.id);
    const userId = (await context.supabase.auth.getUser()).data.user?.id ?? null;
    const { data: row, error } = await context.supabase.from("admin_drafts").update({
      payload: data.payload as never,
      status: data.status ?? "draft",
      updated_by: userId,
      updated_at: new Date().toISOString(),
    }).eq("id", data.id).in("status", ["draft", "review"]).select("*").single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const submitAdminDraftForReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => DraftIdSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertDraftWritePermission(context, data.id);
    const userId = (await context.supabase.auth.getUser()).data.user?.id ?? null;
    const { data: row, error } = await context.supabase.from("admin_drafts")
      .update({ status: "review", reviewed_by: null, updated_by: userId })
      .eq("id", data.id).eq("status", "draft").select("*").single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const discardAdminDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => DraftIdSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertDraftWritePermission(context, data.id);
    const userId = (await context.supabase.auth.getUser()).data.user?.id ?? null;
    const { data: row, error } = await context.supabase.from("admin_drafts")
      .update({ status: "discarded", updated_by: userId, updated_at: new Date().toISOString() })
      .eq("id", data.id).in("status", ["draft", "review"]).select("*").single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const publishAdminDrafts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => DraftPublishSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const { data: rows, error } = await context.supabase.rpc("admin_publish_drafts", {
      p_draft_ids: data.ids,
      p_publish_note: data.note ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true, rows: rows ?? [] };
  });

function diffValues(before: unknown, after: unknown, prefix = ""): string[] {
  if (Object.is(before, after)) return [];
  if (before === null || after === null || typeof before !== "object" || typeof after !== "object") return [prefix || "$"];
  if (Array.isArray(before) || Array.isArray(after)) return JSON.stringify(before) === JSON.stringify(after) ? [] : [prefix || "$"];
  const keys = new Set([...Object.keys(before as Record<string, unknown>), ...Object.keys(after as Record<string, unknown>)]);
  const out: string[] = [];
  for (const key of keys) {
    out.push(...diffValues(
      (before as Record<string, unknown>)[key],
      (after as Record<string, unknown>)[key],
      prefix ? prefix + "." + key : key,
    ));
  }
  return out;
}

function imageChangeCount(before: Record<string, unknown>, after: Record<string, unknown>) {
  let count = 0;
  for (const key of ["cover_url", "logo_url", "og_image", "image_url", "video_url"]) {
    if (JSON.stringify(before[key]) !== JSON.stringify(after[key]) && (before[key] || after[key])) count += 1;
  }
  if (JSON.stringify(before.gallery) !== JSON.stringify(after.gallery)) count += 1;
  return count;
}

export function getDraftDiff(input: { baseline_snapshot: Record<string, unknown>; payload: Record<string, unknown> }) {
  const changedPaths = diffValues(input.baseline_snapshot, input.payload);
  return {
    changedCount: changedPaths.length,
    changedPaths,
    imagesReplaced: imageChangeCount(input.baseline_snapshot, input.payload),
    reordered: Object.prototype.hasOwnProperty.call(input.baseline_snapshot, "sort_order")
      && Object.prototype.hasOwnProperty.call(input.payload, "sort_order")
      && Number(input.baseline_snapshot.sort_order) !== Number(input.payload.sort_order),
  };
}

export const getAdminDraftDiff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => DraftIdSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.read");
    const { data: row, error } = await context.supabase.from("admin_drafts")
      .select("id,label,entity_type,entity_id,status,baseline_snapshot,payload,baseline_updated_at,updated_at").eq("id", data.id).single();
    if (error) throw new Error(error.message);
    return { ok: true, row, diff: getDraftDiff({
      baseline_snapshot: row.baseline_snapshot as Record<string, unknown>,
      payload: row.payload as Record<string, unknown>,
    }) };
  });

export const getAdminPreviewBundle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => DraftIdSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.read");
    const { data: draft, error: draftError } = await context.supabase.from("admin_drafts").select("*").eq("id", data.id).single();
    if (draftError) throw new Error(draftError.message);
    const [settingsResult, projectsResult, clientsResult, servicesResult, statsResult, methodsResult] = await Promise.all([
      context.supabase.from("site_settings").select("key,value").limit(100),
      context.supabase.from("projects").select("*").order("sort_order").limit(100),
      context.supabase.from("clients").select("*").order("sort_order").limit(100),
      context.supabase.from("services").select("*").order("sort_order").limit(100),
      context.supabase.from("stats").select("*").order("sort_order").limit(100),
      context.supabase.from("about_method").select("*").order("sort_order").limit(100),
    ]);
    for (const result of [settingsResult, projectsResult, clientsResult, servicesResult, statsResult, methodsResult]) {
      if (result.error) throw new Error(result.error.message);
    }

    const settings = Object.fromEntries((settingsResult.data ?? []).map((row) => [row.key, row.value]));
    if (draft.entity_type === "site_settings") settings[draft.entity_id] = draft.payload;

    const projects = (projectsResult.data ?? []).map((row) =>
      draft.entity_type === "projects" && row.id === draft.entity_id
        ? { ...row, ...(draft.payload as Record<string, unknown>) }
        : row,
    );
    const clients = (clientsResult.data ?? []).map((row) =>
      draft.entity_type === "clients" && row.id === draft.entity_id
        ? { ...row, ...(draft.payload as Record<string, unknown>) }
        : row,
    );
    const services = (servicesResult.data ?? []).map((row) =>
      draft.entity_type === "services" && row.id === draft.entity_id
        ? { ...row, ...(draft.payload as Record<string, unknown>) }
        : row,
    );
    const stats = (statsResult.data ?? []).map((row) =>
      draft.entity_type === "stats" && row.id === draft.entity_id
        ? { ...row, ...(draft.payload as Record<string, unknown>) }
        : row,
    );
    const about_method = (methodsResult.data ?? []).map((row) =>
      draft.entity_type === "about_method" && row.id === draft.entity_id
        ? { ...row, ...(draft.payload as Record<string, unknown>) }
        : row,
    );

    return {
      ok: true,
      draft: {
        id: draft.id,
        label: draft.label,
        entity_type: draft.entity_type,
        entity_id: draft.entity_id,
        status: draft.status,
        payload: draft.payload,
      },
      settings,
      projects,
      clients,
      services,
      stats,
      about_method,
      selectedProject: draft.entity_type === "projects"
        ? projects.find((row) => row.id === draft.entity_id) ?? null
        : null,
      selectedClient: draft.entity_type === "clients"
        ? clients.find((row) => row.id === draft.entity_id) ?? null
        : null,
      selectedService: draft.entity_type === "services"
        ? services.find((row) => row.id === draft.entity_id) ?? null
        : null,
      selectedStat: draft.entity_type === "stats"
        ? stats.find((row) => row.id === draft.entity_id) ?? null
        : null,
      selectedMethod: draft.entity_type === "about_method"
        ? about_method.find((row) => row.id === draft.entity_id) ?? null
        : null,
    };
  });

export const globalAdminSearch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => SearchSchema.parse(i))
  .handler(async ({ data, context }) => {
    const query = data.query.trim();
    if (!query) return { ok: true, results: [] };
    await assertPermission(context, "content.read");
    const needle = query.normalize("NFKC").replace(/[^\p{L}\p{N}\s@._-]/gu, "").trim();
    if (!needle) return { ok: true, results: [] };

    const [projects,clients,services,stats,methods,settings,leads,invoices,media] = await Promise.all([
      context.supabase.from("projects").select("id,title,client_name,category,slug,is_published").or("title.ilike.%" + needle + "%,client_name.ilike.%" + needle + "%,category.ilike.%" + needle + "%").limit(8),
      context.supabase.from("clients").select("id,name,kind,is_active").ilike("name", "%" + needle + "%").limit(8),
      context.supabase.from("services").select("id,title,number,is_active").ilike("title", "%" + needle + "%").limit(8),
      context.supabase.from("stats").select("id,label,value,is_active").or("label.ilike.%" + needle + "%,value.ilike.%" + needle + "%").limit(8),
      context.supabase.from("about_method").select("id,title,number,is_active").ilike("title", "%" + needle + "%").limit(8),
      context.supabase.from("site_settings").select("key,value,updated_at").ilike("key", "%" + needle + "%").limit(8),
      context.supabase.from("crm_lead_profiles").select("id,full_name,company_name,email,stage").or("full_name.ilike.%" + needle + "%,company_name.ilike.%" + needle + "%,email.ilike.%" + needle + "%").limit(8),
      context.supabase.from("briefing_submissions").select("id,invoice_number,company_name,email,invoice_status").or("invoice_number.ilike.%" + needle + "%,company_name.ilike.%" + needle + "%,email.ilike.%" + needle + "%").limit(8),
      context.supabase.from("media_assets").select("id,filename,mime_type,kind,public_url").ilike("filename", "%" + needle + "%").limit(8),
    ]);

    const results: Array<{ id:string; title:string; subtitle:string; type:string; target:string; entity_id?:string }> = [];
    for (const row of projects.data ?? []) results.push({ id:"project:"+row.id, title:row.title, subtitle:(row.client_name ?? "No client")+" · "+row.category, type:"Project", target:"portfolio", entity_id:row.id });
    for (const row of clients.data ?? []) results.push({ id:"client:"+row.id, title:row.name, subtitle:row.kind+" · "+(row.is_active?"active":"hidden"), type:"Client", target:"clients", entity_id:row.id });
    for (const row of services.data ?? []) results.push({ id:"service:"+row.id, title:row.title, subtitle:(row.number ?? "Service")+" · "+(row.is_active?"active":"hidden"), type:"Service", target:"services", entity_id:row.id });
    for (const row of stats.data ?? []) results.push({ id:"stat:"+row.id, title:row.label, subtitle:row.value+" · "+(row.is_active?"active":"hidden"), type:"Stat", target:"credentials", entity_id:row.id });
    for (const row of methods.data ?? []) results.push({ id:"method:"+row.id, title:row.title, subtitle:row.number+" · "+(row.is_active?"active":"hidden"), type:"Method", target:"credentials", entity_id:row.id });
    for (const row of settings.data ?? []) results.push({ id:"setting:"+row.key, title:row.key, subtitle:"Site setting · "+new Date(row.updated_at).toLocaleString(), type:"Setting", target:row.key==="hero"||row.key==="manifesto"||row.key==="featured_section"?"homepage":row.key==="navbar"?"navigation":row.key==="credentials"?"credentials":row.key==="services_section"?"services":row.key==="seo"?"seo":"global", entity_id:row.key });
    for (const row of leads.data ?? []) results.push({ id:"lead:"+row.id, title:row.full_name ?? "Lead", subtitle:(row.company_name ?? row.email ?? "Lead")+" · "+(row.stage ?? "new"), type:"Lead", target:"operations", entity_id:row.id });

    const financePermission = await context.supabase.rpc("admin_has_permission", { p_permission:"finance.read" });
    if (!financePermission.error && financePermission.data) {
      for (const row of invoices.data ?? []) results.push({ id:"invoice:"+row.id, title:row.invoice_number ?? "Invoice", subtitle:(row.company_name ?? row.email ?? "Invoice")+" · "+(row.invoice_status ?? "draft"), type:"Invoice", target:"invoice", entity_id:row.id });
    }
    const mediaPermission = await context.supabase.rpc("admin_has_permission", { p_permission:"media.manage" });
    if (!mediaPermission.error && mediaPermission.data) {
      for (const row of media.data ?? []) results.push({ id:"media:"+row.id, title:row.filename, subtitle:row.kind+" · "+row.mime_type, type:"Asset", target:"media", entity_id:row.id });
    }

    const q = needle.toLowerCase();
    const rank = (item: (typeof results)[number]) => {
      const title = item.title.toLowerCase();
      return title === q ? 0 : title.startsWith(q) ? 1 : title.includes(q) ? 2 : 3;
    };
    results.sort((a,b) => rank(a)-rank(b) || a.title.localeCompare(b.title));
    return { ok:true, results:results.slice(0,data.limit) };
  });

export const getAdminAuditLogPhase4 = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => AuditRangeSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "system.audit.read");
    let query = context.supabase.from("admin_audit_log")
      .select("id,actor_user_id,actor_email,action,entity_type,entity_id,entity_label,before_data,after_data,metadata,created_at")
      .order("created_at", { ascending:false }).limit(data.limit);
    if (data.action) query = query.eq("action", data.action);
    if (data.entity_type) query = query.eq("entity_type", data.entity_type);
    if (data.since) query = query.gte("created_at", data.since);
    if (data.until) query = query.lte("created_at", data.until);
    if (data.search) {
      const needle = data.search.normalize("NFKC").replace(/[^\p{L}\p{N}\s@._-]/gu, "").trim();
      if (needle) query = query.or("entity_label.ilike.%"+needle+"%,entity_id.ilike.%"+needle+"%,actor_email.ilike.%"+needle+"%");
    }
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return { ok:true, rows:rows ?? [] };
  });

export const restoreAdminAuditState = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => RestoreAuditSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const result = await context.supabase.rpc("admin_restore_audit_state", {
      p_entity_type:data.entity_type,
      p_entity_id:data.entity_id,
      p_snapshot:data.snapshot as never,
      p_audit_id:data.id,
    });
    if (result.error) throw new Error(result.error.message);
    return { ok:true, result:result.data };
  });

export const getAdminSystemHealth = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(() => ({}))
  .handler(async ({ context }) => {
    await assertPermission(context, "system.audit.read");
    const { data: db, error: dbError } = await context.supabase.rpc("admin_system_health_db");
    if (dbError) throw new Error(dbError.message);

    async function checkWithTimeout(input: RequestInfo | URL, init: RequestInit = {}) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4500);
      try {
        const response = await fetch(input, { ...init, signal: controller.signal, cache: "no-store" });
        return { ok:response.ok, status:response.status };
      } finally {
        clearTimeout(timer);
      }
    }

    const siteUrl = resolvePublicSiteUrl().replace(/\/$/, "");
    const [publicSite,resend,gemini] = await Promise.allSettled([
      checkWithTimeout(siteUrl,{method:"HEAD"}),
      process.env.RESEND_API_KEY ? checkWithTimeout("https://api.resend.com/domains",{headers:{Authorization:"Bearer "+process.env.RESEND_API_KEY}}) : Promise.resolve({ok:false,status:0}),
      process.env.GEMINI_API_KEY ? checkWithTimeout("https://generativelanguage.googleapis.com/v1beta/models",{headers:{"x-goog-api-key":process.env.GEMINI_API_KEY}}) : Promise.resolve({ok:false,status:0}),
    ]);
    const resultOf = (item: PromiseSettledResult<{ok:boolean;status:number}>) => item.status==="fulfilled" ? item.value : {ok:false,status:0};
    const siteCheck=resultOf(publicSite), resendCheck=resultOf(resend), geminiCheck=resultOf(gemini);
    const vercelConfigured=process.env.VERCEL==="1" || Boolean(process.env.VERCEL_URL);

    return {
      ok:true,
      checked_at:new Date().toISOString(),
      database:db,
      providers:{
        public_site:{status:siteCheck.ok?"healthy":"error",url:siteUrl,http_status:siteCheck.status},
        vercel:{status:vercelConfigured?"healthy":"warning",environment:process.env.VERCEL_ENV ?? "local",commit:process.env.VERCEL_GIT_COMMIT_SHA ?? null,deployment_url:process.env.VERCEL_URL ? "https://"+process.env.VERCEL_URL : null},
        resend:{status:!process.env.RESEND_API_KEY?"warning":resendCheck.ok?"healthy":"error",configured:Boolean(process.env.RESEND_API_KEY),http_status:resendCheck.status},
        gemini:{status:!process.env.GEMINI_API_KEY?"warning":geminiCheck.ok?"healthy":"error",configured:Boolean(process.env.GEMINI_API_KEY),http_status:geminiCheck.status},
      },
      recovery:{
        rpo_hours:24,
        rto_hours:4,
        content_versioning:Number((db as any)?.versioning?.versions ?? 0)>0?"ready":"warning",
        audit_immutability:Number((db as any)?.audit?.events ?? 0)>0?"ready":"warning",
        deployment_rollback:vercelConfigured?"ready":"external",
        database_backup:"provider-managed / external validation",
      },
    };
  });
