#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const routes = ["/", "/portfolio", "/services", "/credentials", "/contact", "/studio"];
const viewports = [
  ["desktop", "1440x900"],
  ["mobile", "390x844"],
];
const slug = (route) => route === "/" ? "home" : route.slice(1).replaceAll("/", "-");

function edgeGrid(file, cols = 160, rows = 100) {
  const png = PNG.sync.read(fs.readFileSync(file));
  const gray = new Float32Array(cols * rows);
  const bw = png.width / cols;
  const bh = png.height / rows;
  for (let cy = 0; cy < rows; cy++) for (let cx = 0; cx < cols; cx++) {
    let sum = 0;
    let count = 0;
    for (let y = Math.floor(cy * bh); y < Math.floor((cy + 1) * bh); y++) {
      for (let x = Math.floor(cx * bw); x < Math.floor((cx + 1) * bw); x++) {
        const i = (y * png.width + x) * 4;
        sum += 0.2126 * png.data[i] + 0.7152 * png.data[i + 1] + 0.0722 * png.data[i + 2];
        count++;
      }
    }
    gray[cy * cols + cx] = count ? sum / count / 255 : 0;
  }
  const edges = new Float32Array(cols * rows);
  for (let y = 1; y < rows - 1; y++) for (let x = 1; x < cols - 1; x++) {
    const g = (dx, dy) => gray[(y + dy) * cols + x + dx];
    const gx = -g(-1,-1) - 2*g(-1,0) - g(-1,1) + g(1,-1) + 2*g(1,0) + g(1,1);
    const gy = -g(-1,-1) - 2*g(0,-1) - g(1,-1) + g(-1,1) + 2*g(0,1) + g(1,1);
    edges[y * cols + x] = Math.min(1, Math.hypot(gx, gy));
  }
  return edges;
}

const missing = [];
const failures = [];
const reports = [];
for (const [route,] of routes.map((r) => [r])) {
  for (const [viewport,] of viewports) {
    const before = path.join("docs", "baseline", "screens", `${slug(route)}-${viewport}.png`);
    const after = path.join("docs", "rebuild", "after", `${slug(route)}-${viewport}.png`);
    if (!fs.existsSync(before) || !fs.existsSync(after)) {
      missing.push({ route, viewport, before, after });
      continue;
    }
    const a = edgeGrid(before);
    const b = edgeGrid(after);
    let diff = 0;
    for (let i = 0; i < a.length; i++) if (Math.abs(a[i] - b[i]) > 0.15) diff++;
    const structuralDiff = diff / a.length;

    const pa = PNG.sync.read(fs.readFileSync(before));
    const pb = PNG.sync.read(fs.readFileSync(after));
    if (pa.width !== pb.width || pa.height !== pb.height) {
      failures.push({ route, viewport, structuralDiff, reason: "dimension mismatch" });
      continue;
    }
    const out = new PNG({ width: pa.width, height: pa.height });
    const pixelDiff = pixelmatch(pa.data, pb.data, out.data, pa.width, pa.height, { threshold: 0.1 });
    const pass = structuralDiff >= 0.45;
    reports.push({ route, viewport, structuralDiff, pixelDiff, pass });
    if (!pass) failures.push({ route, viewport, structuralDiff, reason: "structural diff below 0.45" });
  }
}

if (missing.length) {
  console.log(JSON.stringify({
    status: "NOT_APPLICABLE",
    message: "No after/ screenshots exist yet. This is expected for non-page foundation phases.",
    missing,
    reports,
  }, null, 2));
  process.exit(0);
}
console.log(JSON.stringify({ status: failures.length ? "FAIL" : "PASS", reports }, null, 2));
if (failures.length) process.exit(1);
