#!/usr/bin/env node
import { spawn } from "node:child_process";
import { gzipSync } from "node:zlib";
import process from "node:process";
import { chromium } from "@playwright/test";

const routes = ["/", "/portfolio", "/portfolio/absa", "/services", "/credentials", "/contact", "/studio"];
const limits = {
  jsGzip: 170 * 1024,
  cssGzip: 30 * 1024,
  fontsGzip: 120 * 1024,
  lcpImage: 150 * 1024,
};

const server = spawn("npm", ["start"], {

  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, PORT: "4173", HOST: "127.0.0.1", NITRO_PORT: "4173", NITRO_HOST: "127.0.0.1" },
});
let serverOutput = "";
server.stdout.on("data", (chunk) => (serverOutput += chunk.toString()));
server.stderr.on("data", (chunk) => (serverOutput += chunk.toString()));

async function waitForServer() {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch("http://127.0.0.1:4173/");
      if (response.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Local server failed to start. Output:\n${serverOutput.slice(-5000)}`);
}

function isReelChunk(url) {
  return /cinematic|portfolio-reel|reel/i.test(new URL(url).pathname);
}

await waitForServer();
const browser = await chromium.launch();
const results = [];

try {
  for (const route of routes) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const resources = [];
    page.on("response", (response) => {
      const url = response.url();
      const pathname = new URL(url).pathname;
      const isAsset = /\.(m?js|css|woff2?|ttf|otf|png|jpe?g|webp|avif)$/i.test(pathname);
      if (isAsset && !isReelChunk(url)) resources.push({ response, url, pathname });
    });

    await page.goto(`http://127.0.0.1:4173${route}`, { waitUntil: "networkidle", timeout: 60_000 });
    await page.waitForTimeout(250);

    const totals = { jsGzip: 0, cssGzip: 0, fontsGzip: 0 };
    for (const item of resources) {
      const ext = item.pathname.split("?")[0].toLowerCase();
      if (!/\.(m?js|css|woff2?|ttf|otf)$/.test(ext)) continue;
      try {
        const body = await item.response.body();
        const gz = gzipSync(body).byteLength;
        if (/\.(m?js)$/.test(ext)) totals.jsGzip += gz;
        else if (/\.css$/.test(ext)) totals.cssGzip += gz;
        else totals.fontsGzip += gz;
      } catch {}
    }

    const lcp = await page.evaluate(() => {
      const entries = performance.getEntriesByType("largest-contentful-paint");
      const last = entries.at(-1);
      return last && "element" in last && last.element instanceof Element
        ? {
            url: last.element.tagName === "IMG" ? last.element.currentSrc || last.element.src : "",
          }
        : { url: "" };
    });

    let lcpImage = 0;
    if (lcp.url) {
      const match = resources.find((r) => r.url === lcp.url);
      if (match) {
        try { lcpImage = (await match.response.body()).byteLength; } catch {}
      }
    }

    const result = {
      route,
      ...totals,
      lcpImage,
      pass:
        totals.jsGzip <= limits.jsGzip &&
        totals.cssGzip <= limits.cssGzip &&
        totals.fontsGzip <= limits.fontsGzip &&
        (!lcp.url || lcpImage === 0 || lcpImage <= limits.lcpImage),
    };
    results.push(result);
    await page.close();
  }
} finally {
  await browser.close();
  server.kill("SIGTERM");
}

console.log(JSON.stringify({ limits, results }, null, 2));
const failures = results.filter((r) => !r.pass);
if (failures.length) {
  console.error(`Phase 2 performance budget failed on ${failures.length} route(s).`);
  process.exit(1);
}
console.log(`Phase 2 performance budget passed for ${results.length} routes.`);
