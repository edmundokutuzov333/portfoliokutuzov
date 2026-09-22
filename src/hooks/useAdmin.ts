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

export function useAdminAuth(): AdminAuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AdminRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const timers = new Set<ReturnType<typeof setTimeout>>();

    const resolveRole = async (nextSession: Session | null) => {
      if (!alive) return;
      setSession(nextSession);
      setRole(null);

      if (!nextSession?.user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc("admin_get_role");
      if (!alive) return;
      const nextRole =
        !error && (data === "owner" || data === "admin" || data === "editor" || data === "finance")
          ? data
          : null;
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
          void resolveRole(nextSession);
        }, 0);
        timers.add(timer);
      }
    });

    void supabase.auth
      .getSession()
      .then(({ data: { session } }) => resolveRole(session))
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
