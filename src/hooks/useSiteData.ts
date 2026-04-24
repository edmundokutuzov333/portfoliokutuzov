import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  DbClient,
  DbMethod,
  DbProject,
  DbService,
  DbStat,
  SiteSettings,
} from "@/lib/cms";

// Unique channel name per subscriber to avoid Supabase singleton-channel
// "cannot add postgres_changes callbacks ... after subscribe()" errors when
// the same hook mounts in multiple components simultaneously.
const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

function useRealtimeInvalidate(table: string, queryKey: unknown[]) {
  const qc = useQueryClient();
  useEffect(() => {
    const ch = supabase
      .channel(`rt-${table}-${uid()}`)
      .on(
        // @ts-expect-error - supabase-js typing for postgres_changes is loose
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => {
          qc.invalidateQueries({ queryKey });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qc, table]);
}

// ---------- settings ----------
export function useSiteSettings() {
  useRealtimeInvalidate("site_settings", ["site_settings"]);
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async (): Promise<SiteSettings> => {
      const { data, error } = await supabase.from("site_settings").select("key,value");
      if (error) throw error;
      const out: SiteSettings = {};
      for (const row of data ?? []) out[row.key] = (row.value as Record<string, unknown>) ?? {};
      return out;
    },
    staleTime: 30_000,
  });
}

// ---------- clients ----------
export function useClients(includeInactive = false) {
  useRealtimeInvalidate("clients", ["clients"]);
  return useQuery({
    queryKey: ["clients", includeInactive],
    queryFn: async (): Promise<DbClient[]> => {
      let q = supabase.from("clients").select("*").order("sort_order");
      if (!includeInactive) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as DbClient[];
    },
  });
}

// ---------- projects ----------
export function useProjects(includeUnpublished = false) {
  useRealtimeInvalidate("projects", ["projects"]);
  return useQuery({
    queryKey: ["projects", includeUnpublished],
    queryFn: async (): Promise<DbProject[]> => {
      let q = supabase.from("projects").select("*").order("sort_order");
      if (!includeUnpublished) q = q.eq("is_published", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map((p) => ({
        ...p,
        gallery: Array.isArray(p.gallery) ? (p.gallery as string[]) : [],
        tags: Array.isArray(p.tags) ? (p.tags as string[]) : [],
      })) as DbProject[];
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
