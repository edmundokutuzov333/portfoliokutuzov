#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const origins = ["https://edmundokutuzov.art", "https://www.edmundokutuzov.art"];
const routes = ["/", "/portfolio", "/portfolio/absa", "/services", "/credentials", "/contact", "/studio", "/__phase1_missing__"];
const userAgents = [
  ["browser", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/153 Safari/537.36"],
  ["googlebot", "Googlebot/2.1 (+http://www.google.com/bot.html)"],
  ["facebookexternalhit", "facebookexternalhit/1.1"],
  ["whatsapp", "WhatsApp/2.23.20.0"],
  ["linkedinbot", "LinkedInBot/1.0"],
  ["twitterbot", "Twitterbot/1.0"],
  ["curl", "curl/8.0"],
];

const results = [];
for (const origin of origins) {
  for (const route of routes) {
    for (const [uaName, userAgent] of userAgents) {
      const url = new URL(route, origin).toString();
      const started = performance.now();
      try {
        const response = await fetch(url, {
          redirect: "manual",
          headers: { "user-agent": userAgent, accept: "text/html,application/xhtml+xml" },
        });
        results.push({
          origin,
          route,
          ua: uaName,
          status: response.status,
          statusText: response.statusText,
          ms: Math.round(performance.now() - started),
          location: response.headers.get("location"),
          xRobotsTag: response.headers.get("x-robots-tag"),
          xVercelId: response.headers.get("x-vercel-id"),
          cacheControl: response.headers.get("cache-control"),
          contentType: response.headers.get("content-type"),
        });
      } catch (error) {
        results.push({
          origin,
          route,
          ua: uaName,
          status: null,
          statusText: null,
          ms: Math.round(performance.now() - started),
          error: String(error),
        });
      }
    }
  }
}

const dir = path.resolve("docs/baseline");
await fs.mkdir(dir, { recursive: true });
await fs.writeFile(path.join(dir, "http-audit.json"), JSON.stringify(results, null, 2) + "\n");

const lines = [
  "# HTTP audit — Phase 1",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "| Origin | Route | UA | Status | ms | Location | X-Robots-Tag | Cache-Control | X-Vercel-ID |",
  "|---|---|---|---:|---:|---|---|---|---|",
  ...results.map((r) =>
    `| ${r.origin} | ${r.route} | ${r.ua} | ${r.status ?? "ERROR"} | ${r.ms} | ${r.location ?? ""} | ${r.xRobotsTag ?? ""} | ${r.cacheControl ?? ""} | ${r.xVercelId ?? ""} |`,
  ),
  "",
  "Expected production policy:",
  "- apex public routes should return 200 unless the route is intentionally a 404 test.",
  "- www should permanently redirect to the apex canonical origin.",
  "- public pages must not emit X-Robots-Tag: noindex.",
  "- the explicit missing-route probe should remain 404/410.",
];
await fs.writeFile(path.join(dir, "http-audit.md"), lines.join("\n") + "\n");

const hardFailures = results.filter((r) => r.status === null || (r.status >= 500 && r.route !== "/__phase1_missing__"));
const accidentalNoindex = results.filter((r) => r.origin.includes("edmundokutuzov.art") && !r.origin.includes("www.") && (r.xRobotsTag ?? "").toLowerCase().includes("noindex"));
const badApexRedirect = results.filter((r) => !r.origin.includes("www.") && r.route !== "/__phase1_missing__" && r.status >= 300 && r.status < 400);
const badMissing = results.filter((r) => r.route === "/__phase1_missing__" && r.status !== 404 && r.status !== 410 && !(r.origin.includes("www.") && r.status >= 300 && r.status < 400));
if (hardFailures.length || accidentalNoindex.length || badApexRedirect.length || badMissing.length) {
  console.error(`Phase 1 HTTP audit failed: 5xx/network=${hardFailures.length}, noindex=${accidentalNoindex.length}, apex-redirect=${badApexRedirect.length}, missing-route=${badMissing.length}`);
  process.exit(1);
}
console.log(`Phase 1 HTTP audit passed for ${results.length} origin/route/user-agent combinations.`);
