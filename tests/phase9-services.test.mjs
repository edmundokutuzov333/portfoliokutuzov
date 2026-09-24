import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL("../" + path, import.meta.url), "utf8");

test("Phase 9 mounts a dedicated Services page without removing the legacy implementation", async () => {
  const route = await read("src/routes/services.tsx");
  const legacy = await read("src/components/services/ServicesInteractive.tsx");
  const page = await read("src/components/services/ServicesPagePhase9.tsx");

  assert.match(route, /ServicesPagePhase9/);
  assert.match(page, /Visual capabilities &amp; disciplines/);
  assert.match(page, /aria-expanded/);
  assert.match(page, /selected work/i);
  assert.match(page, /Ask about this discipline/);
  assert.match(page, /\/portfolio/);
  assert.match(page, /service=/);
  assert.match(legacy, /ServicesInteractive/);
});

test("Phase 9 resolves service work from the published portfolio source", async () => {
  const model = await read("src/lib/service-projects.ts");
  const page = await read("src/components/services/ServicesPagePhase9.tsx");

  assert.match(model, /selectServiceProjects/);
  assert.match(model, /is_published !== false/);
  assert.match(model, /Social Media/);
  assert.match(model, /Ad Campaigns/);
  assert.match(model, /Digital Design/);
  assert.match(model, /Web Design/);
  assert.match(page, /selectServiceProjects/);
});

test("Phase 9 keeps empty Method and FAQ structures hidden", async () => {
  const page = await read("src/components/services/ServicesPagePhase9.tsx");

  assert.match(page, /FAQ_ITEMS = \[\]/);
  assert.match(page, /if \(!FAQ_ITEMS\.length\) return null/);
  assert.match(page, /FALLBACK_METHODS: DbMethod\[\] = \[\]/);
  assert.match(page, /methods\.length > 0 \|\| FALLBACK_METHODS\.length > 0/);
});

test("Phase 9 removes Method ownership from Credentials and keeps a cross-link", async () => {
  const credentials = await read("src/routes/credentials.tsx");

  assert.doesNotMatch(credentials, /useMethod/);
  assert.doesNotMatch(credentials, /4B\. METHOD/);
  assert.match(credentials, /to="\/services"/);
  assert.match(credentials, /Explore Services/);
});

test("Phase 9 contextual chatbot and contact handoff are wired", async () => {
  const chat = await read("src/components/AiAssistantRealtime.tsx");
  const contact = await read("src/routes/contact.lazy.tsx");
  const page = await read("src/components/services/ServicesPagePhase9.tsx");

  assert.match(page, /new CustomEvent\("ek:open-chat"/);
  assert.match(page, /discipline\.title/);
  assert.match(chat, /event\.detail/);
  assert.match(chat, /detail\.prompt/);
  assert.match(contact, /\.get\("service"\)/);
  assert.match(contact, /serviceToBriefProjectType/);
  assert.match(contact, /setStep\(2\)/);
});

test("Phase 9 has no production data mutation in the public Services implementation", async () => {
  const page = await read("src/components/services/ServicesPagePhase9.tsx");
  const model = await read("src/lib/service-projects.ts");

  for (const source of [page, model]) {
    assert.doesNotMatch(source, /\.insert\(/);
    assert.doesNotMatch(source, /\.update\(/);
    assert.doesNotMatch(source, /\.delete\(/);
    assert.doesNotMatch(source, /\.upsert\(/);
  }
});

test("Phase 9 removes prohibited template patterns from the new page", async () => {
  const page = await read("src/components/services/ServicesPagePhase9.tsx");

  for (const token of [
    "rounded-full",
    "rounded-2xl",
    "bg-gradient",
    "shadow-lg",
    "mono",
    "tracking-[0.2em]",
    "Send a project brief",
    "Tell me about your brand and let's get to work.",
  ]) {
    assert.equal(page.includes(token), false, "legacy pattern found: " + token);
  }
});
