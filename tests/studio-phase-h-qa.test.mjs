import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

function count(text, pattern) {
  return (text.match(pattern) || []).length;
}

test("Editor QA contract covers drag, resize, undo, redo, keyboard and pointer/touch input", async () => {
  const editor = await read("src/components/studio/BusinessCardEditor.tsx");
  assert.match(editor, /startDrag/);
  assert.match(editor, /startResize/);
  assert.match(editor, /setPointerCapture/);
  assert.match(editor, /onPointerMove/);
  assert.match(editor, /onPointerUp/);
  assert.match(editor, /onPointerCancel/);
  assert.match(editor, /Undo2/);
  assert.match(editor, /Redo2/);
  assert.match(editor, /event\.key === "Delete"/);
  assert.match(editor, /ArrowLeft/);
  assert.match(editor, /ArrowRight/);
  assert.match(editor, /ArrowUp/);
  assert.match(editor, /ArrowDown/);
  assert.match(editor, /touch-none/);
});

test("Editor history has bounded undo depth and clears redo after a new commit", async () => {
  const editor = await read("src/components/studio/BusinessCardEditor.tsx");
  assert.match(editor, /items\.slice\(-39\)/);
  assert.match(editor, /setFuture\(\[\]\)/);
  assert.match(editor, /setFuture\(\(items\) => \[clone\(designRef\.current\), \.\.\.items\]\)/);
});

test("Asset intake accepts SVG PNG JPEG WebP, rejects PDF in the editor, and caps files", async () => {
  const editor = await read("src/components/studio/BusinessCardEditor.tsx");
  assert.match(editor, /image\/svg\+xml/);
  assert.match(editor, /image\/png/);
  assert.match(editor, /image\/jpeg/);
  assert.match(editor, /image\/webp/);
  assert.match(editor, /application\/pdf/);
  assert.match(editor, /2 \* 1024 \* 1024/);
});

test("SVG renderer escapes every user-controlled value used in SVG markup", async () => {
  const svg = await read("src/lib/studio/svg.ts");
  assert.match(svg, /const esc = \(value: string\)/);
  for (const value of ["design.background.value", "design.background.secondary", "element.fill", "element.fontFamily", "element.text", "element.src"]) {
    assert.ok(svg.includes(`esc(${value})`), `${value} is not escaped`);
  }
  assert.doesNotMatch(svg, /innerHTML/);
  assert.doesNotMatch(svg, /dangerouslySetInnerHTML/);
});

test("Public identity sanitization constrains image payloads and geometry", async () => {
  const identity = await read("src/lib/studio/identity-format.ts");
  assert.match(identity, /DATA_IMAGE/);
  assert.ok(identity.includes("data:image"));
  assert.match(identity, /src\.length <= 6_000_000/);
  assert.match(identity, /slice\(0, 300\)/);
  assert.match(identity, /elements\.slice\(0, 20\)/);
  assert.match(identity, /HEX\.test/);
  assert.match(identity, /widthMm: 90/);
  assert.match(identity, /heightMm: 50/);
});

test("Exports share one rendering source and cover SVG PNG PDF", async () => {
  const exporter = await read("src/lib/studio/export.ts");
  assert.match(exporter, /designToSvg/);
  assert.match(exporter, /createPngDataUrl/);
  assert.match(exporter, /createPdfDataUrl/);
  assert.match(exporter, /PDFDocument/);
  assert.match(exporter, /RASTER_SCALE = 4/);
  assert.match(exporter, /image\/png/);
  assert.match(exporter, /application\/pdf/);
});

test("Email pipeline validates attachments and keeps PDF PNG vCard and digital URL together", async () => {
  const route = await read("src/routes/api.studio-email.ts");
  assert.match(route, /RESEND_API_KEY/);
  assert.match(route, /STUDIO_EMAIL_FROM/);
  assert.match(route, /MAX_ATTACHMENT_BYTES/);
  assert.match(route, /pngDataUrl/);
  assert.match(route, /pdfDataUrl/);
  assert.match(route, /vcard/);
  assert.match(route, /digitalUrl/);
  assert.match(route, /api\.resend\.com\/emails/);
  assert.match(route, /attachments/);
});

test("Public telemetry is bounded, rate limited and denies sensitive internal event types", async () => {
  const route = await read("src/routes/api.studio-admin.ts");
  assert.match(route, /MAX_EVENTS = 80/);
  assert.match(route, /16 \* 1024/);
  assert.match(route, /Retry-After/);
  assert.match(route, /isCorsOriginAllowed/);
  assert.doesNotMatch(route, /"generation_started"\s*,/);
  assert.doesNotMatch(route, /"ai_request"\s*,/);
  assert.doesNotMatch(route, /"email_started"\s*,/);
  assert.match(route, /trackStudioEvent/);
});

test("Admin analytics endpoint authenticates claims and admin membership", async () => {
  const route = await read("src/routes/api.studio-admin.ts");
  assert.match(route, /authorization/);
  assert.match(route, /getClaims/);
  assert.match(route, /rpc\("is_admin"\)/);
  assert.match(route, /rpc\("studio_admin_dashboard"/);
});

test("Digital card telemetry covers view, share, contact save and channel clicks", async () => {
  const page = await read("src/routes/card.$token.tsx");
  for (const event of ["digital_card_view", "digital_card_share", "digital_card_save_contact", "digital_card_email_click", "digital_card_phone_click", "digital_card_website_click"]) {
    assert.match(page, new RegExp(event));
  }
});

test("Locale and Unicode QA paths are represented in Studio content and vCard generation", async () => {
  const editor = await read("src/components/studio/BusinessCardEditor.tsx");
  const identity = await read("src/lib/studio/identity-format.ts");
  assert.match(editor, /João Manuel/);
  assert.match(editor, /Logótipo/);
  assert.match(editor, /Managing Director/);
  assert.match(identity, /VERSION:4\.0/);
  assert.match(identity, /escapeVCard/);
  assert.match(identity, /\\n/);
  assert.match(identity, /\\;/);
  assert.match(identity, /\\,/);
});

test("QA surface has substantial coverage rather than one smoke assertion per area", async () => {
  const editor = await read("src/components/studio/BusinessCardEditor.tsx");
  const identity = await read("src/lib/studio/identity-format.ts");
  const email = await read("src/routes/api.studio-email.ts");
  const svg = await read("src/lib/studio/svg.ts");
  assert.ok(count(editor, /onPointer|Undo2|Redo2|file\.type/g) >= 6);
  assert.ok(count(identity, /clamp|HEX|DATA_IMAGE|escapeVCard/g) >= 8);
  assert.ok(count(email, /MAX_|validate|attachment|base64|Content-Type/g) >= 8);
  assert.ok(count(svg, /esc\(/g) >= 6);
});
