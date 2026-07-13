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
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!alive) return;
      setSession(s);
      if (s?.user) {
        // Defer the DB check so we don't block the listener.
        const timer = setTimeout(() => {
          timers.delete(timer);
          if (alive) void verifyAdmin(s.user.id).then((ok) => alive && setIsAdmin(ok));
        }, 0);
        timers.add(timer);
      } else {
        setIsAdmin(false);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!alive) return;
      setSession(session);
      if (session?.user) {
        const ok = await verifyAdmin(session.user.id);
        if (alive) setIsAdmin(ok);
      }
      if (alive) setLoading(false);
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
  if (error) return false;
  return !!data;
}
