import assert from "node:assert/strict";
import fs from "node:fs";

const read = (file) => fs.readFileSync(file, "utf8");

test("Phase 2 foundation is pinned to Node 24 and strict TypeScript", () => {
  const ts = JSON.parse(read("tsconfig.json"));
  const pkg = JSON.parse(read("package.json"));
  assert.equal(ts.compilerOptions.strict, true);
  assert.equal(pkg.engines.node, "24.x");
  assert.equal(read(".nvmrc").trim(), "24");
});

test("Nitro uses Vercel preset", () => {
  const vite = read("vite.config.js");
  assert.match(vite, /nitro:\s*\{\s*preset:\s*"vercel"/);
});

test("Vercel guardrails are Report-Only and private admin paths are noindex", () => {
  const vercel = JSON.parse(read("vercel.json"));
  const allHeaders = vercel.headers.flatMap((entry) => entry.headers.map((h) => h.key));
  assert.ok(allHeaders.includes("Content-Security-Policy-Report-Only"));
  assert.equal(allHeaders.includes("Content-Security-Policy"), false);
  const adminHeaders = vercel.headers.find((entry) => entry.source === "/admin(.*)");
  assert.equal(
    adminHeaders?.headers.find((h) => h.key === "X-Robots-Tag")?.value,
    "noindex, nofollow",
  );
});

test("Foundation gate scripts and instrumentation are wired", () => {
  const pkg = JSON.parse(read("package.json"));
  const root = read("src/routes/__root.tsx");
  const ci = read(".github/workflows/ci.yml");
  assert.equal(pkg.scripts["test:change-gate"], "node scripts/change-gate.mjs");
  assert.equal(pkg.scripts["test:parity"], "node scripts/parity.mjs");
  assert.equal(pkg.scripts["test:performance"], "node scripts/phase2-performance-budget.mjs");
  assert.match(root, /@vercel\/speed-insights\/react/);
  assert.match(root, /<SpeedInsights \/>/);
  assert.match(ci, /npx playwright install --with-deps chromium/);
  assert.match(ci, /npm run test:parity/);
  assert.match(ci, /npm run test:change-gate/);
  assert.match(ci, /npm run test:performance/);
});

test("Playwright retains the full cross-browser and mobile matrix", () => {
  const config = read("playwright.config.ts");
  for (const token of ["chromium", "firefox", "webkit", "iphone-safari", "android-chrome"]) {
    assert.match(config, new RegExp(token));
  }
});

test("Architecture baseline documents Node/Vercel runtime boundaries", () => {
  const architecture = read("docs/ARCHITECTURE.md");
  assert.match(architecture, /Node\.js 24/);
  assert.match(architecture, /Nitro.*vercel/i);
  assert.match(architecture, /server route/i);
});
