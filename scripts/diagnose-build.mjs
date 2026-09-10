#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let errors = 0;
let warnings = 0;

function fileExists(relativePath) {
  return fs.existsSync(path.join(ROOT_DIR, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT_DIR, relativePath), "utf8");
}

function pass(message) {
  console.log(`  [PASS] ${message}`);
}

function warn(message) {
  warnings += 1;
  console.log(`  [WARN] ${message}`);
}

function fail(message) {
  errors += 1;
  console.log(`  [FAIL] ${message}`);
}

function section(title) {
  console.log(`\n== ${title} ==`);
}

console.log("\nPRODUCTION ARCHITECTURE DIAGNOSTIC\n");

section("Runtime and package contract");
const packageJson = JSON.parse(read("package.json"));
if (packageJson.engines?.node === "24.x") pass("package.json requires Node 24.x");
else fail("package.json is not pinned to Node 24.x");
if (read(".nvmrc").trim() === "24") pass(".nvmrc is aligned to Node 24");
else fail(".nvmrc is not aligned to Node 24");
if (packageJson.scripts?.test && packageJson.scripts?.diagnose && packageJson.scripts?.check) {
  pass("verification scripts are registered");
} else {
  fail("verification scripts are incomplete");
}

section("TanStack Start SSR contract");
const client = read("src/client.tsx");
const root = read("src/routes/__root.tsx");
const vercel = JSON.parse(read("vercel.json"));
if (/StartClient/.test(client) && /hydrateRoot\(\s*document/.test(client))
  pass("client entry hydrates TanStack Start through StartClient");
else fail("client entry is not the expected TanStack Start hydration entry");
if (
  /<html[^>]*>/.test(root) &&
  /<head[^>]*>/.test(root) &&
  /<body[^>]*>/.test(root) &&
  /<HeadContent\s*\/>/.test(root) &&
  /<Scripts\s*\/>/.test(root)
) {
  pass("root shell is a complete SSR document");
} else {
  fail("root shell is missing required SSR document elements");
}
if (vercel.framework === "tanstack-start") pass("Vercel framework is tanstack-start");
else fail("Vercel framework is not tanstack-start");
if (!fileExists("index.html") && !fileExists("src/main.tsx"))
  pass("legacy Vite SPA entry files are absent");
else fail("legacy index.html/src/main.tsx entry remains");

section("Configuration boundaries");
const publicConfig = read("src/config/public.ts");
const serverConfig = read("src/config/server.ts");
const supabaseClient = read("src/integrations/supabase/client.ts");
if (
  /@\/config\/public/.test(supabaseClient) &&
  !/placeholder-project\.supabase\.co/.test(supabaseClient)
) {
  pass("Supabase client uses centralized public configuration");
} else {
  fail("Supabase configuration is duplicated or contains placeholder runtime configuration");
}
if (/VITE_SUPABASE_URL/.test(publicConfig) && /VITE_SUPABASE_PUBLISHABLE_KEY/.test(publicConfig))
  pass("public environment mapping is centralized");
else fail("public environment mapping is incomplete");
if (/getAllowedCorsOrigins/.test(serverConfig) && /getCorsHeaders/.test(serverConfig))
  pass("server policy configuration is centralized");
else fail("server policy configuration is incomplete");

section("Admin security");
const adminAuth = read("src/hooks/useAdmin.ts");
const adminRoute = read("src/routes/admin.tsx");
if (
  /admin_users/.test(adminAuth) &&
  /verifyAdmin/.test(adminAuth) &&
  !/mock_admin_email/.test(adminAuth)
)
  pass("admin authorization requires Supabase admin membership");
else fail("admin authorization still permits mock/local access");
if (/noindex, nofollow/.test(adminRoute)) pass("admin route is excluded from search indexing");
else warn("admin route does not explicitly set noindex/nofollow");
if (!fileExists("patch_login.cjs")) pass("legacy admin login patch script is absent");
else fail("legacy admin login patch script still exists");

// The old bypass was in a large route file. Keep a source-level tripwire so it
// can never be accidentally reintroduced without failing diagnostics.
const adminLazy = fileExists("src/routes/admin.lazy.tsx") ? read("src/routes/admin.lazy.tsx") : "";
if (!/mock_admin_email|Admin123|admin123/.test(adminLazy))
  pass("no hardcoded admin credential markers remain in the admin bundle");
else fail("hardcoded admin credential markers remain in the admin route");

section("AI API security");
const chatApi = read("src/routes/api.chat.ts");
if (
  !/isCorsOriginAllowed/.test(chatApi) ||
  /Access-Control-Allow-Origin["']?\s*:\s*["']\*["']/.test(chatApi)
) {
  fail("chat API origin policy is unsafe");
} else pass("chat API uses an origin allowlist");
if (/RATE_LIMIT_WINDOW_MS/.test(chatApi) && /checkRateLimit/.test(chatApi))
  pass("chat API has server-side rate limiting");
else fail("chat API rate limiting is missing");
if (/MAX_BODY_BYTES/.test(chatApi) && /hasAcceptableBodySize/.test(chatApi))
  pass("chat API validates request size");
else fail("chat API request-size validation is missing");

section("Legacy architecture scan");
const filesToScan = ["src", "scripts", "vite.config.js", "vercel.json"];
let legacyHits = 0;
function scan(target) {
  const absolute = path.join(ROOT_DIR, target);
  if (!fs.existsSync(absolute)) return;
  const stat = fs.statSync(absolute);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(absolute)) {
      scan(path.join(target, entry));
    }
    return;
  }
  if (!/\.(ts|tsx|js|mjs|json)$/.test(target)) return;
  const content = fs.readFileSync(absolute, "utf8");
  for (const pattern of [/from ["']react-router-dom["']/g, /createRoot\(/g]) {
    const matches = content.match(pattern);
    legacyHits += matches?.length ?? 0;
  }
}
for (const target of filesToScan) scan(target);
if (legacyHits === 0) pass("no legacy react-router-dom/createRoot bootstrap remains");
else fail(`legacy bootstrap patterns found (${legacyHits} hit(s))`);

for (const stalePath of [
  "config.toml",
  "public/_headers",
  "MOBILE_README.md",
  "test-prod.mjs",
  "eslint-output.txt",
]) {
  if (fileExists(stalePath)) warn(`stale migration/tooling file remains: ${stalePath}`);
}

section("Build output");
const outputDir = path.join(ROOT_DIR, ".vercel", "output");
if (!fs.existsSync(outputDir)) {
  warn(".vercel/output is not present yet; build output checks will run after npm run build");
} else {
  const assetsDir = path.join(outputDir, "static", "assets");
  const serverDir = path.join(outputDir, "functions", "__server.func");
  if (fs.existsSync(assetsDir)) pass("Vercel static asset output exists");
  else fail("Vercel static asset output is missing");
  if (fs.existsSync(serverDir)) pass("Vercel SSR function output exists");
  else fail("Vercel SSR function output is missing");
}

section("Diagnostic summary");
console.log(`  Errors: ${errors}`);
console.log(`  Warnings: ${warnings}`);

if (errors > 0) {
  console.error("\nProduction architecture diagnostic failed.\n");
  process.exit(1);
}

console.log("\nProduction architecture diagnostic passed.\n");
