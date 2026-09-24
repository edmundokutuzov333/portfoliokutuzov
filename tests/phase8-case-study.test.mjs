import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL("../" + path, import.meta.url), "utf8");

test("Phase 8 maps every published case study into the new engine", async () => {
  const map = await read("docs/rebuild/FASE-8-DATA-MAP.md");
  const component = await read("src/components/portfolio/CaseStudyPage.tsx");
  const route = await read("src/routes/portfolio.$slug.tsx");

  for (const slug of [
    "absa",
    "vodacom",
    "totalenergies",
    "pernod-ricard-flying-fish",
    "multichoice-dstv-gotv",
    "emose",
    "automotive-nissan-toyota-hyundai",
    "hospitality-hotel-cardoso-ponta-apart",
    "nexus",
    "aurora",
    "volt",
    "chronos",
    "lume",
    "noir",
    "atlas",
    "brava",
  ]) {
    assert.equal(map.includes(slug), true, "missing slug: " + slug);
  }

  assert.match(component, /data-testid="case-study-page"/);
  assert.match(route, /caseStudyOgImageUrl/);
});

test("Phase 8 has editorial and gallery fallback templates", async () => {
  const component = await read("src/components/portfolio/CaseStudyPage.tsx");
  const model = await read("src/lib/case-study.ts");

  assert.match(model, /getCaseStudyTemplate/);
  assert.match(model, /"editorial"/);
  assert.match(model, /"gallery"/);
  assert.match(component, /template === "editorial"/);
  assert.match(component, /FallbackSections/);
  assert.match(component, /if \(!media\.length\) return null/);
});

test("Phase 8 preserves native media proportions and real-data-only results", async () => {
  const component = await read("src/components/portfolio/CaseStudyPage.tsx");
  const server = await read("src/lib/case-study.server.ts");

  assert.match(component, /aspectRatio/);
  assert.match(component, /project\.cover_width/);
  assert.match(component, /project\.cover_height/);
  assert.match(component, /payload\.metrics/);
  assert.doesNotMatch(server, /\.insert\(/);
  assert.doesNotMatch(server, /\.update\(/);
  assert.doesNotMatch(server, /\.delete\(/);
});

test("Phase 8 provides dynamic OG, Node PDF and share endpoints", async () => {
  const og = await read("src/routes/api.portfolio.$slug.og.ts");
  const pdfRoute = await read("src/routes/api.portfolio.$slug.pdf.ts");
  const pdf = await read("src/lib/case-study-pdf.server.ts");
  const share = await read("src/components/portfolio/CaseStudyShareButton.tsx");

  assert.match(og, /image\/svg\+xml/);
  assert.match(og, /getCaseStudyBySlug/);
  assert.match(pdfRoute, /export const runtime = "nodejs"/);
  assert.match(pdfRoute, /renderCaseStudyPdf/);
  assert.match(pdf, /registerFontkit/);
  assert.match(pdf, /embedFont/);
  assert.match(share, /navigator\.share/);
  assert.match(share, /navigator\.clipboard/);
});

test("Phase 8 removes abolished case-study UI patterns", async () => {
  const component = await read("src/components/portfolio/CaseStudyPage.tsx");

  for (const token of [
    "rounded-full",
    "rounded-2xl",
    "bg-gradient",
    "shadow-lg",
    "mono",
    "tracking-[0.2em]",
    "Start a similar project",
  ]) {
    assert.equal(component.includes(token), false, "legacy pattern found: " + token);
  }
});

test("Phase 8 handoff pre-fills the existing contact Project step without creating a second form", async () => {
  const contact = await read("src/routes/contact.lazy.tsx");

  assert.match(contact, /source_case_slug/);
  assert.match(contact, /caseRef/);
  assert.match(contact, /\/api\/portfolio-case-study/);
  assert.match(contact, /Selected case/);
  assert.match(contact, /projectCategoryToBriefType/);
});

test("Phase 8 pins fontkit in package and lock", async () => {
  const pkg = JSON.parse(await read("package.json"));
  const lock = JSON.parse(await read("package-lock.json"));

  assert.equal(pkg.dependencies["@pdf-lib/fontkit"], "^1.1.1");
  assert.equal(lock.packages["node_modules/@pdf-lib/fontkit"].version, "1.1.1");
});
