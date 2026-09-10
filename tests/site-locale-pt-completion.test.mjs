import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");

test("Portuguese completion bridge is mounted without changing the English default", () => {
  const bridge = read("src/lib/site-locale-completion.ts");
  const root = read("src/routes/__root.tsx");

  assert.match(bridge, /getSiteLocale\(\) !== \"pt-PT\"/);
  assert.match(bridge, /MutationObserver/);
  assert.match(bridge, /aria-label.*placeholder.*title/);
  assert.match(root, /installSiteLocaleDomBridge/);
  assert.match(root, /installPortugueseCompletionBridge/);
  assert.match(root, /const cleanupPrimary/);
  assert.match(root, /const cleanupPortuguese/);
});

test("Portuguese completion catalogue covers the visible gaps from the public pages", () => {
  const bridge = read("src/lib/site-locale-completion.ts");
  const required = [
    ["Scope of Competencies", "Âmbito de competências"],
    ["Selected Collaborations", "Colaborações seleccionadas"],
    ["Core Disciplines", "Disciplinas centrais"],
    ["Music Video & Single Rollouts", "Videoclipes e lançamentos de singles"],
    ["View all projects", "Ver todos os projectos"],
    ["Open for 2026 Collaborations", "Aberto a colaborações em 2026"],
    ["Direct Channels", "Canais directos"],
    ["Schedule 30-Min Call", "Marcar chamada de 30 min"],
    ["Send Project Brief", "Enviar briefing do projecto"],
    ["Design is not just what it looks like and feels like. Design is how it works.", "O design não é apenas aquilo que se vê e se sente. É a forma como funciona."],
  ];

  for (const [source, target] of required) {
    assert.match(bridge, new RegExp(source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(bridge, new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("Portuguese completion covers portfolio categories and dynamic counters", () => {
  const bridge = read("src/lib/site-locale-completion.ts");
  for (const pair of [
    ["Ad Campaigns", "Campanhas publicitárias"],
    ["Offline Actions", "Acções offline"],
    ["Clothes Design", "Design de vestuário"],
    ["Videos", "Vídeos"],
    ["Digital Design", "Design digital"],
  ]) {
    assert.match(bridge, new RegExp(pair[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(bridge, new RegExp(pair[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(bridge, /Showing\\s\+\(\\d\\+\\)\\s\+of\\s\+\(\\d\\+\\\)/);
  assert.match(bridge, /A mostrar \\$1 de \\$2/);
});
