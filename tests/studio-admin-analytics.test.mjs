import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function read(path) { return readFile(new URL(`../${path}`, import.meta.url), "utf8"); }

test("Phase G has protected admin analytics and bounded event ingestion", async () => {
  const api = await read("src/routes/api.studio-admin.ts");
  const migration = await read("supabase/migrations/20260910150000_studio_admin_analytics.sql");
  assert.match(api, /Bearer/);
  assert.match(api, /is_admin/);
  assert.match(api, /MAX_BODY_BYTES/);
  assert.match(api, /MAX_EVENTS/);
  assert.match(api, /studio_admin_dashboard/);
  assert.match(migration, /create table if not exists public\.studio_events/);
  assert.match(migration, /alter table public\.studio_events enable row level security/);
  assert.match(migration, /studio events admin read/);
  assert.match(migration, /studio_admin_dashboard/);
  assert.match(migration, /365 days/);
});

test("Phase G dashboard exposes all requested admin surfaces", async () => {
  const route = await read("src/routes/admin.studio.tsx");
  for (const label of ["Studio Analytics", "Card Library", "Generation", "Export", "Email", "Digital Card", "AI"]) assert.match(route, new RegExp(label));
  assert.match(route, /Latest 100 cards/);
  assert.match(route, /7, 30, 90/);
  assert.match(route, /recharts/);
});

test("Phase G instruments generation, export, email, digital card and AI activity", async () => {
  const files = {
    background: await read("src/routes/api.studio-background.ts"),
    creative: await read("src/routes/api.studio-creative.ts"),
    export: await read("src/lib/studio/export.ts"),
    email: await read("src/routes/api.studio-email.ts"),
    publish: await read("src/routes/api.studio-publish.ts"),
    card: await read("src/routes/card.$token.tsx"),
    chat: await read("src/routes/api.chat.ts"),
  };
  assert.match(files.background, /generation_started/);
  assert.match(files.background, /generation_completed/);
  assert.match(files.creative, /ai_request/);
  assert.match(files.creative, /ai_success/);
  assert.match(files.export, /export_completed/);
  assert.match(files.email, /email_sent/);
  assert.match(files.email, /email_failed/);
  assert.match(files.publish, /card_published/);
  assert.match(files.card, /digital_card_view/);
  assert.match(files.card, /digital_card_save_contact/);
  assert.match(files.chat, /ai_failed/);
});

test("Phase G browser analytics client is failure-tolerant and keepalive-safe", async () => {
  const source = await read("src/lib/studio/analytics.ts");
  assert.match(source, /keepalive: true/);
  assert.match(source, /\.catch\(\(\) => undefined\)/);
  assert.match(source, /sessionStorage/);
});
