import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const read = (p) => readFileSync(join(process.cwd(), p), "utf8");

test("admin permission matrix is defined centrally", () => {
  const sql = read("supabase/migrations/20260922110000_admin_control_kernel.sql");
  for (const permission of [
    "content.read",
    "content.write",
    "media.manage",
    "leads.read",
    "leads.write",
    "finance.read",
    "finance.write",
    "system.audit.read",
  ]) {
    assert.match(sql, new RegExp(permission.replace(".", "\\.")));
  }
  assert.match(sql, /CREATE OR REPLACE FUNCTION public\.admin_has_permission/);
});