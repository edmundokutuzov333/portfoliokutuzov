import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Magnific background engine is isolated to the background surface", async () => {
  const service = await read("src/lib/studio/background/magnific.ts");
  const route = await read("src/routes/api.studio-background.ts");
  const panel = await read("src/components/studio/MagnificBackgroundEngine.tsx");
  assert.match(service, /x-magnific-api-key/);
  assert.match(service, /MAGNIFIC_API_KEY/);
  assert.match(service, /text-to-image/);
  assert.match(route, /dependency: \"magnific\"/);
  assert.match(panel, /Generate with Magnific/);
  assert.doesNotMatch(service, /OPENAI_API_KEY|GEMINI_API_KEY/);
  assert.doesNotMatch(panel, /OPENAI_API_KEY|GEMINI_API_KEY/);
});

test("Magnific background requests are bounded and protected", async () => {
  const service = await read("src/lib/studio/background/magnific.ts");
  const route = await read("src/routes/api.studio-background.ts");
  assert.match(service, /MAX_PROMPT = 1200/);
  assert.match(service, /AbortSignal\.timeout\(30_000\)/);
  assert.match(route, /MAX_REQUESTS = 8/);
  assert.match(route, /MAX_BODY_BYTES = 24 \* 1024/);
  assert.match(route, /PROMPT_TOO_SHORT/);
  assert.match(route, /Cache-Control.*no-store/);
});

test("Magnific output is placed behind card content as a locked-size background asset", async () => {
  const panel = await read("src/components/studio/MagnificBackgroundEngine.tsx");
  assert.match(panel, /magnific-background/);
  assert.match(panel, /x: 0/);
  assert.match(panel, /y: 0/);
  assert.match(panel, /width: design\.widthMm/);
  assert.match(panel, /height: design\.heightMm/);
  assert.match(panel, /fit: \"cover\"/);
  assert.match(panel, /elements: \[backgroundElement/);
});

test("Studio landing exposes the isolated Magnific background tool", async () => {
  const route = await read("src/routes/studio.tsx");
  assert.match(route, /\/studio\/background/);
  assert.match(route, /Magnific/);
});

test("The main editor remains provider-independent", async () => {
  const editor = await read("src/components/studio/BusinessCardEditor.tsx");
  assert.doesNotMatch(editor, /Magnific/);
  assert.doesNotMatch(editor, /MAGNIFIC_API_KEY/);
  assert.doesNotMatch(editor, /OPENAI_API_KEY|GEMINI_API_KEY/);
});
