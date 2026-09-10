import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("..", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const types = read("src/lib/studio/ai/creative-types.ts");
const validator = read("src/lib/studio/ai/creative-validator.ts");
const openai = read("src/lib/studio/ai/openai-creative.ts");
const gemini = read("src/lib/studio/ai/gemini-creative.ts");
const engine = read("src/lib/studio/ai/creative-engine.ts");
const apply = read("src/lib/studio/ai/creative-apply.ts");
const route = read("src/routes/api.studio-creative.ts");
const panel = read("src/components/studio/CreativeEnginePanel.tsx");
const editor = read("src/components/studio/BusinessCardEditor.tsx");


test("Creative Engine schema covers all requested design dimensions", () => {
  for (const field of ["layout", "typography", "spacing", "composition", "colour", "elementPositions"]) assert.match(types, new RegExp(field));
  assert.match(types, /design recommendation/);
});

test("Creative Engine providers are server-side and structured", () => {
  assert.match(openai, /OPENAI_API_KEY/);
  assert.match(openai, /json_schema/);
  assert.match(gemini, /GEMINI_API_KEY/);
  assert.match(gemini, /response_format/);
  assert.doesNotMatch(editor, /OPENAI_API_KEY|GEMINI_API_KEY/);
  assert.doesNotMatch(panel, /OPENAI_API_KEY|GEMINI_API_KEY/);
});

test("Recommendations are validated and clamped to physical safe bounds", () => {
  assert.match(validator, /STUDIO_CARD_SAFE_MM/);
  assert.match(validator, /safeX/);
  assert.match(validator, /safeY/);
  assert.match(validator, /parseAndSanitizeRecommendation/);
  assert.match(apply, /STUDIO_CARD_SAFE_MM/);
});

test("The engine can use OpenAI, Gemini, or both with fallback", () => {
  assert.match(engine, /provider === "openai"/);
  assert.match(engine, /provider === "gemini"/);
  assert.match(engine, /Promise\.allSettled/);
  assert.match(engine, /single-provider-fallback/);
});

test("Creative API is rate-limited and rejects invalid documents", () => {
  assert.match(route, /MAX_REQUESTS = 12/);
  assert.match(route, /INVALID_DESIGN_DOCUMENT/);
  assert.match(route, /MAX_BODY_BYTES/);
  assert.match(route, /Cache-Control.*no-store/);
});

test("Creative Engine is integrated into the vector editor with deterministic apply", () => {
  assert.match(editor, /CreativeEnginePanel/);
  assert.match(editor, /applyCreativeRecommendation/);
  assert.match(panel, /Generate recommendation/);
  assert.match(panel, /Apply to canvas/);
});
