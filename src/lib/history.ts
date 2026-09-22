// Backwards-compatible helpers for the Admin history surface.
// Phase 1 moves authoritative writes and restores through server functions and
// database triggers. These helpers remain for non-admin callers that still
// import the module.
import { supabase } from "@/integrations/supabase/client";
import { isUuid } from "@/lib/utils";

export type EntityType =
  | "site_settings"
  | "projects"
  | "clients"
  | "services"
  | "stats"
  | "about_method";

const ENTITY_TABLES = new Set<EntityType>([
  "site_settings",
  "projects",
  "clients",
  "services",
  "stats",
  "about_method",
]);

export async function snapshotBefore(
  entity: EntityType,
  entityId: string,
  label?: string,
): Promise<void> {
  try {
    if (!ENTITY_TABLES.has(entity)) return;

    let snapshot: Record<string, unknown> | null = null;
    if (entity === "site_settings") {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", entityId)
        .maybeSingle();
      if (data) snapshot = (data.value as Record<string, unknown>) ?? {};
    } else {
      if (!isUuid(entityId)) return;
      const { data } = await supabase
        .from(entity)
        .select("*")
        .eq("id", entityId)
        .maybeSingle();
      if (data) snapshot = data as Record<string, unknown>;
    }

    if (!snapshot) return;

    await supabase.from("content_history").insert({
      entity_type: entity,
      entity_id: entityId,
      snapshot: snapshot as never,
      label: label ?? null,
      action: "legacy",
    });
  } catch (error) {
    console.warn("snapshotBefore failed", error);
  }
}

export async function restoreSnapshot(
  entity: EntityType,
  entityId: string,
  snapshot: Record<string, unknown>,
): Promise<{ error: string | null }> {
  try {
    if (entity === "site_settings") {
      const { error } = await supabase
        .from("site_settings")
        .upsert(
          {
            key: entityId,
            value: snapshot as never,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" },
        );
      return { error: error?.message ?? null };
    }

    if (!isUuid(entityId) || !ENTITY_TABLES.has(entity)) {
      return { error: "Cannot restore item: invalid identifier." };
    }

    const cleaned = { ...snapshot, id: entityId };
    delete cleaned.created_at;
    delete cleaned.updated_at;

    const { error } = await supabase
      .from(entity)
      .upsert({ ...cleaned, updated_at: new Date().toISOString() } as never, {
        onConflict: "id",
      });
    return { error: error?.message ?? null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Restore failed." };
  }
}
