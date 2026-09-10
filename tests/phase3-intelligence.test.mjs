import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
const read = (path) => fs.readFileSync(path, "utf8");

test("AI uses portfolio knowledge layer as authoritative grounding", () => {
  const source = read("src/lib/ai/agent.ts");
  assert.match(source, /getPortfolioKnowledgeSnapshot/);
  assert.match(source, /formatKnowledgeForModel/);
  assert.match(source, /NEVER invent/);
  assert.match(source, /temperature: 0\.2/);
  assert.match(source, /European Portuguese/);
});

test("realtime voice uses constrained ephemeral auth and a selected voice", () => {
  const token = read("src/lib/voice/live-token.functions.ts");
  const live = read("src/lib/voice/live.ts");
  assert.match(token, /authTokens\.create/);
  assert.match(token, /GenerativeService/i);
  assert.match(token, /voiceName: LIVE_VOICE/);
  assert.match(token, /Charon/);
  assert.match(token, /includeAllProjects: true/);
  assert.match(live, /BidiGenerateContentConstrained/);
  assert.match(live, /access_token=/);
  assert.match(live, /audio\/pcm;rate=16000/);
  assert.match(live, /bufferSize: 1024/);
  assert.match(live, /outputTranscription/);
  assert.match(live, /inputTranscription/);
});

test("bilingual locale switcher is wired into navigation and uses European Portuguese", () => {
  const locale = read("src/lib/site-locale.ts");
  const switcher = read("src/components/layout/LanguageSwitcher.tsx");
  const nav = read("src/components/layout/Navbar.tsx");
  assert.match(locale, /"en" \| "pt-PT"/);
  assert.match(locale, /DEFAULT_LOCALE.*"en"/);
  assert.match(locale, /WeakMap/);
  assert.match(locale, /MutationObserver/);
  assert.match(switcher, /pt-PT/);
  assert.match(switcher, /setSiteLocale/);
  assert.match(nav, /LanguageSwitcher/);
  assert.match(nav, /Português|Iniciar um projecto/);
});

test("production release gates are present and secret-free", () => {
  const workflow = read(".github/workflows/production-gemini-e2e.yml");
  const smoke = read("scripts/production-gemini-e2e.mjs");
  const migration = read(".github/workflows/supabase-production-migration.yml");
  assert.match(workflow, /workflow_dispatch/);
  assert.match(smoke, /\/api\/chat/);
  assert.match(smoke, /action: \"tts\"/);
  assert.match(smoke, /body\.audio/);
  assert.match(smoke, /sampleRate === 24000/);
  assert.match(migration, /supabase db push/);
  assert.match(migration, /secrets\.SUPABASE_ACCESS_TOKEN/);
  assert.doesNotMatch(smoke, /GEMINI_API_KEY|AIza[0-9A-Za-z_-]{20,}/);
});

test("portfolio search is bounded and published-data based", () => {
  const source = read("src/routes/api.portfolio-search.ts");
  assert.match(source, /MAX_QUERY_LENGTH = 120/);
  assert.match(source, /MAX_RESULTS = 24/);
  assert.match(source, /getProductionProjects/);
  assert.match(source, /Cache-Control/);
});

test("observability emits request IDs and structured events", () => {
  const api = read("src/routes/api.chat.ts");
  const obs = read("src/lib/observability.ts");
  assert.match(api, /getRequestId/);
  assert.match(api, /X-Request-Id/);
  assert.match(api, /request_start/);
  assert.match(api, /dependency_error/);
  assert.match(obs, /type: \"OBSERVABILITY\"/);
});

test("lead intelligence has bounded, deterministic tiers", () => {
  const source = read("src/lib/lead-intelligence.ts");
  assert.match(source, /score: number/);
  assert.match(source, /priority/);
  assert.match(source, /qualified/);
  assert.match(source, /low/);
  assert.match(source, /Math\.max\(0, Math\.min\(100/);
});

test("editorial schema migration creates case relations and lead fields", () => {
  const sql = read("supabase/migrations/20260910090000_phase3_editorial_intelligence.sql");
  assert.match(sql, /create table if not exists public\.project_sections/);
  assert.match(sql, /create table if not exists public\.project_media/);
  assert.match(sql, /create table if not exists public\.project_relations/);
  assert.match(sql, /add column if not exists lead_score/);
  assert.match(sql, /alter table public\.project_media enable row level security/);
});

test("browser QA covers all requested engines and mobile journeys", () => {
  const config = read("playwright.config.ts");
  const spec = read("tests/browser/portfolio.spec.ts");
  assert.match(config, /chromium/);
  assert.match(config, /firefox/);
  assert.match(config, /webkit/);
  assert.match(config, /edge/);
  assert.match(config, /iphone-safari/);
  assert.match(config, /android-chrome/);
  for (const token of ["home", "portfolio", "contact", "command palette", "AI assistant", "reduced motion"]) {
    assert.match(spec.toLowerCase(), new RegExp(token.toLowerCase().replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")));
  }
});

test("design system contract prevents uncontrolled component taxonomy", () => {
  const source = read("src/lib/design-system.ts");
  assert.match(source, /DESIGN_SYSTEM_CONTRACT/);
  assert.match(source, /Typography/);
  assert.match(source, /CaseNavigation/);
  assert.match(source, /ProjectCard/);
});
