import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const root = (path) => new URL(`../${path}`, import.meta.url);
const read = (path) => readFile(root(path), "utf8");

const phaseContracts = {
  A: ["tests/phase1-hardening.test.mjs", "scripts/diagnose-build.mjs", "ARCHITECTURE.md"],
  B: ["tests/studio-foundation.test.mjs", "src/lib/studio/design-document.ts", "src/lib/studio/export.ts"],
  C: ["tests/studio-creative-engine.test.mjs", "src/lib/studio/ai/creative-engine.ts"],
  D: ["tests/studio-background-engine.test.mjs", "src/lib/studio/background/magnific.ts"],
  E: ["tests/studio-digital-identity.test.mjs", "src/lib/studio/identity-format.ts"],
  F: ["tests/studio-email-regression.test.mjs", "src/routes/api.studio-email.ts"],
  G: ["tests/studio-admin-analytics.test.mjs", "src/routes/api.studio-admin.ts"],
  H: ["tests/studio-phase-h-qa.test.mjs", "tests/studio-phase-h-security.test.mjs", "tests/browser/studio-phase-h.spec.ts"],
};

for (const [phase, files] of Object.entries(phaseContracts)) {
  test(`Phase ${phase} has an executable regression contract`, async () => {
    for (const file of files) await access(root(file));
  });
}

test("CI and browser QA explicitly execute the regression surface", async () => {
  const ci = await read(".github/workflows/ci.yml");
  const browser = await read(".github/workflows/browser-qa.yml");
  assert.match(ci, /Regression tests A-H/);
  assert.match(ci, /npm test/);
  assert.match(browser, /npx playwright test/);
  assert.match(browser, /feat\/studio-qa-final/);
});

test("The architecture records production data recovery requirements", async () => {
  const architecture = await read("ARCHITECTURE.md");
  const recovery = await read("docs/DATA_RECOVERY.md");
  assert.match(architecture, /backup/i);
  assert.match(architecture, /disaster recovery/i);
  assert.match(recovery, /RPO/i);
  assert.match(recovery, /RTO/i);
  assert.match(recovery, /Supabase/i);
  assert.match(recovery, /restore/i);
});

test("Production print contract is explicit about bleed, crop marks and 300 DPI", async () => {
  const exporter = await read("src/lib/studio/export.ts");
  assert.match(exporter, /PRINT_DPI = 300/);
  assert.match(exporter, /BLEED_MM = 3/);
  assert.match(exporter, /CROP_MARK_MM = 5/);
  assert.match(exporter, /exportPrintPdf/);
  assert.match(exporter, /crop marks/);
});
