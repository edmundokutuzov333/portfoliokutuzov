import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type AdminPermission =
  | "content.read"
  | "content.write"
  | "media.manage"
  | "leads.read"
  | "leads.write"
  | "finance.read"
  | "finance.write"
  | "system.audit.read";

const PermissionSchema = z.enum([
  "content.read",
  "content.write",
  "media.manage",
  "leads.read",
  "leads.write",
  "finance.read",
  "finance.write",
  "system.audit.read",
]);

async function assertPermission(context: { supabase: any }, permission: AdminPermission) {
  const { data, error } = await context.supabase.rpc("admin_has_permission", {
    p_permission: permission,
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Response("Forbidden", { status: 403 });
}

const SiteSettingSchema = z.object({
  key: z.string().trim().min(1).max(80),
  value: z.record(z.string(), z.unknown()).refine((value) => Object.keys(value).length <= 100),
});

const ClientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(200),
  logo_url: z.string().url().nullable().optional(),
  website_url: z.string().url().nullable().optional(),
  logo_width: z.number().int().positive().nullable().optional(),
  logo_height: z.number().int().positive().nullable().optional(),
  sort_order: z.number().int().min(-100000).max(100000),
  is_active: z.boolean(),
  kind: z.enum(["client", "studio"]),
});

const IdSchema = z.object({ id: z.string().uuid() });

const ProjectSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(240),
  subtitle: z.string().nullable().optional(),
  category: z.string().trim().min(1).max(100),
  year: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  cover_url: z.string().url().nullable().optional(),
  cover_width: z.number().int().positive().nullable().optional(),
  cover_height: z.number().int().positive().nullable().optional(),
  palette: z.string().nullable().optional(),
  span: z.enum(["normal", "wide", "tall"]).nullable().optional(),
  sort_order: z.number().int().min(-100000).max(100000),
  tags: z.array(z.string().trim().min(1).max(80)).max(100),
  gallery: z.array(z.string().url()).max(100),
  gallery_meta: z.array(z.record(z.string(), z.unknown())).max(100),
  is_published: z.boolean(),
  featured: z.boolean(),
  featured_priority: z.number().int().min(-100000).max(100000),
  client_name: z.string().nullable().optional(),
  image_fit: z.enum(["contain", "cover"]).default("contain"),
  concept: z.string().nullable().optional(),
  idea: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  collaborators: z.array(z.string().trim().min(1).max(160)).max(100),
  tools_used: z.array(z.string().trim().min(1).max(80)).max(100),
  deliverables: z.array(z.string().trim().min(1).max(160)).max(100),
  video_url: z.string().url().nullable().optional(),
  video_provider: z.enum(["youtube", "vimeo", "file"]).nullable().optional(),
});

const CreateProjectSchema = z.object({
  title: z.string().trim().min(1).max(240),
  category: z.string().trim().min(1).max(100),
  sort_order: z.number().int().min(-100000).max(100000),
});

const BatchProjectSchema = z.object({
  rows: z.array(
    z.object({
      title: z.string().trim().min(1).max(240),
      client_name: z.string().trim().max(200).nullable().optional(),
      category: z.string().trim().min(1).max(100),
      year: z.string().trim().max(20).nullable().optional(),
      sort_order: z.number().int().min(-100000).max(100000),
    }),
  ).min(1).max(10),
});

const ReorderSchema = z.object({
  project_id: z.string().uuid(),
  other_project_id: z.string().uuid(),
  project_order: z.number().int().min(-100000).max(100000),
  other_order: z.number().int().min(-100000).max(100000),
});

const RestoreSchema = z.object({
  entity_type: z.enum([
    "site_settings",
    "projects",
    "clients",
    "services",
    "stats",
    "about_method",
  ]),
  entity_id: z.string().min(1).max(160),
  snapshot: z.record(z.string(), z.unknown()),
});

const AuditSchema = z.object({
  limit: z.number().int().min(1).max(200).default(100),
  action: z.enum(["create", "update", "delete"]).optional(),
  entity_type: z.string().trim().min(1).max(80).optional(),
  search: z.string().trim().max(120).optional(),
});

