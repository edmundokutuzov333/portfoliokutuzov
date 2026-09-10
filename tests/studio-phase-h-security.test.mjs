import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("QR generation uses a real encoder and medium error correction", async () => {
  const qr = await read("src/lib/studio/qr.ts");
  assert.match(qr, /qrcode\(0, "M"\)/);
  assert.match(qr, /addData\(value\)/);
  assert.match(qr, /createDataURL/);
});

test("Digital identity links encode the opaque token", async () => {
  const identity = await read("src/lib/studio/identity-format.ts");
  assert.match(identity, /encodeURIComponent\(token\)/);
  assert.match(identity, /new URL\(/);
});

test("Email endpoint bounds body and attachments and emits safe MIME metadata", async () => {
  const email = await read("src/routes/api.studio-email.ts");
  for (const marker of ["MAX_BODY_BYTES", "MAX_ATTACHMENT_BYTES", "Content-Type", "base64", "attachments", "digitalUrl", "vcard"]) {
    assert.match(email, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), marker);
  }
  assert.match(email, /Retry-After/);
});

test("Public telemetry separates browser-safe events from privileged server events", async () => {
  const route = await read("src/routes/api.studio-admin.ts");
  assert.match(route, /PUBLIC_EVENTS/);
  assert.match(route, /authenticatedAdmin/);
  assert.match(route, /POST:/);
  assert.match(route, /GET:/);
  assert.match(route, /CARD_NOT_FOUND/);
  assert.doesNotMatch(route, /"generation_started"\s*,/);
  assert.doesNotMatch(route, /"ai_request"\s*,/);
  assert.doesNotMatch(route, /"email_started"\s*,/);
});

test("SVG renderer escapes all user-controlled content and never injects HTML", async () => {
  const svg = await read("src/lib/studio/svg.ts");
  for (const expression of ["design.background.value", "design.background.secondary", "element.fill", "element.fontFamily", "element.src", "element.text"]) {
    assert.ok(svg.includes(`esc(${expression})`), `${expression} is not escaped`);
  }
  assert.doesNotMatch(svg, /innerHTML/);
  assert.doesNotMatch(svg, /dangerouslySetInnerHTML/);
});
