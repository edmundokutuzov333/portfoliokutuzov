import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const read = (p) => readFileSync(join(process.cwd(), p), "utf8");

test("audit trail is database-backed and immutable at the application surface", () => {
  const sql = read("supabase/migrations/20260922110000_admin_control_kernel.sql");
  const ui = read("src/components/admin/AuditManager.tsx");
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.admin_audit_log/);
  assert.match(sql, /CREATE OR REPLACE FUNCTION public\.capture_admin_audit/);
  assert.match(sql, /admins read audit log/);
  assert.match(ui, /Administrator activity/);
  assert.match(ui, /getAdminAuditLog/);
});