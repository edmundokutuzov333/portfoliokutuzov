import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const ROOT = process.cwd();
const read = (path) => readFileSync(join(ROOT, path), "utf8");

test("Phase 1 migration defines role permissions, audit and version triggers", () => {
  const sql = read("supabase/migrations/20260922110000_admin_control_kernel.sql");
  for (const permission of [
    "content.write",
    "media.manage",
    "leads.read",
    "finance.write",
    "system.audit.read",
  ]) {
    assert.match(sql, new RegExp(permission.replace(".", "\\.")));
  }
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.admin_audit_log/);
  assert.match(sql, /CREATE OR REPLACE FUNCTION public\.capture_admin_audit/);
  assert.match(sql, /CREATE OR REPLACE FUNCTION public\.capture_admin_content_version/);
  assert.match(sql, /CREATE OR REPLACE FUNCTION public\.admin_reorder_projects/);
  assert.match(sql, /FOREACH table_name IN ARRAY ARRAY/);
  for (const table of [
    "site_settings",
    "clients",
    "projects",
    "services",
    "stats",
    "about_method",
  ]) {
    assert.match(sql, new RegExp("\\'" + table + "\\'"));
  }
});

test("Admin writes are centralized behind server functions", () => {
  const admin = read("src/components/admin/AdminControlRoom.tsx");
  const portfolio = read("src/components/admin/PortfolioModule.tsx");
  const functions = read("src/lib/admin.functions.ts");
  assert.match(admin, /useServerFn\(saveAdminSiteSetting\)/);
  assert.match(admin, /useServerFn\(saveAdminClient\)/);
  for (const source of [portfolio]) {
    assert.match(source, /useServerFn\(saveAdminProject\)/);
    assert.match(source, /useServerFn\(reorderAdminProjects\)/);
    assert.match(source, /useServerFn\(createAdminProjectsBatch\)/);
  }
  assert.doesNotMatch(admin, /supabase\.from\(["'](site_settings|clients|projects)["']\)/);
  for (const fn of [
    "saveAdminSiteSetting",
    "saveAdminClient",
    "saveAdminProject",
    "reorderAdminProjects",
    "restoreAdminContentVersion",
    "getAdminAuditLog",
  ]) {
    assert.match(functions, new RegExp("export const " + fn + " = createServerFn"));
  }
});

test("Realtime invalidation covers all structured public content", () => {
  const source = read("src/hooks/useSiteData.ts");
  for (const table of [
    "site_settings",
    "clients",
    "projects",
    "services",
    "stats",
    "about_method",
  ]) {
    assert.match(source, new RegExp('useRealtimeInvalidate\\("' + table + '"'));
  }
});

test("History supports all Phase 1 content entities and server restore", () => {
  const history = read("src/lib/history.ts");
  const manager = read("src/components/admin/HistoryManager.tsx");
  for (const entity of [
    "site_settings",
    "projects",
    "clients",
    "services",
    "stats",
    "about_method",
  ]) {
    assert.match(history, new RegExp('"' + entity + '"'));
    assert.match(manager, new RegExp(entity));
  }
  assert.match(manager, /useServerFn\(restoreAdminContentVersion\)/);
  assert.match(manager, /last 20 versions/);
});

test("Audit workspace exists and is protected through the kernel", () => {
  const manager = read("src/components/admin/AuditManager.tsx");
  const admin = read("src/components/admin/AdminControlRoom.tsx");
  assert.match(manager, /getAdminAuditLog/);
  assert.match(manager, /Administrator activity/);
  assert.match(admin, /section === "audit"/);
  assert.match(admin, /section === "audit" && <AuditCenter \/>/);
});

test("Control Room exposes a safe role resolver and role-aware navigation", () => {
  const auth = read("src/hooks/useAdmin.ts");
  const admin = read("src/components/admin/AdminControlRoom.tsx");
  const migration = read("supabase/migrations/20260922110000_admin_control_kernel.sql");
  assert.match(auth, /admin_get_role/);
  assert.match(auth, /Backwards-compatible fallback/);
  assert.match(admin, /const allItems = \[/);
  assert.match(admin, /roles: \["owner", "admin", "editor"\]/);
  assert.match(admin, /roles: \["owner", "admin", "finance"\]/);
  assert.match(migration, /CREATE OR REPLACE FUNCTION public\.admin_get_role/);
});

test("Role permissions are enforced on operational and finance data", () => {
  const sql = read("supabase/migrations/20260922110000_admin_control_kernel.sql");
  for (const permission of ["leads.read", "leads.write", "finance.read", "finance.write"]) {
    assert.match(sql, new RegExp(permission.replace(".", "\\.")));
  }
  assert.match(sql, /admins read contact_requests/);
  assert.match(sql, /admins update contact_requests/);
  assert.match(sql, /admins read briefings/);
  assert.match(sql, /admins update briefings/);
  assert.match(sql, /admins read bookings/);
  assert.match(sql, /admins update bookings/);
  assert.match(sql, /admins read subscribers/);
  assert.match(sql, /Admins read invoice line items/);
  assert.match(sql, /Admins write invoice line items/);
  assert.match(sql, /Admins read invoice events/);
  assert.match(sql, /Admins read invoice counters/);
});

test("History restore is draft-first and cannot bypass Release Management", () => {
  const manager = read("src/components/admin/HistoryManager.tsx");
  const functions = read("src/lib/admin.functions.ts");
  assert.match(manager, /restoreAdminContentVersion/);
  assert.match(manager, /Restore draft/);
  assert.match(manager, /Publish it from Release Management/);
  assert.doesNotMatch(manager, /invalidateQueries\(\{ queryKey: \["projects"\]\}\)/);
  const start = functions.indexOf("export const restoreAdminContentVersion");
  const end = functions.indexOf("const MediaReplaceSchema", start);
  assert.ok(start >= 0 && end > start);
  const restoreFn = functions.slice(start, end);
  assert.match(restoreFn, /saveAdminEntityDraft/);
  assert.doesNotMatch(restoreFn, /\.from\(["'](site_settings|projects|clients|services|stats|about_method)["']\)\.upsert/);
});
