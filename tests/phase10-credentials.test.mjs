import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL("../" + path, import.meta.url), "utf8");

test("Phase 10 mounts the dossier Credentials page", async () => {
  const route = await read("src/routes/credentials.tsx");
  const page = await read("src/components/credentials/CredentialsPagePhase10.tsx");

  assert.match(route, /CredentialsPagePhase10|CredentialsPage/);
  for (const chapter of ["Profile", "Numbers", "Experience", "Toolbelt", "Competencies", "Clients", "Principles"]) {
    assert.match(page, new RegExp(chapter));
  }
  assert.match(page, /Strategy, craft and a sharp/);
  assert.match(page, /Press kit \/ CV/);
  assert.match(page, /whatsappLink/);
  assert.match(page, /ClientWall/);
});

test("Phase 10 removes the legacy percentage skill bars and monolithic card patterns", async () => {
  const page = await read("src/components/credentials/CredentialsPagePhase10.tsx");

  for (const token of [
    "rounded-full",
    "rounded-xl",
    "rounded-2xl",
    "shadow-2xl",
    "mono",
    "tracking-[0.2em]",
    "Skill Matrix",
    "Admin-managed credential metric",
  ]) {
    assert.equal(page.includes(token), false, "legacy Credentials pattern found: " + token);
  }
});

test("Phase 10 preserves real credential counts and does not invent a sixth skill", async () => {
  const data = await read("src/lib/credentials-data.ts");
  const page = await read("src/components/credentials/CredentialsPagePhase10.tsx");

  assert.match(data, /FALLBACK_EXPERIENCE/);
  assert.match(data, /FALLBACK_METRICS/);
  assert.match(data, /FALLBACK_SKILLS/);
  assert.match(page, /The current source contains five skills/);
  assert.doesNotMatch(data, /Vibe Coding/);
});

test("Phase 10 uses one deterministic experience source ordered newest first", async () => {
  const data = await read("src/lib/credentials-data.ts");
  const home = await read("src/components/home/HomeExperience.tsx");
  const page = await read("src/components/credentials/CredentialsPagePhase10.tsx");

  assert.match(data, /sortExperience/);
  assert.match(home, /sortExperience/);
  assert.match(page, /sortExperience/);
  assert.match(data, /role: "Graphic Designer",\n    company: "Ikigai Moçambique"/);
  assert.doesNotMatch(data, /Senior Graphic Designer/);
});

test("Phase 10 press kit is a Node server route using pdf-lib and qrcode-generator", async () => {
  const route = await read("src/routes/api.credentials.press-kit.pdf.ts");
  const pdf = await read("src/lib/credentials-pdf.server.ts");

  assert.match(route, /runtime = "nodejs"/);
  assert.match(route, /renderCredentialsPdf/);
  assert.match(pdf, /from "pdf-lib"/);
  assert.match(pdf, /from "qrcode-generator"/);
  assert.match(pdf, /https:\/\/edmundokutuzov\.art/);
  assert.match(pdf, /fetchClients/);
  assert.match(pdf, /fetchCredentialSource/);
  assert.match(pdf, /site_settings/);
});

test("Phase 10 public implementation has no production writes", async () => {
  const files = [
    "src/components/credentials/CredentialsPagePhase10.tsx",
    "src/lib/credentials-data.ts",
    "src/lib/credentials-pdf.server.ts",
    "src/routes/api.credentials.press-kit.pdf.ts",
  ];

  for (const path of files) {
    const source = await read(path);
    for (const token of [".insert(", ".update(", ".delete(", ".upsert("]) {
      assert.equal(source.includes(token), false, path + " contains " + token);
    }
  }
});


test("Phase 10 keeps Home and Credentials on the same credential metrics source", async () => {
  const home = await read("src/components/home/HomeExperience.tsx");
  const data = await read("src/lib/credentials-data.ts");

  assert.match(home, /const metrics/);
  assert.match(home, /metrics\.map/);
  assert.doesNotMatch(home, /NUMBERS_DATA\.map/);
  assert.match(data, /FALLBACK_METRICS/);
});
