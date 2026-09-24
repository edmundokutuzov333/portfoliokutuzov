import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import { runAiKnowledgeReindex } from "@/lib/ai/rag-index.functions";

export type AdminPermission =
  | "content.read"
  | "content.write"
  | "media.manage"
  | "leads.read"
  | "leads.write"
  | "finance.read"
  | "finance.write"
  | "system.audit.read"
  | "system.users.manage";

const PermissionSchema = z.enum([
  "content.read",
  "content.write",
  "media.manage",
  "leads.read",
  "leads.write",
  "finance.read",
  "finance.write",
  "system.audit.read",
  "system.users.manage",
]);

async function assertPermission(
  context: { supabase: SupabaseClient<Database> },
  permission: AdminPermission,
) {
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
  rows: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(240),
        client_name: z.string().trim().max(200).nullable().optional(),
        category: z.string().trim().min(1).max(100),
        year: z.string().trim().max(20).nullable().optional(),
        sort_order: z.number().int().min(-100000).max(100000),
      }),
    )
    .min(1)
    .max(10),
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

const MediaUploadSchema = z.object({
  entity_id: z.string().uuid(),
  kind: z.enum(["logo", "cover", "gallery", "video", "library"]),
  filename: z.string().trim().min(1).max(240),
  content_type: z.string().trim().max(120),
  size_bytes: z.number().int().positive().max(200 * 1024 * 1024),
});

const MEDIA_MIME_ALLOWLIST = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/avif",
  "application/pdf",
  "video/mp4",
  "video/webm",
  "video/ogg",
]);

function safeMediaName(filename: string) {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 160);
}

export const prepareAdminMediaUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => MediaUploadSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "media.manage");
    if (!MEDIA_MIME_ALLOWLIST.has(data.content_type)) {
      throw new Error("Unsupported media type");
    }

    const prefix =
      data.kind === "logo" ? "logos" : data.kind === "library" ? "library" : "projects";
    const filename = safeMediaName(data.filename);
    const path = `${prefix}/${data.entity_id}-${data.kind}-${Date.now()}-${filename}`;

    const { data: signed, error } = await context.supabase.storage
      .from("site-assets")
      .createSignedUploadUrl(path);

    if (error || !signed?.token) {
      throw new Error(error?.message ?? "Could not prepare media upload");
    }

    const { data: publicData } = context.supabase.storage
      .from("site-assets")
      .getPublicUrl(path);

    return {
      ok: true,
      path,
      token: signed.token,
      publicUrl: publicData.publicUrl,
    };
  });

const ServiceSchema = z.object({
  id: z.string().uuid().optional(),
  number: z.string().trim().max(40).nullable().optional(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).nullable().optional(),
  icon: z.string().trim().max(100).nullable().optional(),
  sort_order: z.number().int().min(-100000).max(100000),
  is_active: z.boolean(),
});

const StatSchema = z.object({
  id: z.string().uuid().optional(),
  value: z.string().trim().min(1).max(80),
  label: z.string().trim().min(1).max(120),
  sort_order: z.number().int().min(-100000).max(100000),
  is_active: z.boolean(),
});

const MethodSchema = z.object({
  id: z.string().uuid().optional(),
  number: z.string().trim().min(1).max(40),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).nullable().optional(),
  sort_order: z.number().int().min(-100000).max(100000),
  is_active: z.boolean(),
});

const StructuredReorderSchema = z.object({
  ids: z.array(z.string().uuid()).max(200),
});

const FeaturedSchema = z.object({
  id: z.string().uuid(),
  featured: z.boolean(),
  featured_priority: z.number().int().min(-100000).max(100000),
});

