import { useEffect } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  FALLBACK_SETTINGS,
  normalizeCategory,
  type DbClient,
  type DbMethod,
  type DbProject,
  type DbService,
  type DbStat,
  type SiteSettings,
} from "@/lib/cms";
import { projects as staticProjects } from "@/data/projects";
import { clients as staticClients } from "@/data/clients";
import { toDeterministicUuid } from "@/lib/utils";

const FALLBACK_PROJECTS: DbProject[] = staticProjects.map((p) => ({
  id: toDeterministicUuid("00000004", p.id),
  slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  title: p.title,
  subtitle: p.subtitle,
  category: normalizeCategory(p.category),
  year: p.year,
  description: p.description,
  cover_url: p.coverUrl ?? null,
  gallery: [],
  tags: p.tags ?? [],
  palette: p.palette,
  span: p.span ?? null,
  sort_order: p.id,
  is_published: true,
  featured: p.id <= 3,
  featured_priority: 4 - p.id,
  client_name: p.title,
}));

const FALLBACK_CLIENTS: DbClient[] = staticClients.map((name, index) => ({
  id: toDeterministicUuid("00000003", index + 1),
  name,
  logo_url: null,
  website_url: null,
  sort_order: index + 1,
  is_active: true,
  kind: "client",
}));

const FALLBACK_STUDIOS: DbClient[] = [
  {
    id: toDeterministicUuid("00000002", 1),
    name: "SPOT Comunicação",
    logo_url: null,
    website_url: null,
    sort_order: 1,
    is_active: true,
    kind: "studio",
  },
  {
    id: toDeterministicUuid("00000002", 2),
    name: "Ikigai Moçambique",
    logo_url: null,
    website_url: null,
    sort_order: 2,
    is_active: true,
    kind: "studio",
  },
  {
    id: toDeterministicUuid("00000002", 3),
    name: "Agência Creer",
    logo_url: null,
    website_url: null,
    sort_order: 3,
    is_active: true,
    kind: "studio",
  },
];

type RealtimeEntry = {
  channel: RealtimeChannel;
  listeners: Set<() => void>;
  references: number;
  removalTimer?: ReturnType<typeof setTimeout>;
};

const realtimeEntries = new Map<string, RealtimeEntry>();

function subscribeToTable(table: string, listener: () => void) {
  try {
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
        try {
          void supabase.removeChannel(latest.channel);
        } catch {
          // Ignore error on channel removal
        }
      }, 1_000);
    };
  } catch {
    return () => {};
  }
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
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("key,value")
          .abortSignal(signal);
        if (error || !data || data.length === 0) return FALLBACK_SETTINGS;
        const out: SiteSettings = { ...FALLBACK_SETTINGS };
        for (const row of data)
          out[row.key] = {
            ...(out[row.key] ?? {}),
            ...((row.value as Record<string, unknown>) ?? {}),
          };
        return out;
      } catch {
        return FALLBACK_SETTINGS;
      }
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
      try {
        let q = supabase.from("clients").select("*").eq("kind", kind).order("sort_order");
        if (!includeInactive) q = q.eq("is_active", true);
        const { data, error } = await q.abortSignal(signal);
        if (error || !data || data.length === 0) {
          return kind === "studio" ? FALLBACK_STUDIOS : FALLBACK_CLIENTS;
        }
        return data as DbClient[];
      } catch {
        return kind === "studio" ? FALLBACK_STUDIOS : FALLBACK_CLIENTS;
      }
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
      try {
        let q = supabase.from("projects").select("*").order("sort_order");
        if (!includeUnpublished) q = q.eq("is_published", true);
        const { data, error } = await q.abortSignal(signal);
        if (error || !data || data.length === 0) {
          return FALLBACK_PROJECTS;
        }
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
      } catch {
        return FALLBACK_PROJECTS;
      }
    },
  });
}

// ---------- services ----------
export function useServices(includeInactive = false) {
  return useQuery({
    queryKey: ["services", includeInactive],
    queryFn: async (): Promise<DbService[]> => {
      try {
        let q = supabase.from("services").select("*").order("sort_order");
        if (!includeInactive) q = q.eq("is_active", true);
        const { data, error } = await q;
        if (error || !data) return [];
        return data as DbService[];
      } catch {
        return [];
      }
    },
  });
}

// ---------- stats ----------
export function useStats(includeInactive = false) {
  return useQuery({
    queryKey: ["stats", includeInactive],
    queryFn: async (): Promise<DbStat[]> => {
      try {
        let q = supabase.from("stats").select("*").order("sort_order");
        if (!includeInactive) q = q.eq("is_active", true);
        const { data, error } = await q;
        if (error || !data) return [];
        return data as DbStat[];
      } catch {
        return [];
      }
    },
  });
}

// ---------- about_method ----------
export function useMethod(includeInactive = false) {
  return useQuery({
    queryKey: ["about_method", includeInactive],
    queryFn: async (): Promise<DbMethod[]> => {
      try {
        let q = supabase.from("about_method").select("*").order("sort_order");
        if (!includeInactive) q = q.eq("is_active", true);
        const { data, error } = await q;
        if (error || !data) return [];
        return data as DbMethod[];
      } catch {
        return [];
      }
    },
  });
}
