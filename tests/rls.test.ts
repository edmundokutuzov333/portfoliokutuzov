/**
 * Automated RLS / public-access policy tests.
 *
 * Uses the anon (publishable) key only — these tests assert what an
 * UNAUTHENTICATED visitor of the public site is allowed to do against
 * each table in the `public` schema.
 *
 * Run with:  bunx vitest run tests/rls.test.ts
 */
import { describe, it, expect, beforeAll } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL!;
const ANON = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;

if (!URL || !ANON) {
  throw new Error("Missing SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY env vars");
}

let anon: SupabaseClient;
beforeAll(() => {
  anon = createClient(URL, ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
});

/** Helper — true if response indicates RLS / permission denial. */
function isDenied(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  // 42501 = insufficient_privilege, PGRST = PostgREST policy violation
  return (
    error.code === "42501" ||
    error.code === "PGRST301" ||
    /row-level security|permission denied|violates row-level/i.test(error.message ?? "")
  );
}

// ---------- READ access ----------
describe("anon SELECT access", () => {
  // Tables anon SHOULD be able to read (publicly visible content)
  const publicReadable = [
    "clients",
    "projects",
    "services",
    "stats",
    "about_method",
    "site_settings",
  ];
  for (const table of publicReadable) {
    it(`anon can read ${table}`, async () => {
      const { error } = await anon.from(table).select("*").limit(1);
      expect(error, `read ${table}: ${error?.message}`).toBeNull();
    });
  }

  // Tables anon MUST NOT read (admin-only / contains PII)
  const adminOnly = [
    "admin_users",
    "analytics_events",
    "booking_requests",
    "briefing_submissions",
    "contact_requests",
    "content_history",
    "newsletter_subscribers",
  ];
  for (const table of adminOnly) {
    it(`anon cannot read ${table}`, async () => {
      const { data, error } = await anon.from(table).select("*").limit(1);
      // RLS returns 0 rows rather than erroring; both are acceptable as "blocked"
      const blocked = isDenied(error) || (data?.length ?? 0) === 0;
      expect(blocked, `expected ${table} to be unreadable`).toBe(true);
    });
  }
});

// ---------- INSERT access ----------
describe("anon INSERT access is denied after P0 hardening", () => {
  const rows: Array<[string, Record<string, unknown>]> = [
    ["contact_requests", { name: "[AUDIT] RLS Test", email: "delivered@resend.dev", message: "[AUDIT] automated rls test" }],
    ["briefing_submissions", { full_name: "[AUDIT] RLS Test", email: "delivered@resend.dev", project_type: "[AUDIT] test", message: "[AUDIT] automated rls test" }],
    ["booking_requests", { name: "[AUDIT] RLS Test", email: "delivered@resend.dev", preferred_date: "2099-01-01" }],
    ["newsletter_subscribers", { email: "delivered@resend.dev" }],
    ["analytics_events", { page: "/[AUDIT]-rls-test", action: "[AUDIT] test" }],
  ];

  for (const [table, row] of rows) {
    it(`anon cannot insert into ${table}`, async () => {
      const { error } = await anon.from(table).insert(row as never);
      expect(isDenied(error), `expected ${table} insert to be denied`).toBe(true);
    });
  }
});

// ---------- INSERT denied ----------

describe("anon INSERT denied (admin-only tables)", () => {
  const adminWriteOnly: Array<[string, Record<string, unknown>]> = [
    ["clients", { name: "rls-test-client" }],
    ["projects", { title: "rls-test", category: "Test" }],
    ["services", { title: "rls-test" }],
    ["stats", { label: "rls", value: "1" }],
    ["about_method", { title: "rls", number: "01" }],
    ["site_settings", { key: `rls-${Date.now()}`, value: {} }],
    ["admin_users", { user_id: "00000000-0000-0000-0000-000000000000", email: "x@x.x" }],
    ["content_history", { entity_type: "x", entity_id: "x", snapshot: {} }],
  ];
  for (const [table, row] of adminWriteOnly) {
    it(`anon cannot insert into ${table}`, async () => {
      const { error } = await anon.from(table).insert(row);
      expect(isDenied(error), `expected denial, got: ${error?.message ?? "no error"}`).toBe(true);
    });
  }
});

// ---------- UPDATE / DELETE denied ----------
describe("anon UPDATE / DELETE denied", () => {
  const tables = [
    "clients",
    "projects",
    "services",
    "stats",
    "about_method",
    "site_settings",
    "contact_requests",
    "briefing_submissions",
    "booking_requests",
    "newsletter_subscribers",
    "analytics_events",
    "admin_users",
    "content_history",
  ];
  for (const table of tables) {
    it(`anon cannot UPDATE ${table}`, async () => {
      const { error, data } = await anon
        .from(table)
        .update({ updated_at: new Date().toISOString() })
        .neq("id", "00000000-0000-0000-0000-000000000000")
        .select();
      // either RLS denies, or zero rows are affected (silent block)
      const blocked = isDenied(error) || (data?.length ?? 0) === 0;
      expect(blocked, `expected ${table} update to be blocked`).toBe(true);
    });

    it(`anon cannot DELETE ${table}`, async () => {
      const { error, data } = await anon
        .from(table)
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000")
        .select();
      const blocked = isDenied(error) || (data?.length ?? 0) === 0;
      expect(blocked, `expected ${table} delete to be blocked`).toBe(true);
    });
  }
});
