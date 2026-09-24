import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL("../" + path, import.meta.url), "utf8");

test("Phase 7 route exposes view and shareable archive filters", async () => {
  const route = await read("src/routes/portfolio.tsx");
  assert.match(route, /view: z\.enum\(\["grid", "index"\]\)/);
  assert.match(route, /d: z\.string\(\)\.optional\(\)/);
  assert.match(route, /y: z\.string\(\)\.optional\(\)/);
  assert.match(route, /c: z\.string\(\)\.optional\(\)/);
  assert.match(route, /q: z\.string\(\)\.optional\(\)/);
});

test("Phase 7 uses infinite queries in pages of 24", async () => {
  const hook = await read("src/hooks/usePortfolioArchive.ts");
  assert.match(hook, /useInfiniteQuery/);
  assert.match(hook, /params\.set\("page"/);
  assert.match(hook, /params\.set\("limit", String\(limit\)\)/);
  assert.match(hook, /fetchPortfolioPage\(filters, pageParam\)/);
  assert.match(hook, /getNextPageParam/);
  assert.match(hook, /buildSearch\(filters, page, 24\)/);
});

test("Phase 7 API supports multi-filter queries, pagination and facets without writes", async () => {
  const api = await read("src/routes/api.portfolio-projects.ts");
  assert.match(api, /url\.searchParams\.get\("d"\)/);
  assert.match(api, /url\.searchParams\.get\("y"\)/);
  assert.match(api, /url\.searchParams\.get\("c"\)/);
  assert.match(api, /url\.searchParams\.get\("q"\)/);
  assert.match(api, /url\.searchParams\.get\("page"\)/);
  assert.match(api, /nextPage/);
  assert.match(api, /facets:/);
  assert.doesNotMatch(api, /\.insert\(/);
  assert.doesNotMatch(api, /\.update\(/);
  assert.doesNotMatch(api, /\.delete\(/);
});

test("Phase 7 archive implements Grid and Index with Work Colour", async () => {
  const archive = await read("src/components/portfolio/PortfolioArchive.tsx");
  assert.match(archive, /GridView/);
  assert.match(archive, /IndexView/);
  assert.match(archive, /view === "index"/);
  assert.match(archive, /setWorkColor/);
  assert.match(archive, /darkenWorkColor/);
  assert.match(archive, /pickFg/);
  assert.match(archive, /viewTransition/);
});

test("Phase 7 supports keyboard focus preview in Index", async () => {
  const archive = await read("src/components/portfolio/PortfolioArchive.tsx");
  assert.match(archive, /onFocus=/);
  assert.match(archive, /fixed z-\[80\]/);
  assert.match(archive, /aria-label="Portfolio view"/);
});

test("Phase 7 has debounced URL search and scroll restoration", async () => {
  const archive = await read("src/components/portfolio/PortfolioArchive.tsx");
  assert.match(archive, /setTimeout\(\(\) =>/);
  assert.match(archive, /sessionStorage\.getItem/);
  assert.match(archive, /sessionStorage\.setItem/);
  assert.match(archive, /scrollTo/);
});

test("Phase 7 links project hover/focus to prefetch and case routes", async () => {
  const archive = await read("src/components/portfolio/PortfolioArchive.tsx");
  const hook = await read("src/hooks/usePortfolioArchive.ts");
  assert.match(archive, /prefetchPortfolioProject/);
  assert.match(archive, /to="\/portfolio\/\$slug"/);
  assert.match(hook, /\/api\/portfolio-projects\?slug=/);
});

test("Phase 7 emits ItemList JSON-LD for the first page", async () => {
  const archive = await read("src/components/portfolio/PortfolioArchive.tsx");
  assert.match(archive, /"@type": "ItemList"/);
  assert.match(archive, /itemListElement/);
  assert.match(archive, /slice\(0, 24\)/);
});

test("Phase 7 does not reintroduce the abolished portfolio UI patterns", async () => {
  const archive = await read("src/components/portfolio/PortfolioArchive.tsx");
  for (const token of ["rounded-full", "rounded-2xl", "bg-gradient", "shadow-lg", "mono", "uppercase"]) {
    assert.equal(archive.includes(token), false, "legacy pattern found: " + token);
  }
  assert.equal(archive.includes("tracking-[0.2em]"), false);
});

test("Phase 7 preserves the single real-project source and does not invent records", async () => {
  const hook = await read("src/hooks/useSiteData.ts");
  const archive = await read("src/components/portfolio/PortfolioArchive.tsx");
  assert.match(hook, /supabase\.from\("projects"\)/);
  assert.match(hook, /eq\("is_published", true\)/);
  assert.match(archive, /data-testid="portfolio-archive"/);
  assert.match(archive, /data-testid="portfolio-project-grid"/);
});
