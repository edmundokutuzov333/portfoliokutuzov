import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AdminRole = "owner" | "admin" | "editor" | "finance" | null;

export type AdminAuthState = {
  session: Session | null;
  isAdmin: boolean;
  role: AdminRole;
  loading: boolean;
};

function normalizeRole(value: unknown): AdminRole {
  return value === "owner" || value === "admin" || value === "editor" || value === "finance"
    ? value
    : null;
}

async function resolveAdminRole(): Promise<AdminRole> {
  const { data: rpcRole, error: rpcError } = await supabase.rpc("admin_get_role");
  if (!rpcError) return normalizeRole(rpcRole);

  // Backwards-compatible fallback while the Phase 1 migration is being applied.
  const { data, error } = await supabase
    .from("admin_users")
    .select("role")
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id ?? "")
    .maybeSingle();
  return !error ? normalizeRole(data?.role ?? "admin") : null;
}

export function useAdminAuth(): AdminAuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AdminRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const timers = new Set<ReturnType<typeof setTimeout>>();

    const resolveSessionRole = async (nextSession: Session | null) => {
      if (!alive) return;
      setSession(nextSession);
      setRole(null);

      if (!nextSession?.user) {
        setLoading(false);
        return;
      }

      const nextRole = await resolveAdminRole();
      if (!alive) return;
      setRole(nextRole);
      setLoading(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!alive) return;
      setSession(nextSession);
      setRole(null);

      if (nextSession?.user) {
        const timer = setTimeout(() => {
          timers.delete(timer);
          void resolveSessionRole(nextSession);
        }, 0);
        timers.add(timer);
      } else {
        setLoading(false);
      }
    });

    void supabase.auth
      .getSession()
      .then(({ data: { session } }) => resolveSessionRole(session))
      .catch(() => {
        if (alive) {
          setSession(null);
          setRole(null);
          setLoading(false);
        }
      });

    return () => {
      alive = false;
      for (const timer of timers) clearTimeout(timer);
      timers.clear();
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, isAdmin: role !== null, role, loading };
}
