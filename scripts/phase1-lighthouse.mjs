#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173";
const routes = ["/", "/portfolio", "/portfolio/absa", "/services", "/credentials", "/contact", "/studio"];
await fs.mkdir("docs/baseline/lighthouse", { recursive: true });

try {
  const version = execFileSync("npx", ["--yes", "lighthouse", "--version"], { encoding: "utf8" }).trim();
  await fs.writeFile("docs/baseline/lighthouse/version.txt", version + "\n");
  console.log("Lighthouse", version);
} catch (error) {
  console.error("Unable to resolve Lighthouse:", error);
  process.exit(1);
}

const runs = [];
for (const route of routes) {
  for (const mode of ["mobile", "desktop"]) {
    const slug = route === "/" ? "home" : route.replace(/^\//, "").replaceAll("/", "-");
    const output = path.resolve("docs/baseline/lighthouse", `${slug}-${mode}.json`);
    const url = new URL(route, baseURL).toString();
    const args = [
      "--yes",
      "lighthouse",
      url,
      "--quiet",
      "--output=json",
      `--output-path=${output}`,
      "--only-categories=performance,accessibility,seo",
      "--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage",
      "--max-wait-for-load=15000",
    ];
    if (mode === "desktop") args.push("--preset=desktop");
    try {
      execFileSync("npx", args, { stdio: "inherit" });
      const report = JSON.parse(await fs.readFile(output, "utf8"));
      runs.push({
        route,
        mode,
        performance: report.categories?.performance?.score ?? null,
        accessibility: report.categories?.accessibility?.score ?? null,
        seo: report.categories?.seo?.score ?? null,
      });
    } catch (error) {
      runs.push({ route, mode, error: String(error) });
    }
  }
}

const markdown = [
  "# Lighthouse baseline — Phase 1",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "| Route | Mode | Performance | Accessibility | SEO | Error |",
  "|---|---|---:|---:|---:|---|",
  ...runs.map((r) => `| ${r.route} | ${r.mode} | ${r.performance == null ? "" : r.performance} | ${r.accessibility == null ? "" : r.accessibility} | ${r.seo == null ? "" : r.seo} | ${r.error ?? ""} |`),
  "",
];
await fs.writeFile("docs/baseline/lighthouse/summary.md", markdown.join("\n"));

if (runs.some((r) => r.error)) process.exit(1);
console.log(`Lighthouse baseline complete: ${runs.length} route/mode runs.`);
