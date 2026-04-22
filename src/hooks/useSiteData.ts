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

// ---------- settings ----------
export function useSiteSettings() {
  const qc = useQueryClient();
  useEffect(() => {
    const ch = supabase
      .channel("rt-site_settings")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, () => {
        qc.invalidateQueries({ queryKey: ["site_settings"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);

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
  const qc = useQueryClient();
  useEffect(() => {
    const ch = supabase
      .channel("rt-clients")
      .on("postgres_changes", { event: "*", schema: "public", table: "clients" }, () => {
        qc.invalidateQueries({ queryKey: ["clients"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);
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
  const qc = useQueryClient();
  useEffect(() => {
    const ch = supabase
      .channel("rt-projects")
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () => {
        qc.invalidateQueries({ queryKey: ["projects"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);
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
