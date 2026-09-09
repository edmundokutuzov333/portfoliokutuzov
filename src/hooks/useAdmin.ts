import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AdminAuthState = {
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
};

export function useAdminAuth(): AdminAuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const timers = new Set<ReturnType<typeof setTimeout>>();

    const applySession = async (nextSession: Session | null) => {
      if (!alive) return;
      setSession(nextSession);
      setIsAdmin(false);

      if (!nextSession?.user) {
        setLoading(false);
        return;
      }

      const ok = await verifyAdmin(nextSession.user.id);
      if (!alive) return;
      setIsAdmin(ok);
      setLoading(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!alive) return;
      setSession(nextSession);
      setIsAdmin(false);

      if (nextSession?.user) {
        const timer = setTimeout(() => {
          timers.delete(timer);
          void verifyAdmin(nextSession.user.id).then((ok) => {
            if (alive) setIsAdmin(ok);
          });
        }, 0);
        timers.add(timer);
      }
    });

    void supabase.auth
      .getSession()
      .then(({ data: { session } }) => applySession(session))
      .catch(() => {
        if (alive) {
          setSession(null);
          setIsAdmin(false);
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

  return { session, isAdmin, loading };
}

async function verifyAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  return !error && !!data;
}
