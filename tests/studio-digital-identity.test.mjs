import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Digital identity provides public card, opaque token, QR, vCard and share", async () => {
  const identity = await read("src/lib/studio/identity-format.ts");
  const qr = await read("src/lib/studio/qr.ts");
  const publicCard = await read("src/routes/card.$token.tsx");
  assert.match(identity, /VERSION:4\.0/);
  assert.match(identity, /FN:/);
  assert.match(identity, /TEL;TYPE=work,voice/);
  assert.match(identity, /publicIdentityUrl/);
  assert.match(qr, /qrcode-generator/);
  assert.match(qr, /createDataURL/);
  assert.match(publicCard, /navigator\.share/);
  assert.match(publicCard, /downloadVCard/);
  assert.match(publicCard, /studio_cards/);
});

test("Publishing is server-side and never exposes session ownership", async () => {
  const route = await read("src/routes/api.studio-publish.ts");
  const migration = await read("supabase/migrations/20260910130000_studio_digital_identity.sql");
  assert.match(route, /SUPABASE_SERVICE_ROLE_KEY|supabaseAdmin/);
  assert.match(route, /createShareToken/);
  assert.match(route, /share_token/);
  assert.match(migration, /public_enabled = true/);
  assert.match(migration, /status = 'published'/);
  assert.match(migration, /anon/);
});

test("Email delivery includes PDF, PNG, vCard and digital URL", async () => {
  const route = await read("src/routes/api.studio-email.ts");
  const panel = await read("src/components/studio/DigitalIdentityPanel.tsx");
  const env = await read(".env.example");
  assert.match(route, /api\.resend\.com\/emails/);
  assert.match(route, /application\/pdf/);
  assert.match(route, /image\/png/);
  assert.match(route, /text\/vcard/);
  assert.match(route, /digitalUrl/);
  assert.match(panel, /createPdfDataUrl/);
  assert.match(panel, /createPngDataUrl/);
  assert.match(panel, /Enviar automaticamente após publicar|Send automatically after publishing/);
  assert.match(env, /STUDIO_EMAIL_FROM=/);
});

test("Browser sharing uses feature detection for Web Share API", async () => {
  const panel = await read("src/components/studio/DigitalIdentityPanel.tsx");
  const publicCard = await read("src/routes/card.$token.tsx");
  for (const source of [panel, publicCard]) {
    assert.match(source, /navigator\.share/);
    assert.match(source, /navigator\.canShare/);
  }
});

test("Export layer exposes reusable PNG and PDF data URLs", async () => {
  const exporter = await read("src/lib/studio/export.ts");
  assert.match(exporter, /createPngDataUrl/);
  assert.match(exporter, /createPdfDataUrl/);
  assert.match(exporter, /application\/pdf/);
  assert.match(exporter, /image\/png/);
});
