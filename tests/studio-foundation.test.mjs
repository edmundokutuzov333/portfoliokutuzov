import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Kutuzov Studio routes are registered", async () => {
  const routeTree = await read("src/routeTree.gen.ts");
  assert.match(routeTree, /\/studio\/);
  assert.match(routeTree, /\/studio\/business-card/);
});

test("Studio navigation entry exists in desktop and mobile navigation", async () => {
  const navbar = await read("src/components/layout/Navbar.tsx");
  assert.match(navbar, /to=\"\/studio\"/);
  assert.match(navbar, /Kutuzov Studio/);
});

test("Business Card Studio uses a versioned editable design document", async () => {
  const types = await read("src/lib/studio/types.ts");
  const editor = await read("src/components/studio/BusinessCardEditor.tsx");
  assert.match(types, /version: 1/);
  assert.match(types, /StudioDesignDocument/);
  assert.match(editor, /updateElementPosition/);
  assert.match(editor, /CardCanvas/);
});

test("Studio database foundation includes draft RLS and private storage bucket", async () => {
  const migration = await read("supabase/migrations/20260910110000_create_kutuzov_studio_foundation.sql");
  assert.match(migration, /create table if not exists public\.studio_cards/);
  assert.match(migration, /enable row level security/);
  assert.match(migration, /studio cards anon insert/);
  assert.match(migration, /studio-assets/);
  assert.match(migration, /public = false/);
});

test("Studio session storage never creates a synthetic Math.random identifier", async () => {
  const session = await read("src/lib/studio/session.ts");
  assert.doesNotMatch(session, /Math\.random\(/);
  assert.match(session, /sessionStorage/);
});

test("Studio sitemap exposes the public Studio landing page", async () => {
  const sitemap = await read("src/routes/sitemap[.]xml.ts");
  assert.match(sitemap, /\"\/studio\"/);
});
