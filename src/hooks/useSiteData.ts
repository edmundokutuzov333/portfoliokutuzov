import { useEffect } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  normalizeCategory,
  type DbClient,
  type DbMethod,
  type DbProject,
  type DbService,
  type DbStat,
  type SiteSettings,
} from "@/lib/cms";

type RealtimeEntry = {
  channel: RealtimeChannel;
  listeners: Set<() => void>;
  references: number;
  removalTimer?: ReturnType<typeof setTimeout>;
};

const realtimeEntries = new Map<string, RealtimeEntry>();

function subscribeToTable(table: string, listener: () => void) {
  let entry = realtimeEntries.get(table);
  if (!entry) {
    const listeners = new Set<() => void>();
    const channel = supabase
      .channel(`public-${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => {
        listeners.forEach((notify) => notify());
      })
      .subscribe();
    entry = { channel, listeners, references: 0 };
    realtimeEntries.set(table, entry);
  }
  if (entry.removalTimer) clearTimeout(entry.removalTimer);
  entry.references += 1;
  entry.listeners.add(listener);

  return () => {
    const current = realtimeEntries.get(table);
    if (!current) return;
    current.listeners.delete(listener);
    current.references = Math.max(0, current.references - 1);
    if (current.references > 0) return;
    current.removalTimer = setTimeout(() => {
      const latest = realtimeEntries.get(table);
      if (!latest || latest.references > 0) return;
      realtimeEntries.delete(table);
      void supabase.removeChannel(latest.channel);
    }, 1_000);
  };
}

function useRealtimeInvalidate(table: string, queryKey: unknown[]) {
  const qc = useQueryClient();
  useEffect(() => {
    return subscribeToTable(table, () => {
      void qc.invalidateQueries({ queryKey });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qc, table]);
}

// ---------- settings ----------
export function useSiteSettings() {
  useRealtimeInvalidate("site_settings", ["site_settings"]);
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async ({ signal }): Promise<SiteSettings> => {
      const { data, error } = await supabase.from("site_settings").select("key,value").abortSignal(signal);
      if (error) throw error;
      const out: SiteSettings = {};
      for (const row of data ?? []) out[row.key] = (row.value as Record<string, unknown>) ?? {};
      return out;
    },
    staleTime: 30_000,
  });
}

// ---------- clients ----------
export function useClients(includeInactive = false, kind: string = "client") {
  useRealtimeInvalidate("clients", ["clients"]);
  return useQuery({
    queryKey: ["clients", includeInactive, kind],
    queryFn: async ({ signal }): Promise<DbClient[]> => {
      let q = supabase.from("clients").select("*").eq("kind", kind).order("sort_order");
      if (!includeInactive) q = q.eq("is_active", true);
      const { data, error } = await q.abortSignal(signal);
      if (error) throw error;
      return (data ?? []) as DbClient[];
    },
  });
}

// ---------- studios (same table, kind='studio') ----------
export function useStudios(includeInactive = false) {
  return useClients(includeInactive, "studio");
}

// ---------- projects ----------
export function useProjects(includeUnpublished = false) {
  useRealtimeInvalidate("projects", ["projects"]);
  return useQuery({
    queryKey: ["projects", includeUnpublished],
    queryFn: async ({ signal }): Promise<DbProject[]> => {
      let q = supabase.from("projects").select("*").order("sort_order");
      if (!includeUnpublished) q = q.eq("is_published", true);
      const { data, error } = await q.abortSignal(signal);
      if (error) throw error;
      return (data ?? []).map((p) => ({
        ...p,
        category: normalizeCategory(p.category),
        gallery: Array.isArray(p.gallery) ? (p.gallery as string[]) : [],
        tags: Array.isArray(p.tags) ? (p.tags as string[]) : [],
        collaborators: Array.isArray((p as { collaborators?: unknown }).collaborators)
          ? (p as { collaborators: string[] }).collaborators
          : [],
        tools_used: Array.isArray((p as { tools_used?: unknown }).tools_used)
          ? (p as { tools_used: string[] }).tools_used
          : [],
        deliverables: Array.isArray((p as { deliverables?: unknown }).deliverables)
          ? (p as { deliverables: string[] }).deliverables
          : [],
        gallery_meta: Array.isArray((p as { gallery_meta?: unknown }).gallery_meta)
          ? (p as unknown as { gallery_meta: DbProject["gallery_meta"] }).gallery_meta
          : [],
      })) as unknown as DbProject[];
    },
  });
}

// ---------- services ----------
export function useServices(includeInactive = false) {
  return useQuery({
    queryKey: ["services", includeInactive],
    queryFn: async (): Promise<DbService[]> => {
      let q = supabase.from("services").select("*").order("sort_order");
      if (!includeInactive) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as DbService[];
    },
  });
}

// ---------- stats ----------
export function useStats(includeInactive = false) {
  return useQuery({
    queryKey: ["stats", includeInactive],
    queryFn: async (): Promise<DbStat[]> => {
      let q = supabase.from("stats").select("*").order("sort_order");
      if (!includeInactive) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as DbStat[];
    },
  });
}

// ---------- about_method ----------
export function useMethod(includeInactive = false) {
  return useQuery({
    queryKey: ["about_method", includeInactive],
    queryFn: async (): Promise<DbMethod[]> => {
      let q = supabase.from("about_method").select("*").order("sort_order");
      if (!includeInactive) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as DbMethod[];
    },
  });
}
