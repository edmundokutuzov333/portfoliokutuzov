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
  assert.match(functions, /async function saveAdminEntityDraft/);
  assert.match(functions, /from\("admin_drafts"\)/);
  assert.match(functions, /rpc\("admin_publish_drafts"/);
  const helperStart = functions.indexOf("async function saveAdminEntityDraft");
  const helperEnd = functions.indexOf("function projectPayload", helperStart);
  assert.ok(helperStart >= 0 && helperEnd > helperStart);
  const helper = functions.slice(helperStart, helperEnd);
  assert.doesNotMatch(helper, /rpc\("admin_publish_drafts"/);
  assert.match(helper, /status: "draft"/);
  assert.match(helper, /status === "review"/);
  assert.match(helper, /currently under review/);
});

test("credentials structured records use local drafts instead of per-keystroke writes", () => {
  const ui = read("src/components/admin/Phase2WebsiteCMS.tsx");
  assert.match(ui, /const \[statDrafts, setStatDrafts\]/);
  assert.match(ui, /const \[methodDrafts, setMethodDrafts\]/);
  assert.match(ui, /function patchStat/);
  assert.match(ui, /function patchMethod/);
  assert.doesNotMatch(ui, /onChange=\{\(e\)=>void saveRow\(saveStat/);
  assert.doesNotMatch(ui, /onChange=\{\(e\)=>void saveRow\(saveMethod/);
});

test("legacy save bridge rejects invalid structured entity identifiers", () => {
  const functions = read("src/lib/admin.functions.ts");
  assert.match(functions, /A valid entity id is required before saving this content/);
});

test("new structured CMS records never become public before editorial publication", () => {
  const functions = read("src/lib/admin.functions.ts");
  for (const table of ["services", "stats", "about_method", "clients"]) {
    const tableStart = functions.indexOf(`.from("${table}")`);
    assert.ok(tableStart >= 0, `Missing ${table} server mutation`);
    const next = functions.indexOf("\n\nexport const", tableStart);
    const block = functions.slice(tableStart, next > tableStart ? next : tableStart + 900);
    assert.match(block, /is_active: false/);
  }
});
