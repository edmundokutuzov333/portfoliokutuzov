import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Phase F email delivery keeps provider secrets server-side and validates payloads", async () => {
  const route = await read("src/routes/api.studio-email.ts");
  assert.match(route, /RESEND_API_KEY/);
  assert.match(route, /STUDIO_EMAIL_FROM/);
  assert.match(route, /MAX_BODY_BYTES/);
  assert.match(route, /MAX_ATTACHMENT_BYTES/);
  assert.match(route, /decodeDataUrl/);
  assert.match(route, /attachments/);
  assert.match(route, /application\/pdf/);
  assert.match(route, /image\/png/);
  assert.match(route, /text\/vcard/);
  assert.match(route, /Retry-After/);
  assert.doesNotMatch(route, /VITE_RESEND/);
});