export const saveAdminSiteSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => SiteSettingSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const payload = {
      key: data.key,
      value: data.value,
      updated_at: new Date().toISOString(),
    };
    const { data: row, error } = await context.supabase
      .from("site_settings")
      .upsert(payload as never, { onConflict: "key" })
      .select("key,value,updated_at")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const saveAdminClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ClientSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const payload = {
      ...data,
      id: data.id,
      logo_url: data.logo_url ?? null,
      website_url: data.website_url ?? null,
      logo_width: data.logo_width ?? null,
      logo_height: data.logo_height ?? null,
      updated_at: new Date().toISOString(),
    };
    const { data: row, error } = await context.supabase
      .from("clients")
      .upsert(payload as never, { onConflict: "id" })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const createAdminClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    ClientSchema.pick({
      name: true,
      sort_order: true,
      is_active: true,
      kind: true,
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const { data: row, error } = await context.supabase
      .from("clients")
      .insert(data)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const deleteAdminClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => IdSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const { error } = await context.supabase.from("clients").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

function projectPayload(data: z.infer<typeof ProjectSchema>, id?: string) {
  return {
    id,
    title: data.title,
    subtitle: data.subtitle ?? null,
    category: data.category,
    year: data.year ?? null,
    description: data.description ?? null,
    cover_url: data.cover_url ?? null,
    cover_width: data.cover_width ?? null,
    cover_height: data.cover_height ?? null,
    palette: data.palette ?? null,
    span: data.span ?? null,
    sort_order: data.sort_order,
    tags: data.tags,
    gallery: data.gallery,
    gallery_meta: data.gallery_meta,
    is_published: data.is_published,
    featured: data.featured,
    featured_priority: data.featured_priority,
    client_name: data.client_name ?? null,
    image_fit: data.image_fit ?? "contain",
    concept: data.concept ?? null,
    idea: data.idea ?? null,
    role: data.role ?? null,
    notes: data.notes ?? null,
    collaborators: data.collaborators,
    tools_used: data.tools_used,
    deliverables: data.deliverables,
    video_url: data.video_url ?? null,
    video_provider: data.video_provider ?? null,
    updated_at: new Date().toISOString(),
  };
}

export const saveAdminProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ProjectSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const payload = projectPayload(data, data.id);
    const { data: row, error } = await context.supabase
      .from("projects")
      .upsert(payload as never, { onConflict: "id" })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const createAdminProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => CreateProjectSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const { data: row, error } = await context.supabase
      .from("projects")
      .insert({
        title: data.title,
        category: data.category,
        sort_order: data.sort_order,
        is_published: false,
        featured: false,
        featured_priority: 0,
        tags: [],
        gallery: [],
        gallery_meta: [],
        collaborators: [],
        tools_used: [],
        deliverables: [],
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const deleteAdminProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => IdSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const { error } = await context.supabase.from("projects").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const duplicateAdminProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => IdSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const { data: source, error: readError } = await context.supabase
      .from("projects")
      .select("*")
      .eq("id", data.id)
      .single();
    if (readError || !source) throw new Error(readError?.message ?? "Project not found");
    const copy = {
      ...source,
      id: undefined,
      title: `${source.title} (copy)`,
      sort_order: Number(source.sort_order ?? 0) + 1,
      is_published: false,
      featured: false,
      featured_priority: 0,
      updated_at: new Date().toISOString(),
    };
    delete (copy as { id?: string }).id;
    const { data: row, error } = await context.supabase
      .from("projects")
      .insert(copy)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const publishAdminProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid(), is_published: z.boolean() }))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const { data: row, error } = await context.supabase
      .from("projects")
      .update({ is_published: data.is_published, updated_at: new Date().toISOString() })
      .eq("id", data.id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const createAdminProjectsBatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => BatchProjectSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const rows = data.rows.map((row) => ({
      title: row.title,
      client_name: row.client_name ?? null,
      category: row.category,
      year: row.year ?? null,
      sort_order: row.sort_order,
      is_published: false,
      featured: false,
      featured_priority: 0,
      tags: [],
      gallery: [],
      gallery_meta: [],
      collaborators: [],
      tools_used: [],
      deliverables: [],
    }));
    const { data: inserted, error } = await context.supabase
      .from("projects")
      .insert(rows)
      .select("*");
    if (error) throw new Error(error.message);
    return { ok: true, rows: inserted ?? [] };
  });

export const reorderAdminProjects = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ReorderSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const { data: ok, error } = await context.supabase.rpc("admin_reorder_projects", {
      p_project_id: data.project_id,
      p_other_project_id: data.other_project_id,
      p_project_order: data.project_order,
      p_other_order: data.other_order,
    });
    if (error) throw new Error(error.message);
    if (!ok) throw new Error("Project reorder failed");
    return { ok: true };
  });

export const restoreAdminContentVersion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => RestoreSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    if (data.entity_type === "site_settings") {
      const { error } = await context.supabase
        .from("site_settings")
        .upsert(
          {
            key: data.entity_id,
            value: data.snapshot,
            updated_at: new Date().toISOString(),
          } as never,
          { onConflict: "key" },
        );
      if (error) throw new Error(error.message);
      return { ok: true };
    }

    const entityId = z.string().uuid().parse(data.entity_id);
    const cleaned = { ...data.snapshot };
    delete cleaned.created_at;
    delete cleaned.updated_at;
    cleaned.id = entityId;
    const table = data.entity_type;
    const { error } = await context.supabase
      .from(table)
      .upsert({ ...cleaned, updated_at: new Date().toISOString() } as never, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getAdminAuditLog = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => AuditSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "system.audit.read");
    let query = context.supabase
      .from("admin_audit_log")
      .select("id,actor_user_id,actor_email,action,entity_type,entity_id,entity_label,before_data,after_data,metadata,created_at")
      .order("created_at", { ascending: false })
      .limit(data.limit);

    if (data.action) query = query.eq("action", data.action);
    if (data.entity_type) query = query.eq("entity_type", data.entity_type);
    if (data.search) {
      const needle = data.search.replace(/[%_]/g, "");
      query = query.or(`entity_label.ilike.%${needle}%,entity_id.ilike.%${needle}%,actor_email.ilike.%${needle}%`);
    }

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return { ok: true, rows: rows ?? [] };
  });

export const getAdminPermissions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => PermissionSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.read");
    const { data: allowed, error } = await context.supabase.rpc("admin_has_permission", {
      p_permission: data,
    });
    if (error) throw new Error(error.message);
    return { permission: data, allowed: Boolean(allowed) };
  });
