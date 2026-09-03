import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
function createSupabaseClient() {
  const SUPABASE_URL = "https://uqcuzsuqkutxjqkopary.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxY3V6c3Vxa3V0eGpxa29wYXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NTYzMDQsImV4cCI6MjA5MjQzMjMwNH0.hXgSunAJX4ZXi5mNG_JDvYal4EZ_XcQuoH-FNBaWpKQ";
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}
let _supabase;
const supabase = new Proxy(
  {},
  {
    get(_, prop, receiver) {
      if (!_supabase) _supabase = createSupabaseClient();
      return Reflect.get(_supabase, prop, receiver);
    },
  },
);
export { supabase as s };
