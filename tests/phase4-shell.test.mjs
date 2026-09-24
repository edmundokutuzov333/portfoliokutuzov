import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (file) => fs.readFileSync(file, "utf8");

test("Phase 4 shell is mounted without the legacy pill navigation", () => {
  const root = read("src/routes/__root.tsx");
  const nav = read("src/components/layout/Navbar.tsx");
  const footer = read("src/components/layout/Footer.tsx");
  assert.match(root, /global-shell\.css/);
  assert.match(nav, /ek-global-header/);
  assert.match(nav, /viewTransition/);
  assert.match(footer, /ek-global-footer/);
  assert.doesNotMatch(nav, /rounded-full/);
});

test("Global shell supports Betao, Cal, Preto and Cor tones", () => {
  const css = read("src/styles/global-shell.css");
  for (const tone of ['data-tone="betao"', 'data-tone="cal"', 'data-tone="cor"', 'data-tone="preto"']) {
    assert.ok(css.includes(tone), "Missing shell tone: " + tone);
  }
  assert.match(css, /height: 3px/);
  assert.match(css, /min-height: 44px/);
});

test("PT routes are registered for every public route mirrored by Phase 4", () => {
  const tree = read("src/routeTree.gen.ts");
  for (const path of [
    "/pt",
    "/pt/portfolio",
    "/pt/portfolio/$slug",
    "/pt/services",
    "/pt/credentials",
    "/pt/contact",
    "/pt/studio",
  ]) {
    assert.ok(tree.includes(path), "Missing localized route: " + path);
  }
  const locale = read("src/lib/site-locale.ts");
  assert.match(locale, /pt-PT/);
  assert.match(locale, /localizePath/);
});

test("SEO exposes canonical and hreflang for EN/PT", () => {
  const seo = read("src/lib/seo.ts");
  assert.match(seo, /hrefLang: "en"/);
  assert.match(seo, /hrefLang: "pt-PT"/);
  assert.match(seo, /hrefLang: "x-default"/);
  assert.match(seo, /canonical/);
});

test("Newsletter Phase 4 is migration-gated and rate limited", () => {
  const fn = read("src/lib/newsletter.functions.ts");
  const migration = read("supabase/migrations/20260924093000_phase4_newsletter_unified.sql");
  const rollback = read("supabase/rollbacks/20260924093000_phase4_newsletter_unified.sql");
  assert.match(fn, /UNIFIED_NEWSLETTER_ENABLED/);
  assert.match(fn, /RATE_MAX/);
  assert.match(fn, /confirmation_token_hash/);
  assert.match(fn, /confirmNewsletter/);
  assert.match(migration, /ADD COLUMN IF NOT EXISTS confirmed_at/);
  assert.match(migration, /migrated_from_studio_waitlist/);
  assert.match(rollback, /DROP COLUMN IF EXISTS confirmed_at/);
});

test("Availability has an admin-controlled source", () => {
  const cms = read("src/components/admin/Phase2WebsiteCMS.tsx");
  const surface = read("src/components/admin/Phase2AdminSurface.tsx");
  const admin = read("src/components/admin/AdminControlRoom.tsx");
  const fallback = read("src/lib/cms.ts");
  assert.match(cms, /AvailabilityManager/);
  assert.match(surface, /availability: AvailabilityManager/);
  assert.match(admin, /id: "availability"/);
  assert.match(fallback, /availability:/);
});

test("Command palette keeps search and adds navigation/action/recent groups", () => {
  const source = read("src/components/CommandPalette.tsx");
  assert.match(source, /cmdk/);
  for (const token of ["recent", "navigation", "startProject", "openChat", "RECENT_KEY"]) {
    assert.ok(source.includes(token), "Missing command-palette capability: " + token);
  }
  assert.match(source, /viewTransition/);
});

test("Global SEO structured data includes WebSite and runtime route types", () => {
  const root = read("src/routes/__root.tsx");
  const seo = read("src/components/SeoRuntimeSync.tsx");
  assert.match(root, /"@type":"WebSite"/);
  assert.match(root, /"@type":"Person"/);
  assert.match(seo, /WebPage/);
  assert.match(seo, /ProfilePage/);
});

test("Public crawl surface includes localized sitemap paths and public Studio", () => {
  const sitemap = read("src/routes/sitemap[.]xml.ts");
  const robots = read("public/robots.txt");
  assert.match(sitemap, /\/pt\/portfolio/);
  assert.match(sitemap, /\/pt\/studio/);
  assert.doesNotMatch(robots, /Disallow: \/studio/);
});

test("Legacy public micro-label pattern is not introduced by the new shell", () => {
  const css = read("src/styles/global-shell.css");
  assert.doesNotMatch(css, /font-size:s*10px/);
  assert.doesNotMatch(css, /mono/);
});
