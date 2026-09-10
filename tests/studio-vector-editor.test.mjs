import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Vector editor model exposes canvas editing primitives", async () => {
  const model = await read("src/lib/studio/design-document.ts");
  assert.match(model, /updateElementPosition/);
  assert.match(model, /updateElementSize/);
  assert.match(model, /reorderElement/);
  assert.match(model, /alignElement/);
  assert.match(model, /updateBackground/);
});

test("Business Card Studio editor exposes undo redo layers and resize interactions", async () => {
  const editor = await read("src/components/studio/BusinessCardEditor.tsx");
  assert.match(editor, /Undo2/);
  assert.match(editor, /Redo2/);
  assert.match(editor, /Layers/);
  assert.match(editor, /startResize/);
  assert.match(editor, /updateElementSize/);
  assert.match(editor, /setPointerCapture/);
});

test("Export pipeline derives SVG, PNG and PDF from the design document", async () => {
  const renderer = await read("src/lib/studio/svg.ts");
  const exporter = await read("src/lib/studio/export.ts");
  assert.match(renderer, /designToSvg/);
  assert.match(exporter, /exportSvg/);
  assert.match(exporter, /exportPng/);
  assert.match(exporter, /exportPdf/);
  assert.match(exporter, /PDFDocument/);
  assert.match(exporter, /RASTER_SCALE/);
});

test("Editor remains independent from AI providers", async () => {
  const editor = await read("src/components/studio/BusinessCardEditor.tsx");
  assert.doesNotMatch(editor, /@google\/genai/);
  assert.doesNotMatch(editor, /openai/i);
  assert.doesNotMatch(editor, /gemini/i);
});

test("Design document includes physical card geometry and safe production bounds", async () => {
  const types = await read("src/lib/studio/types.ts");
  assert.match(types, /STUDIO_CARD_WIDTH_MM = 90/);
  assert.match(types, /STUDIO_CARD_HEIGHT_MM = 50/);
  assert.match(types, /STUDIO_BLEED_MM = 3/);
  assert.match(types, /STUDIO_SAFE_MM = 4/);
});
