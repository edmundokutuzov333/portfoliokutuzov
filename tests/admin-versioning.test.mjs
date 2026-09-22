import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const read = (p) => readFileSync(join(process.cwd(), p), "utf8");

test("critical content receives bounded automatic version history", () => {
  const sql = read("supabase/migrations/20260922110000_admin_control_kernel.sql");
  const history = read("src/components/admin/HistoryManager.tsx");
  assert.match(sql, /content_history.*action/s);
  assert.match(sql, /ranked\.rn > 20/);
  assert.match(sql, /trg_content_history_prune/);
  assert.match(sql, /capture_admin_content_version/);
  assert.match(history, /restoreAdminContentVersion/);
  for (const entity of ["site_settings","clients","projects","services","stats","about_method"]) {
    assert.match(sql, new RegExp(entity));
  }
});