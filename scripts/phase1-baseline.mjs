#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173";
const routes = [
  ["/", "home"],
  ["/portfolio", "portfolio"],
  ["/portfolio/absa", "case-absa"],
  ["/services", "services"],
  ["/credentials", "credentials"],
  ["/contact", "contact"],
  ["/studio", "studio"],
  ["/__phase1_missing__", "404"],
  ["/admin", "admin"],
  ["/admin/studio", "admin-studio"],
];
const viewports = [
  [1440, 900, "desktop"],
  [390, 844, "mobile"],
];

await fs.mkdir("docs/baseline/screens", { recursive: true });
await fs.mkdir("docs/baseline/axe", { recursive: true });

const browser = await chromium.launch();
const summary = [];

for (const [width, height, viewportName] of viewports) {
  const context = await browser.newContext({ viewport: { width, height } });
  for (const [route, slug] of routes) {
    const page = await context.newPage();
    const started = performance.now();
    let status = null;
    let error = null;
    try {
      const response = await page.goto(new URL(route, baseURL).toString(), { waitUntil: "networkidle", timeout: 60_000 });
      status = response?.status() ?? null;
      await page.screenshot({
        path: path.resolve("docs/baseline/screens", `${slug}-${viewportName}.png`),
        fullPage: false,
      });
      const axe = await new AxeBuilder({ page }).analyze();
      await fs.writeFile(
        path.resolve("docs/baseline/axe", `${slug}-${viewportName}.json`),
        JSON.stringify(axe, null, 2) + "\n",
      );
    } catch (e) {
      error = String(e);
    }
    summary.push({ route, slug, viewport: viewportName, status, ms: Math.round(performance.now() - started), error });
    await page.close();
  }
  await context.close();
}

const noJsContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
const noJsPage = await noJsContext.newPage();
let noJsStatus = null;
let noJsError = null;
try {
  const response = await noJsPage.goto(new URL("/", baseURL).toString(), { waitUntil: "domcontentloaded", timeout: 60_000 });
  noJsStatus = response?.status() ?? null;
} catch (e) {
  noJsError = String(e);
}
await noJsPage.screenshot({ path: path.resolve("docs/baseline/screens/home-no-js-desktop.png"), fullPage: false }).catch(() => {});
await noJsPage.close();
await noJsContext.close();
await browser.close();

await fs.writeFile(
  "docs/baseline/playwright-summary.json",
  JSON.stringify({ baseURL, generatedAt: new Date().toISOString(), routes: summary, noJs: { status: noJsStatus, error: noJsError } }, null, 2) + "\n",
);

const failures = summary.filter((x) => x.error);
const axeFiles = await fs.readdir("docs/baseline/axe");
let axeViolationCount = 0;
for (const file of axeFiles.filter((f) => f.endsWith(".json"))) {
  const data = JSON.parse(await fs.readFile(path.join("docs/baseline/axe", file), "utf8"));
  axeViolationCount += Array.isArray(data.violations) ? data.violations.length : 0;
}
if (failures.length || axeViolationCount > 0 || noJsError) {
  console.error(`Phase 1 browser baseline failed: page-errors=${failures.length}, axe-violation-groups=${axeViolationCount}, no-js-error=${noJsError ? 1 : 0}`);
  process.exit(1);
}
console.log(`Phase 1 browser baseline passed: ${summary.length} screenshots, no-JS status=${noJsStatus}, axe violation groups=${axeViolationCount}.`);
