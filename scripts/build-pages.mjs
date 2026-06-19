// Post-build step: prepare dist/client for Cloudflare Pages "advanced mode".
//
// Cloudflare Pages picks up `_worker.js` (directory form) and `_routes.json`
// from the upload root. We copy the Nitro server bundle into
// dist/client/_worker.js/ so the same artifact deploys via:
//   - `wrangler pages deploy dist/client`
//   - the Pages dashboard direct-upload / Git integration
//   - (and the Workers Static-Assets flow keeps working via dist/server)

import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const serverDir = join(root, "dist", "server");
const clientDir = join(root, "dist", "client");
const workerDir = join(clientDir, "_worker.js");

if (!existsSync(serverDir)) {
  console.error("[build-pages] dist/server missing — run `vite build` first.");
  process.exit(1);
}
if (!existsSync(clientDir)) {
  console.error("[build-pages] dist/client missing — run `vite build` first.");
  process.exit(1);
}

// Reset the worker directory so re-runs are deterministic.
rmSync(workerDir, { recursive: true, force: true });
mkdirSync(workerDir, { recursive: true });

// Copy every server artifact (index.mjs + _libs/* + _ssr/*) into _worker.js/.
for (const entry of readdirSync(serverDir, { withFileTypes: true })) {
  // Skip deployment metadata generated inside the server build output.
  if (entry.name === "wrangler.json") continue;
  cpSync(join(serverDir, entry.name), join(workerDir, entry.name), {
    recursive: true,
  });
}

// Cloudflare Pages requires the entry to be `_worker.js/index.js`.
const entryMjs = join(workerDir, "index.mjs");
const entryJs = join(workerDir, "index.js");
if (existsSync(entryMjs)) {
  renameSync(entryMjs, entryJs);
}
if (!existsSync(entryJs)) {
  console.error("[build-pages] _worker.js/index.js missing after copy.");
  process.exit(1);
}

// Build _routes.json — tell Pages to bypass the worker for any top-level
// static file/dir in dist/client (favicons, /assets, robots, sitemap, etc.).
// Everything else is handled by the SSR worker.
const reserved = new Set(["_worker.js", "_routes.json", "_headers", "_redirects"]);
const exclude = [];
for (const entry of readdirSync(clientDir, { withFileTypes: true })) {
  if (reserved.has(entry.name)) continue;
  if (entry.name.startsWith("_")) continue; // Pages-reserved prefix
  const full = join(clientDir, entry.name);
  if (entry.isDirectory() || statSync(full).isDirectory()) {
    exclude.push(`/${entry.name}/*`);
  } else {
    exclude.push(`/${entry.name}`);
  }
}
// Pages enforces a 100-rule cap on exclude — we are well under that.
const routes = {
  version: 1,
  include: ["/*"],
  exclude,
};
writeFileSync(
  join(clientDir, "_routes.json"),
  JSON.stringify(routes, null, 2),
);

console.log(
  `[build-pages] dist/client ready for Cloudflare Pages (_worker.js + ${exclude.length} static excludes).`,
);
