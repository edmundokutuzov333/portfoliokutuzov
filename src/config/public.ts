const DEFAULT_SUPABASE_URL = "https://uqcuzsuqkutxjqkopary.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxY3V6c3Vxa3V0eGpxa29wYXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NTYzMDQsImV4cCI6MjA5MjQzMjMwNH0.hXgSunAJX4ZXi5mNG_JDvYal4EZ_XcQuoH-FNBaWpKQ";

export const publicConfig = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL,
    publishableKey:
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY,
  },
  siteUrl:
    import.meta.env.VITE_PUBLIC_SITE_URL ||
    import.meta.env.VITE_SITE_URL ||
    "https://portfoliokutuzov-omega.vercel.app",
} as const;

export { DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_PUBLISHABLE_KEY };