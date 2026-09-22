import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const read = (p) => readFileSync(join(process.cwd(), p), "utf8");

test("admin auth resolves membership through Supabase", () => {
  const auth = read("src/hooks/useAdmin.ts");
  assert.match(auth, /admin_get_role/);
  assert.match(auth, /admin_users/);
  assert.doesNotMatch(auth, /localStorage|getItem\(|mock_admin_email|Admin123|admin123/i);
});