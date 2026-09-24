import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL("../" + path, import.meta.url), "utf8");

test("Phase 11 Contact is a five-step Betao/Cal dossier", async () => {
  const page = await read("src/components/contact/ContactPagePhase11.tsx");

  for (const label of ["Identity", "Project", "Budget", "Timing", "References"]) {
    assert.match(page, new RegExp(label));
  }

  assert.match(page, /Let's talk\./);
  assert.match(page, /Prefer not to say/);
  assert.match(page, /Approx\\. 3–5 min/);
  assert.match(page, /sessionStorage/);
  assert.match(page, /aria-live/);
  assert.match(page, /whatsappLink/);
  assert.match(page, /Schedule 30-Min Call/);
  assert.match(page, /mailto/);
});

test("Phase 11 removes the old Contact visual anti-patterns from the page component", async () => {
  const page = await read("src/components/contact/ContactPagePhase11.tsx");

  for (const token of [
    "rounded-full",
    "rounded-xl",
    "rounded-2xl",
    "bg-gradient-to-",
    "shadow-2xl",
    "mono",
    "tracking-[0.2em]",
    "Send Project Brief",
  ]) {
    assert.equal(page.includes(token), token === "Send Project Brief" ? true : false);
  }

  assert.doesNotMatch(page, /Admin-managed credential metric/);
  assert.doesNotMatch(page, /Let's <span/);
});

test("Phase 11 writes briefings only through the server route", async () => {
  const page = await read("src/components/contact/ContactPagePhase11.tsx");
  const route = await read("src/routes/api.contact.submit.ts");

  assert.doesNotMatch(page, /\\.from\\(["']briefing_submissions["']\\)\\.insert/);
  assert.doesNotMatch(page, /briefing_submissions.*insert/s);
  assert.match(route, /supabaseAdmin/);
  assert.match(route, /briefing_submissions/);
  assert.match(route, /check_contact_rate_limit/);
  assert.match(route, /honeypot/);
  assert.match(route, /RESEND_API_KEY/);
});

test("Phase 11 migration closes anon briefing inserts and adds persistent rate limit RPC", async () => {
  const migration = await read("supabase/migrations/20260924110000_phase11_contact_security.sql");
  const rollback = await read("supabase/rollbacks/20260924110000_phase11_contact_security.down.sql");

  assert.match(migration, /drop policy if exists "anyone can submit briefing"/i);
  assert.match(migration, /contact_rate_limits/);
  assert.match(migration, /check_contact_rate_limit/);
  assert.match(migration, /security definer/);
  assert.match(migration, /grant execute.*service_role/i);

  assert.match(rollback, /create policy "anyone can submit briefing"/i);
});

test("Phase 11 server route remains deployable before migration by using a conservative fallback limiter", async () => {
  const route = await read("src/routes/api.contact.submit.ts");

  assert.match(route, /fallbackRateLimits/);
  assert.match(route, /RATE_LIMIT_PROVIDER_UNAVAILABLE|rateError/);
  assert.match(route, /429/);
  assert.match(route, /runtime = "nodejs"/);
});
