import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = async (path) => readFile(path, "utf8");

test("Phase 2 CMS surface exists and is structured", async () => {
  const admin = await read("src/components/admin/Phase2WebsiteCMS.tsx");
  for (const token of ["Phase2Overview", "HomepageManager", "CredentialsManager", "ServicesManager", "NavigationManager", "GlobalSettingsManager", "SeoManager", "MediaLibrary"]) {
    assert.match(admin, new RegExp(token));
  }
  assert.match(admin, /saveAdminSiteSetting/);
  assert.match(admin, /React Query|useQuery/);
});

test("Phase 2 backend exposes service, credential and media mutations", async () => {
  const server = await read("src/lib/admin.functions.ts");
  for (const token of [
    "saveAdminService", "createAdminService", "deleteAdminService", "duplicateAdminService", "reorderAdminServices",
    "saveAdminStat", "createAdminStat", "deleteAdminStat", "reorderAdminStats",
    "saveAdminMethod", "createAdminMethod", "deleteAdminMethod", "reorderAdminMethods",
    "setAdminProjectFeatured", "listAdminMediaAssets", "createAdminMediaAsset", "deleteAdminMediaAsset",
  ]) assert.match(server, new RegExp("export const " + token));
});

test("Phase 2 database migration provides media registry, RLS, realtime and transactional ordering", async () => {
  const migration = await read("supabase/migrations/20260922130000_admin_control_room_phase2.sql");
  assert.match(migration, /CREATE TABLE IF NOT EXISTS public\\.media_assets/);
  assert.match(migration, /ALTER TABLE public\\.media_assets ENABLE ROW LEVEL SECURITY/);
  assert.match(migration, /admin_has_permission\\('media\\.manage'\\)/);
  assert.match(migration, /admin_reorder_services/);
  assert.match(migration, /admin_reorder_stats/);
  assert.match(migration, /admin_reorder_about_method/);
  assert.match(migration, /supabase_realtime/);
  assert.match(migration, /'library'/);
});

test("Navigation is backend-driven at the public surface", async () => {
  const nav = await read("src/components/layout/Navbar.tsx");
  const cms = await read("src/lib/cms.ts");
  assert.match(nav, /useSiteSettings/);
  assert.match(nav, /navigation/);
  assert.match(nav, /FALLBACK_NAVIGATION/);
  assert.match(cms, /export const FALLBACK_NAVIGATION/);
});

test("Services public UI reads structured services data", async () => {
  const services = await read("src/components/services/ServicesInteractive.tsx");
  assert.match(services, /useServices/);
  assert.match(services, /STATIC_DISCIPLINES/);
  assert.match(services, /services\\.map/);
});

test("Credentials public UI reads credentials settings plus stats and method tables", async () => {
  const credentials = await read("src/routes/credentials.tsx");
  assert.match(credentials, /useStats/);
  assert.match(credentials, /useMethod/);
  assert.match(credentials, /"credentials"/);
  assert.match(credentials, /methods\\.map/);
});

test("SEO changes have a runtime public-site path", async () => {
  const sync = await read("src/components/SeoRuntimeSync.tsx");
  const root = await read("src/routes/__root.tsx");
  const cms = await read("src/lib/cms.ts");
  assert.match(sync, /document\\.title/);
  assert.match(sync, /og:title/);
  assert.match(sync, /canonical/);
  assert.match(root, /SeoRuntimeSync/);
  assert.match(cms, /seo_global/);
  assert.match(cms, /seo_pages/);
});

test("Footer follows the structured navigation and global settings", async () => {
  const footer = await read("src/components/layout/Footer.tsx");
  assert.match(footer, /FALLBACK_NAVIGATION/);
  assert.match(footer, /navigation/);
  assert.match(footer, /global/);
});

test("Admin route is separated from public shell", async () => {
  const root = await read("src/routes/__root.tsx");
  assert.match(root, /pathname\\.startsWith\\("\\/admin"\\)/);
  assert.match(root, /!isAdmin && <Navbar/);
});

test("No new Phase 2 branch is encoded in the repository automation", async () => {
  const docs = await read("docs/ADMIN_WEBSITE_CMS_PHASE2.md");
  assert.match(docs, /main/);
  assert.doesNotMatch(docs, /feat\\/admin-control-room-phase2/);
});
