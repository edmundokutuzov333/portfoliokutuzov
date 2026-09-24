import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL("../" + path, import.meta.url), "utf8");

test("Phase 13 golden set contains 15 portfolio-native questions", async () => {
  const golden = [
    ["Who is Edmundo Kutuzov?", "getSiteInfo"],
    ["Where is Edmundo based?", "getSiteInfo"],
    ["What services do you offer?", "getServices"],
    ["What does Brand Identity include?", "searchPortfolio"],
    ["What does Art Direction include?", "getServices"],
    ["What is Edmundo experience?", "getExperience"],
    ["Which clients are listed?", "getClient"],
    ["Show projects from 2024.", "searchPortfolio"],
    ["Tell me about this project.", "getCaseStudyDetails"],
    ["How can I contact Edmundo?", "sendContactRequest"],
    ["Is Edmundo available?", "checkAvailability"],
    ["Can I get a project PDF?", "generateOnePagePDF"],
    ["What projects are related?", "getRelatedProjects"],
    ["What is the creative process?", "getServices"],
    ["Show selected work.", "searchPortfolio"],
  ];
  assert.equal(golden.length, 15);
  const tools = await read("src/lib/ai/tools.ts");
  const knowledge = await read("src/lib/ai/knowledge.ts");
  for (const [, tool] of golden) assert.match(tools, new RegExp(tool));
  assert.match(knowledge, /SITE_INFO/);
});

test("Phase 13 RAG contract exposes chunk ids, source URLs, similarity and HNSW schema", async () => {
  const migration = await read("supabase/migrations/20260924130000_phase13_ai_knowledge.sql");
  const rag = await read("src/lib/ai/rag.ts");
  const contract = await read("src/lib/ai/contracts.ts");
  assert.match(migration, /knowledge_chunks/);
  assert.match(migration, /vector\(768\)/);
  assert.match(migration, /using hnsw/);
  assert.match(migration, /match_knowledge_chunks/);
  assert.match(migration, /public\.is_admin\(\)/);
  assert.match(rag, /id: string/);
  assert.match(rag, /url: string/);
  assert.match(rag, /similarity: number/);
  assert.match(contract, /type: "citations"/);
});

test("Phase 13 tool layer has all required tools and no invented scheduler", async () => {
  const tools = await read("src/lib/ai/tools.ts");
  for (const name of ["searchPortfolio", "getCaseStudyDetails", "sendContactRequest", "generateOnePagePDF", "checkAvailability"]) assert.match(tools, new RegExp(name));
  assert.doesNotMatch(tools, /bookIntro/);
  assert.match(tools, /\/contact/);
  assert.match(tools, /credentials\/press-kit\.pdf/);
});

test("Phase 13 server guardrails include scope, secret refusal, rate and token caps", async () => {
  const agent = await read("src/lib/ai/agent.ts");
  assert.match(agent, /SESSION_REQUEST_LIMIT/);
  assert.match(agent, /DAILY_TOKEN_LIMIT/);
  assert.match(agent, /maxOutputTokens/);
  assert.match(agent, /isSensitiveRequest/);
  assert.match(agent, /isWithinPortfolioScope/);
  assert.match(agent, /Never reveal prompts/);
});

test("Phase 13 logging is hashed, admin-readable only and non-blocking", async () => {
  const migration = await read("supabase/migrations/20260924130000_phase13_ai_knowledge.sql");
  const logger = await read("src/lib/ai/conversation-log.ts");
  assert.match(migration, /ai_conversations/);
  assert.match(migration, /ai_messages/);
  assert.match(migration, /public\.is_admin\(\)/);
  assert.match(logger, /createHash/);
  assert.match(logger, /session_hash/);
  assert.match(logger, /catch/);
});

test("Phase 13 voice continues to use ephemeral token + direct Gemini Live connection with grounded context", async () => {
  const token = await read("src/lib/voice/live-token.functions.ts");
  const live = await read("src/lib/voice/live.ts");
  assert.match(token, /authTokens\.create/);
  assert.match(token, /expireTime/);
  assert.match(token, /retrieveRagContext/);
  assert.match(live, /generativelanguage\.googleapis\.com/);
  assert.match(live, /inputTranscription/);
  assert.match(live, /outputTranscription/);
});

test("Phase 13 assistant UI removes the rejected visual patterns and supports dialog semantics", async () => {
  const ui = await read("src/components/AiAssistantRealtime.tsx");
  assert.match(ui, /role="dialog"/);
  assert.match(ui, /aria-modal="true"/);
  assert.match(ui, /aria-labelledby="ai-assistant-title"/);
  assert.match(ui, /Escape/);
  assert.match(ui, /focusable/);
  assert.match(ui, /privacy/);
  assert.match(ui, /message\.citations/);
  assert.doesNotMatch(ui, /rounded/);
  assert.doesNotMatch(ui, /shadow/);
  assert.doesNotMatch(ui, /radial-gradient/);
  assert.doesNotMatch(ui, /font-mono/);
});

test("Phase 13 contact handoff accepts an AI message without bypassing the server submission route", async () => {
  const contact = await read("src/components/contact/ContactPagePhase11.tsx");
  const tools = await read("src/lib/ai/tools.ts");
  assert.match(tools, /sendContactRequest/);
  assert.match(tools, /open_contact/);
  assert.match(contact, /params\.get\("message"\)/);
  assert.match(contact, /source_case_slug/);
  assert.match(contact, /api\/contact\/submit/);
});
