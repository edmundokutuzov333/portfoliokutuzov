import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

test("SEO primitives expose canonical, Open Graph and Twitter metadata", () => {
  const seo = read("src/lib/seo.ts");
  assert.match(seo, /canonicalUrl/);
  assert.match(seo, /og:image/);
  assert.match(seo, /twitter:card/);
  assert.match(seo, /SITE_ORIGIN/);
});

test("Root document is SSR-safe and structured-data aware", () => {
  const root = read("src/routes/__root.tsx");
  assert.match(root, /lang=\"pt-PT\"/);
  assert.match(root, /application\/ld\+json/);
  assert.match(root, /DeferredAiAssistant/);
});

test("AI assistant is not part of the critical shell", () => {
  const file = read("src/components/DeferredAiAssistant.tsx");
  assert.match(file, /lazy\(/);
  assert.match(file, /requestIdleCallback/);
  assert.match(file, /timeout\s*:\s*2500/);
});

test("Heavy reel is deferred until the browser is idle without abandoning layout stability", () => {
  const file = read("src/components/home/DeferredReel.tsx");
  const home = read("src/routes/index.tsx");
  assert.match(file, /lazy\(/);
  assert.match(file, /requestIdleCallback/);
  assert.match(file, /min-h-\[/);
  assert.match(home, /DeferredReel/);
  assert.doesNotMatch(home, /CinematicPortfolioReel/);
});

test("Reel does not randomize SSR output and pauses offscreen/background", () => {
  const reel = read("src/components/ui/cinematic-portfolio-reel.tsx");
  assert.doesNotMatch(reel, /Math\.random/);
  assert.match(reel, /IntersectionObserver/);
  assert.match(reel, /visibilitychange/);
  assert.match(reel, /useReducedMotion/);
});

test("Admin control room is dynamically isolated from the public shell", () => {
  const route = read("src/routes/admin.lazy.tsx");
  assert.match(route, /import\("@\/components\/admin\/AdminControlRoom"\)/);
  assert.match(route, /createLazyFileRoute\("\/admin"\)/);
});

test("Public CMS reads have bounded latency and fallbacks", () => {
  const data = read("src/hooks/useSiteData.ts");
  assert.match(data, /PUBLIC_READ_TIMEOUT_MS/);
  assert.match(data, /AbortSignal\.timeout/);
  assert.match(data, /FALLBACK_PROJECTS/);
});

test("Route cache avoids aggressive refetching", () => {
  const router = read("src/router.tsx");
  assert.match(router, /staleTime\s*:\s*120_000/);
  assert.match(router, /gcTime\s*:\s*15\s*\*\s*60_000/);
  assert.match(router, /defaultPreloadStaleTime\s*:\s*30_000/);
});

test("Motion/accessibility system has semantic variants, reduced-motion and focus treatment", () => {
  const css = read("src/styles.css");
  const motion = read("src/lib/motion.ts");
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /focus-visible/);
  assert.match(css, /touch-action: manipulation/);
  assert.match(motion, /fadeIn/);
  assert.match(motion, /fadeUp/);
  assert.match(motion, /imageReveal/);
  assert.match(motion, /pageTransition/);
});

test("Client logo system supports real dimensions, normalization and optional links", () => {
  const logos = read("src/components/ui/cinematic-logo-cloud.tsx");
  assert.match(logos, /logo_width/);
  assert.match(logos, /logo_height/);
  assert.match(logos, /grayscale/);
  assert.match(logos, /website_url/);
});

test("Sitemap uses the production origin instead of legacy Lovable host", () => {
  const sitemap = read("src/routes/sitemap[.]xml.ts");
  assert.doesNotMatch(sitemap, /portfoliokutuzov2026\.lovable\.app/);
  assert.match(sitemap, /resolvePublicSiteUrl/);
});

test("Contact route uses canonical technical SEO primitives", () => {
  const contact = read("src/routes/contact.tsx");
  assert.match(contact, /createSeo/);
  assert.match(contact, /path:\s*[\"']\/contact[\"']/);
});