const MediaAssetSchema = z.object({
  id: z.string().uuid(),
  storage_path: z.string().trim().min(1).max(500),
  public_url: z.string().url(),
  filename: z.string().trim().min(1).max(240),
  mime_type: z.string().trim().min(1).max(120),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  size_bytes: z.number().int().positive().max(200 * 1024 * 1024),
  kind: z.enum(["image", "video", "logo", "document"]),
  alt_text: z.string().trim().max(500).nullable().optional(),
  entity_type: z.string().trim().max(120).nullable().optional(),
  entity_id: z.string().trim().max(160).nullable().optional(),
  is_public: z.boolean(),
  dominant_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).nullable().optional(),
  optimized_webp_path: z.string().trim().max(500).nullable().optional(),
  optimized_webp_url: z.string().url().nullable().optional(),
  optimized_avif_path: z.string().trim().max(500).nullable().optional(),
  optimized_avif_url: z.string().url().nullable().optional(),
  optimized_width: z.number().int().positive().nullable().optional(),
  optimized_height: z.number().int().positive().nullable().optional(),
});

const MediaQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
  kind: z.enum(["image", "video", "logo", "document", "all"]).default("all"),
});

export const saveAdminService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => ServiceSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    return saveAdminEntityDraft(
      context,
      "services",
      data.id ?? "",
      data.title,
      data as unknown as Record<string, unknown>,
    );
  });

export const createAdminService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) =>
    ServiceSchema.omit({ id: true }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const { data: row, error } = await context.supabase
      .from("services")
      .insert({ ...data, is_active: false })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const deleteAdminService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => IdSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const { error } = await context.supabase.from("services").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const duplicateAdminService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => IdSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const { data: source, error: readError } = await context.supabase
      .from("services")
      .select("*")
      .eq("id", data.id)
      .single();
    if (readError || !source) throw new Error(readError?.message ?? "Service not found");
    const { data: row, error } = await context.supabase
      .from("services")
      .insert({
        number: source.number ? `${source.number} copy` : null,
        title: `${source.title} (copy)`,
        description: source.description,
        icon: source.icon,
        sort_order: Number(source.sort_order ?? 0) + 1,
        is_active: false,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const reorderAdminServices = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => StructuredReorderSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const { data: ok, error } = await context.supabase.rpc("admin_reorder_services", {
      p_ids: data.ids,
    });
    if (error) throw new Error(error.message);
    if (!ok) throw new Error("Service reorder failed");
    return { ok: true };
  });

export const saveAdminStat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => StatSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    return saveAdminEntityDraft(
      context,
      "stats",
      data.id ?? "",
      data.label,
      data as unknown as Record<string, unknown>,
    );
  });

export const createAdminStat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => StatSchema.omit({ id: true }).parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const { data: row, error } = await context.supabase
      .from("stats")
      .insert({ ...data, is_active: false })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const deleteAdminStat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => IdSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const { error } = await context.supabase.from("stats").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reorderAdminStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => StructuredReorderSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const { data: ok, error } = await context.supabase.rpc("admin_reorder_stats", { p_ids: data.ids });
    if (error) throw new Error(error.message);
    if (!ok) throw new Error("Stats reorder failed");
    return { ok: true };
  });

export const saveAdminMethod = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => MethodSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    return saveAdminEntityDraft(
      context,
      "about_method",
      data.id ?? "",
      data.title,
      data as unknown as Record<string, unknown>,
    );
  });

export const createAdminMethod = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => MethodSchema.omit({ id: true }).parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const { data: row, error } = await context.supabase
      .from("about_method")
      .insert({ ...data, is_active: false })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const deleteAdminMethod = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => IdSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const { error } = await context.supabase.from("about_method").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reorderAdminMethods = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => StructuredReorderSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const { data: ok, error } = await context.supabase.rpc("admin_reorder_about_method", { p_ids: data.ids });
    if (error) throw new Error(error.message);
    if (!ok) throw new Error("Method reorder failed");
    return { ok: true };
  });

