#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = path.join(rootDir, "dist", "client");
const assetsDir = path.join(clientDir, "assets");

if (!fs.existsSync(assetsDir)) {
  throw new Error("Vite did not generate dist/client/assets.");
}

const assetFiles = fs.readdirSync(assetsDir);
const entryCandidates = assetFiles
  .filter((file) => /^index-.*\.js$/.test(file))
  .map((file) => ({
    file,
    size: fs.statSync(path.join(assetsDir, file)).size,
  }))
  .sort((a, b) => b.size - a.size);

const entry = entryCandidates[0]?.file;
const stylesheet = assetFiles.find((file) => /^styles-.*\.css$/.test(file));

if (!entry) {
  throw new Error("Could not identify the generated client entry bundle.");
}

const stylesheetTag = stylesheet
  ? "\n    <link rel=\"stylesheet\" href=\"/assets/" + stylesheet + "\" />"
  : "";

const html = [
  "<!doctype html>",
  '<html lang="en">',
  "  <head>",
  '    <meta charset="UTF-8" />',
  '    <meta name="viewport" content="width=device-width, initial-scale=1" />',
  '    <meta name="theme-color" content="#000000" />',
  "    <title>Edmundo Kutuzov - Art Director</title>",
  '    <meta name="description" content="Visual identities, art direction and campaign design built with strategic clarity and typographic craft." />' + stylesheetTag,
  "  </head>",
  "  <body>",
  '    <div id="root"></div>',
  '    <script type="module" src="/assets/' + entry + '"></script>',
  "  </body>",
  "</html>",
  "",
].join("\n");

fs.writeFileSync(path.join(clientDir, "index.html"), html);
console.log("Static Vercel entry generated: assets/" + entry + (stylesheet ? " + assets/" + stylesheet : ""));
