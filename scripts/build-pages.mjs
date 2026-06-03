// Post-build step: prepare dist/client for Cloudflare Pages "advanced mode".
// Pages picks up `_worker.js` (directory form) and `_routes.json` from the
// upload root. We copy the Nitro server bundle into dist/client/_worker.js/
// so the same artifact deploys via `wrangler pages deploy dist/client` or
// the Pages dashboard direct-upload flow, in addition to the Workers
// Static-Assets flow (`wrangler deploy`) that uses dist/server.

import { cpSync, existsSync, mkdirSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const serverDir = join(root, "dist", "server");
const clientDir = join(root, "dist", "client");
const workerDir = join(clientDir, "_worker.js");

if (!existsSync(serverDir)) {
  console.error("[build-pages] dist/server missing — run `vite build` first.");
  process.exit(1);
}

// Reset the worker directory
rmSync(workerDir, { recursive: true, force: true });
mkdirSync(workerDir, { recursive: true });

// Copy every server artifact (index.mjs + _libs/* + _ssr/*) into _worker.js/
for (const entry of readdirSync(serverDir, { withFileTypes: true })) {
  // Skip the generated wrangler.json — it is only used by `wrangler deploy`.
  if (entry.name === "wrangler.json") continue;
  cpSync(join(serverDir, entry.name), join(workerDir, entry.name), { recursive: true });
}

// Cloudflare Pages requires the entry to be `_worker.js/index.js`.
renameSync(join(workerDir, "index.mjs"), join(workerDir, "index.js"));

// Tell Pages to bypass the worker for static assets — they are served
// directly from the edge cache.
const routes = {
  version: 1,
  include: ["/*"],
  exclude: ["/assets/*", "/favicon.ico", "/favicon.webp", "/_headers"],
};
writeFileSync(join(clientDir, "_routes.json"), JSON.stringify(routes, null, 2));

console.log("[build-pages] dist/client ready for Cloudflare Pages (advanced _worker.js).");