export const setAdminProjectFeatured = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => FeaturedSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");

    const { data: row, error } = await context.supabase
      .from("projects")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error || !row) throw new Error(error?.message ?? "Project not found");

    if (data.featured) {
      const [{ data: liveFeatured, error: liveError }, { data: activeDrafts, error: draftError }] =
        await Promise.all([
          context.supabase.from("projects").select("id").eq("featured", true),
          context.supabase
            .from("admin_drafts")
            .select("entity_id,payload,status")
            .eq("entity_type", "projects")
            .in("status", ["draft", "review"]),
        ]);
      if (liveError) throw new Error(liveError.message);
      if (draftError) throw new Error(draftError.message);

      const effective = new Map<string, boolean>(
        (liveFeatured ?? []).map((project) => [project.id, true]),
      );
      for (const draft of activeDrafts ?? []) {
        const draftFeatured =
          typeof draft.payload === "object" &&
          draft.payload !== null &&
          "featured" in draft.payload
            ? Boolean((draft.payload as Record<string, unknown>).featured)
            : undefined;
        if (draftFeatured !== undefined) effective.set(draft.entity_id, draftFeatured);
      }
      effective.set(data.id, true);
      const count = Array.from(effective.values()).filter(Boolean).length;
      if (count > 3) {
        throw new Error("Featured Work allows a maximum of 3 projects including staged drafts.");
      }
    }

    return saveAdminEntityDraft(
      context,
      "projects",
      data.id,
      row.title,
      {
        featured: data.featured,
        featured_priority: data.featured ? Math.max(1, data.featured_priority) : 0,
      },
    );
  });

export const listAdminMediaAssets = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => MediaQuerySchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "media.manage");
    let query = context.supabase
      .from("media_assets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (data.kind !== "all") query = query.eq("kind", data.kind);
    if (data.search) {
      const needle = data.search.replace(/[^\p{L}\p{N}\s._-]/gu, "").trim();
      if (needle) query = query.ilike("filename", `%${needle}%`);
    }
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return { ok: true, rows: rows ?? [] };
  });

export const createAdminMediaAsset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => MediaAssetSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "media.manage");
    const { data: row, error } = await context.supabase
      .from("media_assets")
      .insert({
        id: data.id,
        storage_path: data.storage_path,
        public_url: data.public_url,
        filename: data.filename,
        mime_type: data.mime_type,
        width: data.width ?? null,
        height: data.height ?? null,
        size_bytes: data.size_bytes,
        kind: data.kind,
        alt_text: data.alt_text ?? null,
        entity_type: data.entity_type ?? null,
        entity_id: data.entity_id ?? null,
        is_public: data.is_public,
      } as never)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const deleteAdminMediaAsset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => IdSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "media.manage");
    const { data: asset, error: readError } = await context.supabase
      .from("media_assets")
      .select("storage_path,entity_type,entity_id,filename")
      .eq("id", data.id)
      .single();
    if (readError || !asset) throw new Error(readError?.message ?? "Media asset not found");

    if (asset.entity_id || asset.entity_type) {
      throw new Response(
        "This asset is linked to public content. Replace it instead of deleting it.",
        { status: 409 },
      );
    }

    const { error: deleteError } = await context.supabase
      .from("media_assets")
      .delete()
      .eq("id", data.id)
      .is("entity_id", null)
      .is("entity_type", null);
    if (deleteError) throw new Error(deleteError.message);

    const { error: storageError } = await context.supabase.storage
      .from("site-assets")
      .remove([asset.storage_path]);
    if (storageError) {
      throw new Error(
        "Asset registry entry was removed, but physical storage cleanup failed: " +
          storageError.message,
      );
    }

    return { ok: true, filename: asset.filename };
  });

export const saveAdminSiteSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => SiteSettingSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    if (data.key === "invoice_settings") {
      await assertPermission(context, "finance.write");
    }
    const result = await saveAdminEntityDraft(
      context,
      "site_settings",
      data.key,
      data.key,
      data.value,
    );
    return { ...result, row: { key: data.key, value: data.value } };
  });

export const saveAdminClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => ClientSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    return saveAdminEntityDraft(
      context,
      "clients",
      data.id ?? "",
      data.name,
      data as unknown as Record<string, unknown>,
    );
  });

export const createAdminClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) =>
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
      .insert({ ...data, is_active: false })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, row };
  });

export const deleteAdminClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => IdSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const { error } = await context.supabase.from("clients").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

