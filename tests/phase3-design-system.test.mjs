import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import test from "node:test";

const read = (file) => fs.readFileSync(file, "utf8");

test("Headline uses one accessible text source and one visual render", () => {
  const source = read("src/components/design-system/primitives.tsx");
  assert.match(source, /aria-label=\{text\}/);
  assert.match(source, /aria-hidden="true"/);
  assert.equal((source.match(/\{text\}/g) ?? []).length, 1);
  assert.doesNotMatch(source, /\{text\}\s*\{text\}/);
});

test("Work Colour exposes WCAG contrast, OKLab darkening and DOM token application", () => {
  const source = read("src/lib/work-color.ts");
  for (const token of ["relLuminance", "contrast", "pickFg", "darkenWorkColor", "setWorkColor"]) {
    assert.ok(source.includes("export function " + token));
  }
  assert.ok(source.includes("amount = 0.18"));
  assert.ok(source.includes("--work-dark"));
  assert.ok(source.includes("--work-fg"));
});

test("Phase 3 schema change is additive and reversible", () => {
  const migration = read("supabase/migrations/20260924090000_phase3_design_system.sql");
  const rollback = read("supabase/rollbacks/20260924090000_phase3_design_system.sql");
  assert.ok(migration.includes("ADD COLUMN IF NOT EXISTS dominant_color"));
  assert.ok(migration.includes("ADD COLUMN IF NOT EXISTS accent_color"));
  assert.ok(rollback.includes("DROP COLUMN IF EXISTS dominant_color"));
  assert.ok(rollback.includes("DROP COLUMN IF EXISTS accent_color"));
  assert.ok(!migration.includes("CREATE TABLE public.reel_items"));
});

test("Design system surface uses the authenticated admin boundary", () => {
  const showcase = read("src/components/design-system/DesignSystemShowcase.tsx");
  const route = read("src/routes/admin.design-system.tsx");
  assert.ok(showcase.includes("useAdminAuth"));
  assert.ok(showcase.includes("isAdmin"));
  assert.ok(route.includes("/admin/design-system"));
  assert.ok(route.includes("noindex, nofollow"));
});

test("No public route imports Phase 3 design-system CSS", () => {
  const routes = fs
    .readdirSync("src/routes")
    .filter((name) => name.endsWith(".tsx") && name !== "admin.design-system.tsx");
  const offenders = routes.filter((name) =>
    read("src/routes/" + name).includes("design-system.css"),
  );
  assert.deepEqual(offenders, []);
});

test("Route tree registers the authenticated showcase", () => {
  const tree = read("src/routeTree.gen.ts");
  assert.ok(tree.includes("AdminDesignSystemRouteImport"));
  assert.ok(tree.includes("/admin/design-system"));
});

test("Betão & Cor token contract is present", () => {
  const css = read("src/styles/design-system.css");
  for (const token of [
    "--color-betao",
    "--color-cal",
    "--color-preto",
    "--color-chapa",
    "--color-fumo",
    "--color-work-default",
    "--font-cartaz",
    "--font-livro",
    "--ease-signature",
    "--duration-fast",
    "--duration-base",
    "--duration-slow",
  ]) {
    assert.ok(css.includes(token), "Missing token: " + token);
  }
  assert.ok(css.includes('[data-tone="preto"]'));
  assert.ok(css.includes('[data-tone="betao"]'));
  assert.ok(css.includes('[data-tone="cor"]'));
  assert.ok(css.includes("border-radius: 0"));
});

test("Contrast report passes", () => {
  const output = execFileSync(process.execPath, ["scripts/contrast-report.mjs"], {
    encoding: "utf8",
  });
  assert.ok(output.includes("AA contrast gate: PASS"));
});

test("Anti-template review is documented", () => {
  const plan = read("docs/rebuild/DESIGN-PLAN.md");
  for (const phrase of [
    "fundo creme quente",
    "fundo quase-preto",
    "layout de jornal",
    "kit SaaS",
    "chrome de template",
    "Betão & Cor",
  ]) {
    assert.ok(plan.includes(phrase), "Missing anti-template review phrase: " + phrase);
  }
});
