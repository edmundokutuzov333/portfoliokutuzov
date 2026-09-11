import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Portfolio route mounts the deterministic archive renderer", async () => {
  const route = await read("src/routes/portfolio.index.tsx");
  const archive = await read("src/components/portfolio/PortfolioArchive.tsx");
  assert.match(route, /PortfolioArchive/);
  assert.match(archive, /data-testid=\"portfolio-archive\"/);
  assert.match(archive, /data-testid=\"portfolio-project-grid\"/);
  assert.match(archive, /Showing \{filtered\.length\} of \{publishedProjects\.length\}/);
});

test("Portfolio data has a server-backed recovery path and local fallback", async () => {
  const hook = await read("src/hooks/useSiteData.ts");
  const endpoint = await read("src/routes/api.portfolio-projects.ts");
  assert.match(hook, /\/api\/portfolio-projects/);
  assert.match(endpoint, /from\("projects"\)/);
  assert.match(endpoint, /eq\("is_published", true\)/);
  assert.match(hook, /return FALLBACK_PROJECTS/);
});

test("Portfolio language is English-only", async () => {
  const locale = await read("src/lib/site-locale.ts");
  const navbar = await read("src/components/layout/Navbar.tsx");
  assert.match(locale, /export type SiteLocale = \"en\"/);
  assert.doesNotMatch(navbar, /LanguageSwitcher/);
  assert.doesNotMatch(navbar, /pt-PT/);
});
