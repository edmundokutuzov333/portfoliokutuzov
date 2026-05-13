// Helpers for snapshotting + rolling back content edits.
// We capture the CURRENT row before an admin write, so the history reflects
// "what it was before this change". The trigger keeps the last 5 versions.
import { supabase } from "@/integrations/supabase/client";

export type EntityType = "site_settings" | "projects" | "clients";

/** Fetch the current row and store a snapshot in content_history. Best-effort: errors are logged only. */
export async function snapshotBefore(
  entity: EntityType,
  entityId: string,
  label?: string,
): Promise<void> {
  try {
    let snapshot: Record<string, unknown> | null = null;

    if (entity === "site_settings") {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", entityId)
        .maybeSingle();
      // Only snapshot if a row already existed.
      if (data) snapshot = (data.value as Record<string, unknown>) ?? {};
    } else {
      const { data } = await supabase.from(entity).select("*").eq("id", entityId).maybeSingle();
      if (data) snapshot = data as Record<string, unknown>;
    }

    if (!snapshot) return;

    await supabase.from("content_history").insert({
      entity_type: entity,
      entity_id: entityId,
      snapshot: snapshot as never,
      label: label ?? null,
    });
  } catch (e) {
    // Non-blocking - rollback should never break a save.
    console.warn("snapshotBefore failed", e);
  }
}

/** Apply a previously stored snapshot back onto its source row. */
export async function restoreSnapshot(
  entity: EntityType,
  entityId: string,
  snapshot: Record<string, unknown>,
): Promise<{ error: string | null }> {
  if (entity === "site_settings") {
    const { error } = await supabase
      .from("site_settings")
      .upsert([{ key: entityId, value: snapshot as never, updated_at: new Date().toISOString() }], {
        onConflict: "key",
      });
    return { error: error?.message ?? null };
  }

  // For projects/clients, drop server-managed fields before restore.
  const cleaned: Record<string, unknown> = { ...snapshot };
  delete cleaned.created_at;
  delete cleaned.updated_at;

  const { error } = await supabase
    .from(entity)
    .update({ ...cleaned, updated_at: new Date().toISOString() } as never)
    .eq("id", entityId);
  return { error: error?.message ?? null };
}
