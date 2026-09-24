#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const inputPath = process.argv[2];
const outputPath = process.argv[3] ?? "docs/rebuild/work-colors.backfill.json";

if (!inputPath) {
  console.error("Usage: node scripts/backfill-work-colors.mjs <manifest.json> [output.json]");
  process.exit(2);
}

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error("This local-only backfill tool needs sharp. Install it outside the production runtime with: npm i -D sharp");
  process.exit(2);
}

const manifest = JSON.parse(await fs.readFile(inputPath, "utf8"));
if (!Array.isArray(manifest)) {
  console.error("The manifest must be an array of { id, imagePath, dominantColor?, accentColor? }.");
  process.exit(2);
}

const clamp = (value) => Math.max(0, Math.min(255, Math.round(value)));
const toHex = (rgb) => "#" + rgb.map(clamp).map((value) => value.toString(16).padStart(2, "0")).join("");

async function dominantColor(imagePath) {
  const { data, info } = await sharp(imagePath)
    .resize({ width: 48, height: 48, fit: "cover" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let r = 0;
  let g = 0;
  let b = 0;
  const pixels = Math.max(1, info.width * info.height);

  for (let i = 0; i < data.length; i += info.channels) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }

  return toHex([r / pixels, g / pixels, b / pixels]);
}

const results = [];
for (const item of manifest) {
  results.push({
    id: item.id,
    dominant_color: item.dominantColor ?? (await dominantColor(path.resolve(item.imagePath))),
    accent_color: item.accentColor ?? null,
  });
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, JSON.stringify(results, null, 2) + "\n", "utf8");
console.log("Backfill manifest written:", outputPath);
