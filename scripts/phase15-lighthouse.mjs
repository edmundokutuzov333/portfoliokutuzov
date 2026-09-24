#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const base = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173";
const routes = ["/", "/portfolio", "/services", "/credentials", "/contact", "/studio", "/pt", "/pt/portfolio", "/pt/services", "/pt/credentials", "/pt/contact", "/pt/studio"];
const outDir = path.resolve(".phase15-lighthouse");
await fs.rm(outDir, { recursive: true, force: true });
await fs.mkdir(outDir, { recursive: true });
const results = [];
for (const mode of ["desktop", "mobile"]) {
  for (const route of routes) {
    const safe = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
    const output = path.join(outDir, `${safe}-${mode}.json`);
    const args = ["--yes", "lighthouse@13.5.0", new URL(route, base).toString(), "--quiet", "--output=json", `--output-path=${output}`, "--only-categories=performance,accessibility,best-practices,seo", "--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage", "--max-wait-for-load=20000"];
    if (mode === "desktop") args.push("--preset=desktop");
    const run = spawnSync("npx", args, { stdio: "inherit", encoding: "utf8" });
    if (run.status !== 0) { results.push({ mode, route, error: "lighthouse process failed" }); continue; }
    const report = JSON.parse(await fs.readFile(output, "utf8"));
    const score = (key) => report.categories?.[key]?.score ?? null;
    const audits = report.audits ?? {};
    const lcp = audits["largest-contentful-paint"]?.numericValue ?? null;
    const cls = audits["cumulative-layout-shift"]?.numericValue ?? null;
    const inp = audits["interaction-to-next-paint"]?.numericValue ?? null;
    const pass = score("performance") !== null && score("performance") >= (mode === "desktop" ? 0.9 : 0.85) && score("accessibility") !== null && score("accessibility") >= 0.95 && score("best-practices") !== null && score("best-practices") >= 0.95 && score("seo") === 1 && (lcp === null || lcp < 2500) && (cls === null || cls < 0.1) && (inp === null || inp < 200);
    results.push({ mode, route, performance: score("performance"), accessibility: score("accessibility"), bestPractices: score("best-practices"), seo: score("seo"), lcp, cls, inp, pass });
  }
}
await fs.mkdir("docs/rebuild", { recursive: true });
await fs.writeFile("docs/rebuild/phase15-lighthouse.json", JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));
if (results.some((item) => item.error || !item.pass)) process.exit(1);
console.log("Phase 15 Lighthouse gate: PASS");