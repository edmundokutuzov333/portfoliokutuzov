import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function read(relativePath) {
  return readFile(path.join(ROOT, relativePath), "utf8");
}

test("canonical origin uses the apex Edmundo Kutuzov domain", async () => {
  const seo = await read("src/lib/seo.ts");
  const publicConfig = await read("src/config/public.ts");
  const serverConfig = await read("src/config/server.ts");
  const robots = await read("public/robots.txt");
  const sitemap = await read("src/routes/sitemap[.]xml.ts");

  assert.match(seo, /SITE_ORIGIN = "https:\/\/edmundokutuzov\.art"/);
  assert.match(publicConfig, /https:\/\/edmundokutuzov\.art/);
  assert.match(serverConfig, /DEFAULT_PUBLIC_SITE_URL = "https:\/\/edmundokutuzov\.art"/);
  assert.match(robots, /Sitemap: https:\/\/edmundokutuzov\.art\/sitemap\.xml/);
  assert.doesNotMatch(sitemap, /portfoliokutuzov-omega\.vercel\.app/);
  assert.match(sitemap, /"\/studio"/);
  assert.doesNotMatch(sitemap, /"\/studio\/identity"/);
});

test("application config does not introduce a conflicting host redirect", async () => {
  const config = await read("vercel.json");
  assert.doesNotMatch(config, /"type": "host"/);
  assert.doesNotMatch(config, /"value": "www\.edmundokutuzov\.art"/);
  assert.doesNotMatch(config, /"destination": "https:\/\/edmundokutuzov\.art\/\$1"/);
});

test("security headers include CSP and existing protections", async () => {
  const config = await read("vercel.json");
  const required = [
    "Content-Security-Policy",
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-src 'self' https://www.youtube.com https://player.vimeo.com",
    "Strict-Transport-Security",
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Referrer-Policy",
    "Permissions-Policy",
  ];
  for (const directive of required) assert.ok(config.includes(directive), directive);
});

test("server-only Supabase client fails closed without real secrets", async () => {
  const source = await read("src/integrations/supabase/client.server.ts");
  assert.match(source, /process\.env\.SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(source, /Missing Supabase server environment variables/);
  assert.doesNotMatch(source, /placeholder-admin/);
  assert.doesNotMatch(source, /placeholder-project/);
});

test("database backup requires certificate and hostname verification", async () => {
  const workflow = await read(".github/workflows/supabase-backup.yml");
  assert.match(workflow, /PGSSLMODE: verify-full/);
  assert.doesNotMatch(workflow, /PGSSLMODE: require\b/);
});

test("Studio remains private until explicitly launched", async () => {
  const flag = await read("src/lib/studio/public-launch.ts");
  const landing = await read("src/routes/studio.tsx");
  const signal = await read("src/components/studio/StudioConstructionSignal.tsx");
  assert.match(flag, /VITE_STUDIO_PUBLIC_ENABLED === "true"/);
  assert.match(landing, /Under Construction/);
  assert.match(signal, /currently under construction/);
  assert.match(landing, /STUDIO_PUBLIC_ENABLED/);
  assert.match(landing, /robots/);

  for (const route of [
    "src/routes/studio.business-card.tsx",
    "src/routes/studio.background.tsx",
    "src/routes/studio.identity.tsx",
    "src/routes/card.$token.tsx",
    "src/routes/api.studio-background.ts",
    "src/routes/api.studio-creative.ts",
    "src/routes/api.studio-publish.ts",
    "src/routes/api.studio-email.ts",
    "src/routes/api.studio-vcard.ts",
    "src/routes/api.studio-card.ts",
    "src/routes/api.studio-admin.ts",
    "src/routes/api.studio-public-card.ts",
  ]) {
    const source = await read(route);
    assert.match(source, /STUDIO_PUBLIC_ENABLED/);
  }
});

test("Studio construction signal points visitors to the portfolio", async () => {
  const component = await read("src/components/studio/StudioConstructionSignal.tsx");
  assert.match(component, /Kutuzov Studio is currently under construction/);
  assert.match(component, /to="\/portfolio"/);
  assert.match(component, /Something is/);
  assert.match(component, /taking shape\./);
  assert.match(component, /studio-signal-orbit/);
  assert.match(component, /\[perspective:1200px\]/);
});
