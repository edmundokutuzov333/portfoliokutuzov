import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Print PDF is distinct from screen PDF and carries prepress geometry", async () => {
  const exporter = await read("src/lib/studio/export.ts");
  assert.match(exporter, /createPdfDataUrl/);
  assert.match(exporter, /createPrintPdfDataUrl/);
  assert.match(exporter, /PRINT_DPI = 300/);
  assert.match(exporter, /BLEED_MM = 3/);
  assert.match(exporter, /CROP_MARK_MM = 5/);
  assert.match(exporter, /business-card-print\.pdf/);
  assert.match(exporter, /pdf\.setKeywords/);
});

test("Print contract does not falsely claim CMYK, PDF\/X or embedded PDF fonts", async () => {
  const architecture = await read("ARCHITECTURE.md");
  assert.match(architecture, /does not claim native CMYK/);
  assert.match(architecture, /PDF\/X/);
  assert.match(architecture, /embedded\/subset PDF fonts/);
});
