import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = async (path) => readFile(path, "utf8");

test("Phase 2 CMS surface exists and is structured", async () => {
  const admin = await read("src/components/admin/Phase2WebsiteCMS.tsx");
  for (const token of [
    "Phase2Overview",
    "HomepageManager",
    "CredentialsManager",
    "ServicesManager",
    "NavigationManager",
    "GlobalSettingsManager",
    "SeoManager",
    "MediaLibrary",
  ]) {
    assert.ok(admin.includes(token), `Missing CMS surface: ${token}`);
  }
  assert.ok(admin.includes("saveAdminSiteSetting"));
  assert.ok(admin.includes("useQuery"));
});

test("Phase 2 backend exposes service, credential and media mutations", async () => {
  const server = await read("src/lib/admin.functions.ts");
  for (const token of [
    "saveAdminService",
    "createAdminService",
    "deleteAdminService",
    "duplicateAdminService",
    "reorderAdminServices",
    "saveAdminStat",
    "createAdminStat",
    "deleteAdminStat",
    "reorderAdminStats",
    "saveAdminMethod",
    "createAdminMethod",
    "deleteAdminMethod",
    "reorderAdminMethods",
    "setAdminProjectFeatured",
    "listAdminMediaAssets",
    "createAdminMediaAsset",
    "deleteAdminMediaAsset",
    "replaceAdminMediaAsset",
  ]) {
    assert.ok(server.includes(`export const ${token}`), `Missing mutation: ${token}`);
  }
});

test("Phase 2 database migration provides media registry, RLS, realtime and transactional ordering", async () => {
  const migration = await read("supabase/migrations/20260922130000_admin_control_room_phase2.sql");
  for (const token of [
    "CREATE TABLE IF NOT EXISTS public.media_assets",
    "ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY",
    "admin_has_permission('media.manage')",
    "admin_reorder_services",
    "admin_reorder_stats",
    "admin_reorder_about_method",
    "supabase_realtime",
    "'library'",
    "INSERT INTO public.site_settings",
    "Existing site-assets registry backfill",
    "jsonb_array_elements_text(COALESCE(p.gallery, '[]'::jsonb))",
  ]) {
    assert.ok(migration.includes(token), `Missing migration contract: ${token}`);
  }
});

test("Navigation is backend-driven at the public surface", async () => {
  const nav = await read("src/components/layout/Navbar.tsx");
  const cms = await read("src/lib/cms.ts");
  assert.ok(nav.includes("useSiteSettings"));
  assert.ok(nav.includes("navigation"));
  assert.ok(nav.includes("FALLBACK_NAVIGATION"));
  assert.ok(cms.includes("export const FALLBACK_NAVIGATION"));
});

test("Services public UI reads structured services data", async () => {
  const services = await read("src/components/services/ServicesInteractive.tsx");
  assert.ok(services.includes("useServices"));
  assert.ok(services.includes("STATIC_DISCIPLINES"));
  assert.ok(services.includes("services.map"));
});

test("Credentials public UI reads credentials settings plus stats and method tables", async () => {
  const credentials = await read("src/routes/credentials.tsx");
  assert.ok(credentials.includes("useStats"));
  assert.ok(credentials.includes("useMethod"));
  assert.ok(credentials.includes('"credentials"'));
  assert.ok(credentials.includes("methods.map"));
});

test("SEO changes have a runtime public-site path", async () => {
  const sync = await read("src/components/SeoRuntimeSync.tsx");
  const root = await read("src/routes/__root.tsx");
  const cms = await read("src/lib/cms.ts");
  assert.ok(sync.includes("document.title"));
  assert.ok(sync.includes("og:title"));
  assert.ok(sync.includes("canonical"));
  assert.ok(root.includes("SeoRuntimeSync"));
  assert.ok(cms.includes("seo_global"));
  assert.ok(cms.includes("seo_pages"));
});

test("Footer follows the structured navigation and global settings", async () => {
  const footer = await read("src/components/layout/Footer.tsx");
  assert.ok(footer.includes("FALLBACK_NAVIGATION"));
  assert.ok(footer.includes("navigation"));
  assert.ok(footer.includes("global"));
});

test("Admin route is separated from public shell", async () => {
  const root = await read("src/routes/__root.tsx");
  assert.ok(root.includes('pathname.startsWith("/admin")'));
  assert.ok(root.includes("!isAdmin && <Navbar"));
});

test("No new Phase 2 branch is encoded in the repository automation", async () => {
  const docs = await read("docs/ADMIN_WEBSITE_CMS_PHASE2.md");
  assert.ok(docs.includes("main"));
  assert.equal(docs.includes("feat/admin-control-room-phase2"), false);
});

test("CMS fallback content is SSR-safe", async () => {
  const cms = await read("src/lib/cms.ts");
  assert.ok(cms.includes("SOCIAL_IMAGE"));
  assert.ok(cms.includes('from "@/lib/seo"'));
});

test("Phase 2 media search sanitizes Unicode safely", async () => {
  const server = await read("src/lib/admin.functions.ts");
  assert.ok(server.includes("data.search.replace(/[^\\p{L}\\p{N}\\s._-]/gu"));
});
