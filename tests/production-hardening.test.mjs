import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("canonical origin is the apex custom domain everywhere in the public SEO surface", async () => {
  const seo = await read("src/lib/seo.ts");
  const config = await read("src/config/public.ts");
  const server = await read("src/config/server.ts");
  const sitemap = await read("src/routes/sitemap[.]xml.ts");
  const robots = await read("public/robots.txt");
  const e2e = await read("scripts/production-gemini-e2e.mjs");

  for (const source of [seo, config, server, sitemap, robots, e2e]) {
    assert.doesNotMatch(source, /portfoliokutuzov-omega\.vercel\.app/);
  }
  assert.match(seo, /SITE_ORIGIN = "https:\/\/edmundokutuzov\.art"/);
  assert.match(robots, /Sitemap: https:\/\/edmundokutuzov\.art\/sitemap\.xml/);
  assert.match(await read("src/config/server.ts"), /www\.edmundokutuzov\.art/);
});

test("www hostname is served directly so it cannot fall into a redirect loop", async () => {
  const server = await read("src/server.ts");
  assert.doesNotMatch(server, /redirectWwwToCanonical/);
  assert.doesNotMatch(server, /status: 308/);
});

test("Supabase service-role configuration fails closed without placeholders", async () => {
  const serverClient = await read("src/integrations/supabase/client.server.ts");
  assert.doesNotMatch(serverClient, /placeholder-project\.supabase\.co/);
  assert.doesNotMatch(serverClient, /placeholder-admin/);
  assert.match(serverClient, /Missing Supabase server environment variables/);
  assert.match(serverClient, /SUPABASE_SERVICE_ROLE_KEY/);
});

test("database backup enforces PostgreSQL certificate verification", async () => {
  const workflow = await read(".github/workflows/supabase-backup.yml");
  assert.match(workflow, /PGSSLMODE:\s*verify-full/);
  assert.doesNotMatch(workflow, /PGSSLMODE:\s*require/);
});

test("CSP covers the actual first-party and required external runtime dependencies", async () => {
  const vercel = await read("vercel.json");
  assert.match(vercel, /Content-Security-Policy/);
  for (const source of [
    "script-src 'self' 'unsafe-inline'",
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
    "https://*.supabase.co",
    "https://storage.googleapis.com",
    "https://generativelanguage.googleapis.com",
    "wss://generativelanguage.googleapis.com",
    "https://www.youtube.com",
    "https://player.vimeo.com",
    "object-src 'none'",
    "frame-ancestors 'none'",
  ]) {
    assert.ok(vercel.includes(source), `CSP is missing ${source}`);
  }
});

test("Studio remains available as a public construction page while unfinished surfaces stay private", async () => {
  const landing = await read("src/routes/studio.tsx");
  const signal = await read("src/components/studio/StudioConstructionSignal.tsx");
  const privateAccess = await read("src/lib/studio/public-access.ts");
  const background = await read("src/routes/studio.background.tsx");
  const businessCard = await read("src/routes/studio.business-card.tsx");
  const identity = await read("src/routes/studio.identity.tsx");
  const card = await read("src/routes/card.$token.tsx");

  assert.match(landing, /Something is/);
  assert.match(landing, /taking shape/);
  assert.match(landing, /whitespace-nowrap/);
  assert.match(landing, /Kutuzov Studio is currently under construction/);
  assert.match(landing, /Explore the portfolio/);
  assert.match(landing, /to="\/portfolio"/);  assert.match(landing, /Wake the signal/);
  assert.match(landing, /BUILD SIGNAL/);
  assert.match(landing, /A studio is more than a toolbox/);
  assert.match(signal, /framer-motion/);
  assert.match(signal, /preserve-3d/);
  assert.match(signal, /studioSignalArchClip/);
  const publicConfig = await read("src/config/public.ts");
  assert.match(publicConfig, /VITE_STUDIO_PUBLIC_ENABLED/);
  assert.match(publicConfig, /=== "true"/);
  assert.match(privateAccess, /studioPublicEnabled/);
  for (const source of [background, businessCard, identity, card]) {
    assert.match(source, /isStudioPublicEnabled/);
    assert.match(source, /redirect\(\{ to: "\/studio" \}\)/);
  }
});

test("unfinished Studio APIs return the private-surface guard", async () => {
  const routes = [
    "src/routes/api.studio-vcard.ts",
    "src/routes/api.studio-public-card.ts",
    "src/routes/api.studio-admin.ts",
    "src/routes/api.studio-publish.ts",
    "src/routes/api.studio-creative.ts",
    "src/routes/api.studio-email.ts",
    "src/routes/api.studio-card.ts",
    "src/routes/api.studio-background.ts",
  ];

  for (const path of routes) {
    const source = await read(path);
    assert.match(source, /studioUnavailableResponse/);
    assert.match(source, /VITE_STUDIO_PUBLIC_ENABLED/);
  }
});
