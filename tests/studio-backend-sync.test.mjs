import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");

test("Studio has server-mediated card persistence with an opaque draft token", () => {
  const route = read("src/routes/api.studio-card.ts");
  const migration = read("supabase/migrations/20260910170000_studio_persistence_sync.sql");
  const persistence = read("src/lib/studio/persistence.ts");

  assert.match(migration, /add column if not exists draft_token/);
  assert.match(migration, /add column if not exists revision/);
  assert.match(migration, /studio_cards_draft_token_idx/);
  assert.match(route, /randomBytes\(36\)/);
  assert.match(route, /POST: async/);
  assert.match(route, /GET: async/);
  assert.match(route, /eq\("draft_token", draftToken\)/);
  assert.match(route, /REVISION_CONFLICT/);
  assert.match(route, /sanitizePublicIdentityDesign/);
  assert.match(persistence, /\/api\/studio\/card/);
  assert.match(persistence, /getStudioDraftMeta/);
  assert.match(persistence, /remember\(result\.card\)/);
});

test("Digital identity publishes the persisted draft instead of creating an unrelated record", () => {
  const panel = read("src/components/studio/DigitalIdentityPanel.tsx");
  const publish = read("src/routes/api.studio-publish.ts");

  assert.match(panel, /saveStudioCard/);
  assert.match(panel, /draftToken: saved\.draftToken/);
  assert.match(panel, /cardId: saved\.id/);
  assert.match(publish, /\.eq\("draft_token", draftToken\)/);
  assert.match(publish, /REVISION_CONFLICT/);
  assert.match(publish, /status: "published"/);
  assert.match(publish, /public_enabled: true/);
});

test("The Studio vCard action uses the server-generated published identity", () => {
  const panel = read("src/components/studio/DigitalIdentityPanel.tsx");
  const vcard = read("src/routes/api.studio-vcard.ts");

  assert.match(panel, /\/api\/studio\/vcard\?token=/);
  assert.match(vcard, /status", "published"/);
  assert.match(vcard, /public_enabled", true/);
  assert.match(vcard, /Content-Type.*text\/vcard/);
});

test("Email delivery remains server-only and retry-safe", () => {
  const route = read("src/routes/api.studio-email.ts");
  assert.doesNotMatch(route, /localStorage/);
  assert.match(route, /RESEND_API_KEY/);
  assert.match(route, /Idempotency-Key/);
  assert.match(route, /MAX_PROVIDER_ATTEMPTS/);
  assert.match(route, /Retry-After/);
  assert.match(route, /EMAIL_DELIVERY_FAILED/);
});
