import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Studio database surface is server-mediated for anonymous users", async () => {
  const lock = await read("supabase/migrations/20260910171000_studio_lock_public_database_surface.sql");
  const publicCard = await read("src/routes/api.studio-public-card.ts");
  const card = await read("src/routes/card.$token.tsx");
  const vcard = await read("src/routes/api.studio-vcard.ts");

  assert.match(lock, /drop policy if exists "studio cards anon insert"/);
  assert.match(lock, /drop policy if exists "studio cards public published read"/);
  assert.match(publicCard, /supabaseAdmin/);
  assert.match(publicCard, /sanitizePublicIdentityDesign/);
  assert.match(card, /\/api\/studio\/public-card\?token=/);
  assert.match(vcard, /supabaseAdmin/);
  assert.doesNotMatch(card, /createClient\(/);
  assert.doesNotMatch(vcard, /createClient\(/);
});

test("Private draft retrieval does not place the bearer token in a URL", async () => {
  const persistence = await read("src/lib/studio/persistence.ts");
  const route = await read("src/routes/api.studio-card.ts");
  assert.match(persistence, /X-Studio-Draft-Token/);
  assert.match(route, /x-studio-draft-token/);
  assert.doesNotMatch(persistence, /\?draftToken=/);
});

test("Studio visual persistence allows the complete bounded design payload", async () => {
  const route = await read("src/routes/api.studio-card.ts");
  const format = await read("src/lib/studio/identity-format.ts");
  assert.match(route, /MAX_BODY_BYTES = 8 \* 1024 \* 1024/);
  assert.match(route, /7 \* 1024 \* 1024/);
  assert.match(format, /6_000_000/);
});
