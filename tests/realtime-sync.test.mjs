import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const read = (p) => readFileSync(join(process.cwd(), p), "utf8");

test("public structured content has uniform realtime invalidation", () => {
  const source = read("src/hooks/useSiteData.ts");
  for (const table of ["site_settings","clients","projects","services","stats","about_method"]) {
    assert.match(source, new RegExp('useRealtimeInvalidate\\("' + table + '"'));
  }
});