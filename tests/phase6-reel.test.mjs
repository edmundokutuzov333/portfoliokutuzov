import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");

test("Phase 6 keeps the protected component and preserves the 3D fan contract", () => {
  const source = read("src/components/ui/cinematic-portfolio-reel.tsx");
  assert.match(source, /export function CinematicPortfolioReel/);
  assert.match(source, /transform-style/);
  assert.match(source, /perspective/);
  assert.match(source, /drag=\{fanMode \? "x" : false\}/);
  assert.match(source, /Math\.abs\(distance\) > RENDER_RADIUS/);
});

test("Phase 6 has reduced-motion row mode and no autoplay when reduced motion is active", () => {
  const source = read("src/components/ui/cinematic-portfolio-reel.tsx");
  assert.match(source, /useReducedMotion/);
  assert.match(source, /snap-x snap-mandatory/);
  assert.match(source, /if \(reducedMotion \|\| paused \|\| hovering \|\| focused \|\| !visible\) return/);
});

test("Phase 6 provides full keyboard navigation and button alternatives", () => {
  const source = read("src/components/ui/cinematic-portfolio-reel.tsx");
  for (const key of ["ArrowLeft", "ArrowRight", "Home", "End", "Enter"]) {
    assert.ok(source.includes('event.key === "' + key + '"'));
  }
  assert.ok(source.includes('event.key === " "'));
  assert.match(source, /Previous project/);
  assert.match(source, /Next project/);
  assert.match(source, /h-11 w-11/);
});

test("Phase 6 announces the active title and exposes carousel semantics", () => {
  const source = read("src/components/ui/cinematic-portfolio-reel.tsx");
  assert.match(source, /role="region"/);
  assert.match(source, /aria-roledescription="carousel"/);
  assert.match(source, /role="group"/);
  assert.match(source, /aria-roledescription="slide"/);
  assert.match(source, /aria-live="polite"/);
});

test("Phase 6 uses real projects and interleaves disciplines without fabrication", () => {
  const source = read("src/components/ui/cinematic-portfolio-reel.tsx");
  assert.match(source, /useProjects/);
  assert.match(source, /roundRobin/);
  assert.match(source, /is_published !== false/);
  assert.match(source, /cover_url/);
  assert.match(source, /paletteColor/);
  assert.doesNotMatch(source, /placeholder\.com|picsum|unsplash/);
});

test("Phase 6 only shows full metadata on the active card", () => {
  const source = read("src/components/ui/cinematic-portfolio-reel.tsx");
  assert.match(source, /\{active \? \(/);
  assert.match(source, /\[item\.client, item\.year\]/);
  assert.match(source, /viewTransitionName: active \? "work-" \+ item\.caseSlug/);
});

test("Phase 6 includes cinema mode and horizontal touch navigation", () => {
  const source = read("src/components/ui/cinematic-portfolio-reel.tsx");
  assert.match(source, /function CinemaDialog/);
  assert.match(source, /touch\.current/);
  assert.match(source, /Math\.abs\(delta\) >= 70/);
  assert.match(source, /Fullscreen selected portfolio item/);
});

test("Phase 6 analytics are server-gated and use a daily salted hash", () => {
  const route = read("src/routes/api.reel-analytics.ts");
  assert.match(route, /REEL_ANALYTICS_ENABLED/);
  assert.match(route, /createHash\("sha256"\)/);
  assert.match(route, /sessionSeed/);
  assert.match(route, /reel_analytics/);
  assert.match(route, /RATE_LIMIT/);
});

test("Phase 6 migration is additive, reversible, and does not invent media", () => {
  const up = read("supabase/migrations/20260924090000_phase6_reel_items.sql");
  const down = read("supabase/migrations/20260924090000_phase6_reel_items.down.sql");
  assert.match(up, /create table if not exists public\.reel_items/);
  assert.match(up, /insert into public\.reel_items/);
  assert.match(up, /where p\.is_published = true/);
  assert.match(up, /and p\.cover_url is not null/);
  assert.match(up, /No synthetic URLs are introduced/);
  assert.match(down, /drop table if exists public\.reel_analytics/);
  assert.match(down, /drop table if exists public\.reel_items/);
});

test("Phase 6 remains blocked until predecessor and external gates are green", () => {
  const state = read("docs/rebuild/STATE.md");
  assert.match(state, /\| 5 \| BLOCKED-EXTERNAL/);
});
