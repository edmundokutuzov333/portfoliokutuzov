import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL("../" + path, import.meta.url), "utf8");

const SLUGS = [
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
];

test("Phase 8 maps every published case study into one modular engine", async () => {
  const map = await read("docs/rebuild/FASE-8-DATA-MAP.md");
  const model = await read("src/lib/case-study.ts");
  const component = await read("src/components/portfolio/CaseStudyPage.tsx");
  const route = await read("src/routes/portfolio.$slug.tsx");

  for (const slug of SLUGS) {
    assert.equal(map.includes(slug), true, "missing slug: " + slug);
  }

  assert.match(model, /getCaseStudyTemplate/);
  assert.match(model, /"editorial"/);
  assert.match(model, /"gallery"/);
  assert.match(component, /data-testid="case-study-page"/);
  assert.match(component, /CaseStudyLightbox/);
  assert.match(component, /CaseStudyShareButton/);
  assert.match(route, /caseStudyOgImageUrl/);
});

test("Phase 8 fallback is factual and never fabricates an outcome", async () => {
  const component = await read("src/components/portfolio/CaseStudyPage.tsx");
  const server = await read("src/lib/case-study.server.ts");

  assert.match(component, /const context = project\.concept \|\| project\.description/);
  assert.match(component, /const process = project\.idea/);
  assert.match(component, /const outcome = project\.notes/);
  assert.doesNotMatch(component, /const outcome = project\.notes \|\| project\.subtitle/);
  assert.doesNotMatch(server, /\.insert\(/);
  assert.doesNotMatch(server, /\.update\(/);
  assert.doesNotMatch(server, /\.delete\(/);
  assert.doesNotMatch(server, /\.upsert\(/);
});

test("Phase 8 preserves native media proportions and hides empty editorial blocks", async () => {
  const component = await read("src/components/portfolio/CaseStudyPage.tsx");
  const lightbox = await read("src/components/portfolio/CaseStudyLightbox.tsx");

  assert.match(component, /project\.cover_width/);
  assert.match(component, /project\.cover_height/);
  assert.match(component, /item\.width && item\.height/);
  assert.match(component, /ResultsBlock/);
  assert.match(component, /if \(!media\.length\) return null/);
  assert.match(lightbox, /showModal/);
  assert.match(lightbox, /aria-label/);
});

test("Phase 8 provides dynamic OG, Node PDF and share actions", async () => {
  const og = await read("src/routes/api.portfolio.$slug.og.ts");
  const pdfRoute = await read("src/routes/api.portfolio.$slug.pdf.ts");
  const pdf = await read("src/lib/case-study-pdf.server.ts");
  const share = await read("src/components/portfolio/CaseStudyShareButton.tsx");
  const route = await read("src/routes/portfolio.$slug.tsx");

  assert.match(og, /image\/svg\+xml/);
  assert.match(og, /getCaseStudyBySlug/);
  assert.match(pdfRoute, /runtime = "nodejs"/);
  assert.match(pdfRoute, /renderCaseStudyPdf/);
  assert.match(pdf, /registerFontkit/);
  assert.match(pdf, /embedFont/);
  assert.match(share, /navigator\.share/);
  assert.match(share, /navigator\.clipboard/);
  assert.match(route, /og:image:type/);
});

test("Phase 8 pre-fills the existing contact Project step from a case reference", async () => {
  const contact = await read("src/routes/contact.lazy.tsx");

  assert.match(contact, /new URLSearchParams\(window\.location\.search\)/);
  assert.match(contact, /\.get\("ref"\)/);
  assert.match(contact, /setStep\(2\)/);
  assert.match(contact, /setProjectType\(mapped/);
});

test("Phase 8 page removes prohibited template patterns", async () => {
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

test("Phase 8 locks the required PDF dependency", async () => {
  const pkg = JSON.parse(await read("package.json"));
  const lock = JSON.parse(await read("package-lock.json"));

  assert.equal(pkg.dependencies["@pdf-lib/fontkit"], "^1.1.1");
  assert.equal(lock.packages["node_modules/@pdf-lib/fontkit"].version, "1.1.1");
});
