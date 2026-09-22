import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const read = (p) => readFileSync(join(process.cwd(), p), "utf8");

test("core admin mutations use typed server functions", () => {
  const fns = read("src/lib/admin.functions.ts");
  const ui = read("src/components/admin/AdminControlRoom.tsx");
  for (const name of [
    "prepareAdminMediaUpload",
    "saveAdminSiteSetting",
    "saveAdminClient",
    "saveAdminProject",
    "createAdminProject",
    "deleteAdminProject",
    "duplicateAdminProject",
    "publishAdminProject",
    "reorderAdminProjects",
  ]) {
    assert.match(fns, new RegExp("export const " + name + " = createServerFn"));
  }
  assert.doesNotMatch(ui, /supabase\.from\(["'](site_settings|clients|projects)["']\)/);
});
test("media upload preparation is server-authorized before signed browser transfer", () => {
  const fns = read("src/lib/admin.functions.ts");
  const ui = read("src/components/admin/AdminControlRoom.tsx");
  assert.match(fns, /media\.manage/);
  assert.match(fns, /createSignedUploadUrl/);
  assert.match(fns, /MEDIA_MIME_ALLOWLIST/);
  assert.match(ui, /prepareAdminMediaUpload/);
  assert.match(ui, /uploadToSignedUrl/);
});
