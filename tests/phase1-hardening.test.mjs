import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

test("Node runtime is pinned consistently to 24", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.engines?.node, "24.x");
  assert.equal(read(".nvmrc").trim(), "24");
});

test("Vercel is configured for TanStack Start", () => {
  const vercel = JSON.parse(read("vercel.json"));
  assert.equal(vercel.framework, "tanstack-start");
});

test("SSR client entry uses StartClient hydration", () => {
  const client = read("src/client.tsx");
  assert.match(client, /StartClient/);
  assert.match(client, /hydrateRoot\(\s*document/);
  assert.doesNotMatch(client, /createRoot\(/);
  assert.equal(exists("index.html"), false);
  assert.equal(exists("src/main.tsx"), false);
});

test("Supabase configuration has one public source of truth", () => {
  const config = read("src/config/public.ts");
  const client = read("src/integrations/supabase/client.ts");
  assert.match(config, /DEFAULT_SUPABASE_URL/);
  assert.match(config, /VITE_SUPABASE_URL/);
  assert.match(client, /@\/config\/public/);
  assert.doesNotMatch(client, /placeholder-project\.supabase\.co/);
});

test("Admin auth cannot grant access from local mock state", () => {
  const auth = read("src/hooks/useAdmin.ts");
  assert.doesNotMatch(auth, /mock_admin_email/);
  assert.match(auth, /admin_users/);
  assert.match(auth, /verifyAdmin/);
});

test("Admin route boundary is isolated from the control-room implementation", () => {
  const route = read("src/routes/admin.lazy.tsx");
  assert.match(route, /@\/components\/admin\/AdminControlRoom/);
  assert.equal(exists("src/components/admin/AdminControlRoom.tsx"), true);
});

test("Legacy login patch script is absent", () => {
  assert.equal(exists("patch_login.cjs"), false);
});

test("Chat API does not use wildcard CORS", () => {
  const api = read("src/routes/api.chat.ts");
  assert.doesNotMatch(api, /Access-Control-Allow-Origin["']?\s*:\s*["']\*["']/);
  assert.match(api, /isCorsOriginAllowed/);
  assert.match(api, /RATE_LIMIT_WINDOW_MS/);
  assert.match(api, /MAX_BODY_BYTES/);
});

test("Package manifest and lockfile root dependencies are synchronized", () => {
  const pkg = JSON.parse(read("package.json"));
  const lock = JSON.parse(read("package-lock.json"));
  const root = lock.packages?.[""];
  assert.ok(root, "package-lock root package entry is missing");
  assert.deepEqual(root.dependencies, pkg.dependencies);
  assert.deepEqual(root.devDependencies, pkg.devDependencies);
  assert.deepEqual(root.engines, pkg.engines);
});

test("Phase one verification commands exist", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.scripts?.test, "node --test tests/*.test.mjs");
  assert.equal(typeof pkg.scripts?.diagnose, "string");
  assert.equal(typeof pkg.scripts?.check, "string");
});
