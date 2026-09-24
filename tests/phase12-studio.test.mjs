import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL("../" + path, import.meta.url), "utf8");

test("Phase 12 preserves the Studio prelaunch content", async () => {
  const page = await read("src/routes/studio.tsx");
  for (const value of [
    "A studio still finding its lines.",
    "Kutuzov Studio is where the tools I build for myself live - composed privately, tested in full, and released only once every line holds up in public.",
    "Status", "Composing", "Access", "Private, by invitation", "Release",
    "When every layer holds", "Explore the portfolio", "Maputo / 2026", "Private build",
  ]) assert.ok(page.includes(value), value);
});

test("Phase 12 Studio uses Betao, Cartaz/Livro and mint Work Colour", async () => {
  const page = await read("src/routes/studio.tsx");
  for (const token of ["bg-black", "--work", "#25e3c2", "font-cartaz", "font-livro"]) assert.match(page, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(page, /rounded-full/);
  assert.doesNotMatch(page, /rounded-2xl/);
  assert.doesNotMatch(page, /font-mono/);
  assert.doesNotMatch(page, /text-\[10px\]/);
});

test("Phase 12 constellation is pointer reactive and reduced-motion safe", async () => {
  const page = await read("src/routes/studio.tsx");
  assert.match(page, /onPointerMove/);
  assert.match(page, /onPointerLeave/);
  assert.match(page, /reducedMotion/);
  assert.match(page, /aria-label="Kutuzov Studio constellation"/);
  assert.match(page, /<svg/);
});

test("Phase 12 does not touch Studio tool internals", async () => {
  const page = await read("src/routes/studio.tsx");
  for (const token of ["studio_cards", "studio_events", "api.studio", "supabase"]) assert.equal(page.includes(token), false, token);
});

test("Phase 12 waitlist uses source studio and fails closed before unified migration", async () => {
  const form = await read("src/components/studio/WaitlistForm.tsx");
  const server = await read("src/lib/newsletter.functions.ts");
  assert.match(form, /source: "studio"/);
  assert.match(form, /pendingConfirmation/);
  assert.match(form, /Notify me/);
  assert.match(form, /Check your inbox to confirm/);
  assert.match(server, /source === "studio"/);
  assert.match(server, /unified newsletter migration/);
  assert.match(server, /confirmationPath = source === "studio"/);
});

test("Phase 12 confirmation state lives on Studio", async () => {
  const page = await read("src/routes/studio.tsx");
  for (const token of ["newsletter_confirm", "confirmNewsletter", "Subscription confirmed", "Confirmation failed", "window.history.replaceState"]) assert.match(page, new RegExp(token));
});

test("Phase 12 reuses the existing reversible unified newsletter migration", async () => {
  const migration = await read("supabase/migrations/20260924093000_phase4_newsletter_unified.sql");
  const rollback = await read("supabase/rollbacks/20260924093000_phase4_newsletter_unified.sql");
  for (const token of ["confirmed_at", "confirmation_token_hash", "confirmation_expires_at", "'studio'", "FROM public.studio_waitlist"]) assert.match(migration, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(rollback, /DELETE FROM public\.newsletter_subscribers/);
  assert.match(rollback, /DROP COLUMN IF EXISTS confirmed_at/);
});

test("Phase 12 adds no dependency", async () => {
  const pkg = JSON.parse(await read("package.json"));
  assert.equal(pkg.dependencies["framer-motion"], "^12.38.0");
  assert.equal(pkg.dependencies["@supabase/supabase-js"], "^2.104.0");
});
