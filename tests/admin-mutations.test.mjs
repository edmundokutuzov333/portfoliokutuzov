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

test("legacy CMS save mutations cannot bypass the Phase 4 editorial boundary", () => {
  const functions = read("src/lib/admin.functions.ts");
  for (const name of [
    "saveAdminSiteSetting",
    "saveAdminClient",
    "saveAdminProject",
    "saveAdminService",
    "saveAdminStat",
    "saveAdminMethod",
    "publishAdminProject",
  ]) {
    assert.match(functions, new RegExp("export const " + name + " = createServerFn"));
  }
  assert.match(functions, /async function publishExistingAdminEntity/);
  assert.match(functions, /from\("admin_drafts"\)/);
  assert.match(functions, /rpc\("admin_publish_drafts"/);
  assert.match(functions, /status === "review"/);
  assert.match(functions, /currently under review/);
});

test("legacy save bridge rejects invalid structured entity identifiers", () => {
  const functions = read("src/lib/admin.functions.ts");
  assert.match(functions, /A valid entity id is required before saving this content/);
});
