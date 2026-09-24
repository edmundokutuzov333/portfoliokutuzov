#!/usr/bin/env node
import fs from "node:fs";
import assert from "node:assert/strict";

function read(file) {
  return fs.readFileSync(file, "utf8");
}

const inventory = read("docs/baseline/INVENTARIO.md");
const projects = read("src/data/projects.ts");
const clients = read("src/data/clients.ts");
const credentialsData = read("src/lib/credentials-data.ts");
const credentials = read("src/routes/credentials.tsx");

const staticProjects = (projects.match(/^\s+id:\s*\d+,/gm) ?? []).length;
const staticClients = (clients.match(/^\s+['"][^'"]+['"],?$/gm) ?? []).length;
const experienceItems = (credentialsData.match(/\bperiod:\s*"/g) ?? []).length;
const competencyGroups = (credentials.match(/category:\s*"/g) ?? []).length;

const checks = [
  ["projects", staticProjects, 16],
  ["clients", staticClients, 16],
  ["experience", experienceItems, 5],
  ["competency_groups", competencyGroups, 3],
];

for (const [label, actual, expected] of checks) {
  assert.equal(actual, expected, `Parity mismatch for ${label}: ${actual} != ${expected}`);
}

assert.match(inventory, /Portfolio projects.*16/);
assert.match(inventory, /Clients.*16/);
assert.match(inventory, /Experience.*5/);
assert.match(inventory, /Competency groups.*3/);

console.log(JSON.stringify({
  status: "PASS",
  baseline: { projects: 16, clients: 16, experience: 5, competencyGroups: 3 },
  currentStatic: { projects: staticProjects, clients: staticClients, experience: experienceItems, competencyGroups },
  note: "Database parity remains a runtime gate and is not rewritten from hard-coded fallbacks."
}, null, 2));
