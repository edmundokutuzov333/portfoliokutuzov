import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const read = (p) => readFileSync(join(process.cwd(), p), "utf8");

test("Homepage Admin controls the complete public homepage surface", () => {
  const admin = read("src/components/admin/Phase2WebsiteCMS.tsx");
  const index = read("src/routes/index.tsx");
  const cms = read("src/lib/cms.ts");
  for (const token of [
    "homepage_structure",
    "Homepage structure",
    "Hero",
    "Clients section",
    "Services preview",
    "Home CTA",
    "Footer",
    "cta_primary_route",
    "cta_secondary_route",
    "preview_limit",
    "max_items",
  ]) assert.ok(admin.includes(token), token);

  for (const token of [
    "DeferredReel",
    "Hero",
    "CapabilitiesShort",
    "ClientLogos",
    "HomeExperience",
    "HomeCTA",
  ]) assert.ok(index.includes(token), token);
  assert.doesNotMatch(index, /Manifesto/);
  assert.doesNotMatch(index, /FeaturedWork/);

  assert.match(cms, /homepage_structure:/);
  assert.match(cms, /title_3:/);
  assert.match(cms, /preview_limit: 6/);
});

test("Public homepage consumes CMS-controlled order and visibility with safe fallbacks", () => {
  const index = read("src/routes/index.tsx");
  assert.match(index, /readSetting<HomeSection[]>/);
  assert.match(index, /\.filter\(\(item\) => item\.visible/);
  assert.match(index, /\.sort\(\(a, b\) => Number\(a\.order/);
  assert.match(index, /item.id !== "footer"/);
});

test("Homepage services and client limits are backend-driven with fallbacks", () => {
  const services = read("src/components/home/CapabilitiesShort.tsx");
  const clients = read("src/components/home/ClientLogos.tsx");
  const cta = read("src/components/home/HomeCTA.tsx");
  const hero = read("src/components/home/Hero.tsx");
  assert.match(services, /useServices/);
  assert.match(services, /preview_limit/);
  assert.match(services, /readSetting/);
  assert.match(clients, /max_items/);
  assert.match(clients, /visibleClients/);
  assert.match(cta, /cta_route/);
  assert.match(hero, /cta_primary_route/);
  assert.match(hero, /cta_secondary_route/);
});

test("Homepage control structure has a production migration", () => {
  const migration = read("supabase/migrations/20260923103000_homepage_control_structure.sql");
  assert.match(migration, /homepage_structure/);
  assert.match(migration, /ON CONFLICT (key) DO NOTHING/);
  assert.match(migration, /title_3/);
  assert.match(migration, /preview_limit/);
});
\ntest("Navbar brand field edited in Admin is the same field rendered publicly", () => {
  const admin = read("src/components/admin/AdminControlRoom.tsx");
  const navbar = read("src/components/layout/Navbar.tsx");
  assert.match(admin, /get\(s\.draft, "brand"/);
  assert.match(navbar, /"navbar", "brand"/);
});



test("Credentials keeps the homepage Reference but removes its broken credentials renderer", () => {
  const credentials = read("src/routes/credentials.tsx");
  const homepage = read("src/components/home/HomeExperience.tsx");
  assert.match(homepage, /label: "Years of experience"/);
  assert.doesNotMatch(credentials, /r\("reference", "GOD"\)/);
  assert.match(credentials, /<Manifesto \/>/);
});
