import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const matrix = await readFile(new URL("../../docs/audit/MATRIZ.md", import.meta.url), "utf8");

test("matrix exposes the core verification IDs", () => {
  for (const id of ["G-01","P-01","PAR-01","VIS-01","FUN-01","SEC-01","PERF-01","A11Y-01","RES-01","HON-04"]) {
    assert.match(matrix, new RegExp("\\| " + id + " \\|"));
  }
});
