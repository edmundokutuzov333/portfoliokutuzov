import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");
const exists = (file) => fs.existsSync(path.join(ROOT, file));

test("Public SEO has one canonical URL primitive", () => {
  const seo = read("src/lib/seo.ts");
  assert.match(seo, /SITE_ORIGIN/);
  assert.match(seo, /canonicalPath/);
  assert.match(seo, /summary_large_image/);
});

test("Root document exposes structured data and the correct language", () => {
  const root = read("src/routes/__root.tsx");
  assert.match(root, /lang=\"pt-PT\"/);
  assert.match(root, /application\/ld\+json/);
  assert.match(root, /schema\.org/);
});

test("Non-critical AI assistant is deferred", () => {
  const root = read("src/routes/__root.tsx");
  const deferred = read("src/components/DeferredAiAssistant.tsx");
  assert.match(root, /DeferredAiAssistant/);
  assert.match(deferred, /requestIdleCallback/);
  assert.match(deferred, /lazy\(/);
});

test("Public route tree keeps heavy admin/contact routes lazy", () => {
  const routeTree = read("src/routeTree.gen.ts");
  assert.match(routeTree, /admin\.lazy/);
  assert.match(routeTree, /contact\.lazy/);
});

test("Portfolio reel has reduced-motion and manual controls", () => {
  const reel = read("src/components/ui/cinematic-portfolio-reel.tsx");
  assert.match(reel, /useReducedMotion/);
  assert.match(reel, /Pause portfolio reel/);
  assert.match(reel, /ArrowLeft/);
  assert.match(reel, /ArrowRight/);
});

test("Public crawler files point at the production Vercel origin", () => {
  const robots = read("public/robots.txt");
  const sitemap = read("src/routes/sitemap[.]xml.ts");
  assert.match(robots, /portfoliokutuzov-omega\.vercel\.app\/sitemap\.xml/);
  assert.doesNotMatch(sitemap, /portfoliokutuzov2026\.lovable\.app/);
});

test("TanStack server functions use the current validator API", () => {
  const files = [
    "src/lib/newsletter.functions.ts",
    "src/lib/briefing.functions.ts",
    "src/lib/invoice.functions.ts",
  ];
  for (const file of files) {
    const source = read(file);
    assert.doesNotMatch(source, /\.inputValidator\(/, `${file} still uses deprecated inputValidator`);
  }
});

test("Phase 2 observability is wired into the application shell", () => {
  const root = read("src/routes/__root.tsx");
  const installer = read("src/components/RouteTimingInstaller.tsx");
  assert.match(root, /RouteTimingInstaller/);
  assert.match(installer, /installRouteTiming/);
});

test("Temporary Phase 1 lockfile automation is not carried forward", () => {
  assert.equal(exists(".github/workflows/refresh-lockfile.yml"), false);
});
