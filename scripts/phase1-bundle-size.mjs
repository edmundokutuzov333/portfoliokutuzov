#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

async function walk(dir, out = []) {
  for (const name of await fs.readdir(dir)) {
    const full = path.join(dir, name);
    const stat = await fs.stat(full);
    if (stat.isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

const root = ".vercel/output/static/assets";
let files = [];
try { files = await walk(root); } catch (e) {
  console.error("Missing Vercel static assets:", e);
  process.exit(1);
}
const rows = [];
for (const file of files) {
  if (!/\.(js|css|woff2?|png|jpg|jpeg|webp|avif|svg)$/i.test(file)) continue;
  const data = await fs.readFile(file);
  rows.push({ file: file.replace(/^\.vercel\/output\//, ""), bytes: data.byteLength, gzipBytes: gzipSync(data).byteLength });
}
rows.sort((a,b) => b.gzipBytes - a.gzipBytes);
await fs.mkdir("docs/baseline", { recursive: true });
await fs.writeFile("docs/baseline/bundle-size.json", JSON.stringify({ generatedAt:new Date().toISOString(), rows }, null, 2)+"\n");
console.log(`Recorded ${rows.length} static assets.`);