async function saveAdminEntityDraft(
  context: { supabase: SupabaseClient<Database> },
  entity_type: "site_settings" | "projects" | "clients" | "services" | "stats" | "about_method",
  entity_id: string,
  label: string,
  payload: Record<string, unknown>,
) {
  await assertPermission(context, "content.write");
  if (entity_type === "site_settings" && entity_id === "invoice_settings") {
    await assertPermission(context, "finance.write");
  }
  if (entity_type !== "site_settings" && !z.string().uuid().safeParse(entity_id).success) {
    throw new Error("A valid entity id is required before saving this content.");
  }

  const { data: live, error: liveError } =
    entity_type === "site_settings"
      ? await context.supabase
          .from("site_settings")
          .select("key,value,updated_at")
          .eq("key", entity_id)
          .maybeSingle()
      : entity_type === "projects"
        ? await context.supabase.from("projects").select("*").eq("id", entity_id).single()
        : entity_type === "clients"
          ? await context.supabase.from("clients").select("*").eq("id", entity_id).single()
          : entity_type === "services"
            ? await context.supabase.from("services").select("*").eq("id", entity_id).single()
            : entity_type === "stats"
              ? await context.supabase.from("stats").select("*").eq("id", entity_id).single()
              : await context.supabase.from("about_method").select("*").eq("id", entity_id).single();

  if (liveError && liveError.code !== "PGRST116") throw new Error(liveError.message);

  const liveSnapshot =
    entity_type === "site_settings"
      ? ((live?.value ?? {}) as Record<string, unknown>)
      : ((live ?? {}) as unknown as Record<string, unknown>);
  const liveUpdatedAt = live?.updated_at ?? null;
  const userId = (await context.supabase.auth.getUser()).data.user?.id ?? null;

  const { data: existingDraft, error: draftReadError } = await context.supabase
    .from("admin_drafts")
    .select("*")
    .eq("entity_type", entity_type)
    .eq("entity_id", entity_id)
    .in("status", ["draft", "review"])
    .maybeSingle();
  if (draftReadError) throw new Error(draftReadError.message);
  if (existingDraft?.status === "review") {
    throw new Response(
      "This content is currently under review. Edit or publish it from Release Management.",
      { status: 409 },
    );
  }

  if (existingDraft?.id) {
    const { data: row, error: updateError } = await context.supabase
      .from("admin_drafts")
      .update({
        label,
        payload: { ...(existingDraft.payload as Record<string, unknown>), ...payload },
        status: "draft",
        updated_by: userId,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", existingDraft.id)
      .select("*")
      .single();
    if (updateError || !row) throw new Error(updateError?.message ?? "Could not save editorial draft");
    return { ok: true, draft: row, published: false as const };
  }

  const { data: row, error: createError } = await context.supabase
    .from("admin_drafts")
    .insert({
      entity_type,
      entity_id,
      label,
      payload: { ...liveSnapshot, ...payload },
      baseline_snapshot: liveSnapshot,
      baseline_updated_at: liveUpdatedAt,
      status: "draft",
      created_by: userId,
      updated_by: userId,
    } as never)
    .select("*")
    .single();
  if (createError || !row) throw new Error(createError?.message ?? "Could not create editorial draft");
  return { ok: true, draft: row, published: false as const };
}

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
  .validator((i: unknown) => ProjectSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    return saveAdminEntityDraft(
      context,
      "projects",
      data.id ?? "",
      data.title,
      projectPayload(data, data.id) as Record<string, unknown>,
    );
  });

export const createAdminProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => CreateProjectSchema.parse(i))
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
  .validator((i: unknown) => IdSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const { error } = await context.supabase.from("projects").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const duplicateAdminProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => IdSchema.parse(i))
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
  .validator(z.object({ id: z.string().uuid(), is_published: z.boolean() }))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.write");
    const { data: source, error: sourceError } = await context.supabase
      .from("projects")
      .select("*")
      .eq("id", data.id)
      .single();
    if (sourceError || !source) throw new Error(sourceError?.message ?? "Project not found");
    const saved = await saveAdminEntityDraft(
      context,
      "projects",
      data.id,
      source.title,
      { ...(source as unknown as Record<string, unknown>), is_published: data.is_published },
    );
    const { data: published, error: publishError } = await context.supabase.rpc("admin_publish_drafts", {
      p_draft_ids: [saved.draft.id],
      p_publish_note: data.is_published ? "Published from portfolio control" : "Unpublished from portfolio control",
    });
    if (publishError) throw new Error(publishError.message);
    if (process.env.AI_RAG_ENABLED === "true") {
      void runAiKnowledgeReindex("en").catch((reindexError) => {
        console.error("[AI RAG] publish reindex failed", reindexError);
      });
    }
    return { ok: true, draft: saved.draft, published: published ?? [] };
  });

export const createAdminProjectsBatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => BatchProjectSchema.parse(i))
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
  .validator((i: unknown) => ReorderSchema.parse(i))
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
  .validator((i: unknown) => RestoreSchema.parse(i))
  .handler(async ({ data, context }) => {
    const result = await saveAdminEntityDraft(
      context,
      data.entity_type,
      data.entity_id,
      `Restore: ${data.entity_id}`,
      data.snapshot,
    );
    return {
      ok: true,
      draft: result.draft,
      published: false as const,
    };
  });



const MediaReplaceSchema = z.object({
  id: z.string().uuid(),
  storage_path: z.string().trim().min(1).max(500),
  public_url: z.string().url(),
  filename: z.string().trim().min(1).max(240),
  mime_type: z.string().trim().min(1).max(120),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  size_bytes: z.number().int().positive().max(200 * 1024 * 1024),
  dominant_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).nullable().optional(),
  optimized_webp_path: z.string().trim().max(500).nullable().optional(),
  optimized_webp_url: z.string().url().nullable().optional(),
  optimized_avif_path: z.string().trim().max(500).nullable().optional(),
  optimized_avif_url: z.string().url().nullable().optional(),
  optimized_width: z.number().int().positive().nullable().optional(),
  optimized_height: z.number().int().positive().nullable().optional(),
});

export const replaceAdminMediaAsset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => MediaReplaceSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "media.manage");
    const { data: oldAsset, error: readError } = await context.supabase
      .from("media_assets")
      .select("storage_path")
      .eq("id", data.id)
      .single();

    if (readError || !oldAsset) {
      throw new Error(readError?.message ?? "Media asset not found");
    }

    const { error } = await context.supabase
      .from("media_assets")
      .update({
        storage_path: data.storage_path,
        public_url: data.public_url,
        filename: data.filename,
        mime_type: data.mime_type,
        width: data.width ?? null,
        height: data.height ?? null,
        size_bytes: data.size_bytes,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", data.id);

    if (error) {
      await context.supabase.storage.from("site-assets").remove([data.storage_path]);
      throw new Error(error.message);
    }

    if (oldAsset.storage_path !== data.storage_path) {
      const { error: storageError } = await context.supabase.storage
        .from("site-assets")
        .remove([oldAsset.storage_path]);
      if (storageError) {
        throw new Error(storageError.message);
      }
    }

    return { ok: true };
  });

export const getAdminAuditLog = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => AuditSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "system.audit.read");
    let query = context.supabase
      .from("admin_audit_log")
      .select(
        "id,actor_user_id,actor_email,action,entity_type,entity_id,entity_label,before_data,after_data,metadata,created_at",
      )
      .order("created_at", { ascending: false })
      .limit(data.limit);

    if (data.action) query = query.eq("action", data.action);
    if (data.entity_type) query = query.eq("entity_type", data.entity_type);
    if (data.search) {
      const needle = data.search
        .normalize("NFKC")
        .replace(/[^\p{L}\p{N}\s@._-]/gu, "")
        .trim();
      if (needle) {
        query = query.or(
          `entity_label.ilike.%${needle}%,entity_id.ilike.%${needle}%,actor_email.ilike.%${needle}%`,
        );
      }
    }

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return { ok: true, rows: rows ?? [] };
  });

export const getAdminPermissions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => PermissionSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertPermission(context, "content.read");
    const { data: allowed, error } = await context.supabase.rpc("admin_has_permission", {
      p_permission: data,
    });
    if (error) throw new Error(error.message);
    return { permission: data, allowed: Boolean(allowed) };
  });
