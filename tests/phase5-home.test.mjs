import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (file) => fs.readFileSync(file, "utf8");

test("Phase 5 route mounts the new Home composition", () => {
  const route = read("src/routes/index.tsx");
  assert.match(route, /HomePhase5/);
  assert.doesNotMatch(route, /CapabilitiesShort|ClientLogos|HomeExperience|HomeCTA/);
});

test("Home headline is rendered exactly once with no italic accent", () => {
  const home = read("src/components/home/HomePhase5.tsx");
  const headline = "I shape ideas that cut through noise, stay in memory, and move people.";
  assert.equal(home.split(headline).length - 1, 1);
  assert.doesNotMatch(home, /italic/);
  assert.doesNotMatch(home, /mono/);
});

test("Protected Reel is composed, not modified", () => {
  const home = read("src/components/home/HomePhase5.tsx");
  const wrapper = read("src/components/home/DeferredReel.tsx");
  assert.match(home, /import \{ DeferredReel \} from "@\/components\/home\/DeferredReel"/);
  assert.match(home, /<DeferredReel \/>/);
  assert.match(wrapper, /cinematic-portfolio-reel/);
  assert.doesNotMatch(home, /CinematicPortfolioReel/);
});

test("Featured work is data-driven and supports 6–8 real featured records", () => {
  const home = read("src/components/home/HomePhase5.tsx");
  assert.match(home, /project\.featured/);
  assert.match(home, /\.slice\(0, 8\)/);
  assert.match(home, /projects\.length/);
  assert.match(home, /paletteColor/);
  assert.match(home, /setWorkColor/);
  assert.match(home, /Media not supplied in current CMS/);
});

test("Services reuse the existing source of four disciplines and are keyboard/touch expandable", () => {
  const home = read("src/components/home/HomePhase5.tsx");
  const services = read("src/components/services/ServicesInteractive.tsx");
  assert.match(services, /export const STATIC_DISCIPLINES/);
  assert.match(home, /STATIC_DISCIPLINES\.slice\(0, 4\)/);
  assert.match(home, /aria-expanded=/);
  assert.match(home, /onClick=/);
  assert.match(home, /onMouseEnter=/);
  assert.match(home, /onFocus=/);
});

test("Proof uses database-backed clients and metrics, with existing CMS fallback", () => {
  const home = read("src/components/home/HomePhase5.tsx");
  assert.match(home, /useClients/);
  assert.match(home, /useStats/);
  assert.match(home, /metricCards\(settings\)/);
  assert.match(home, /clients\.map/);
  assert.doesNotMatch(home, /150\+/);
  assert.doesNotMatch(home, /30\+/);
});

test("Reference remains sourced from the credentials setting", () => {
  const home = read("src/components/home/HomePhase5.tsx");
  assert.match(home, /readSetting\(settings, "credentials", "reference", "GOD"\)/);
});

test("Homepage composition uses Betao, Preto and a single global closing block", () => {
  const home = read("src/components/home/HomePhase5.tsx");
  const footer = read("src/components/layout/Footer.tsx");
  assert.ok((home.match(/data-tone=/g) || []).length >= 5);
  assert.match(home, /data-tone="preto"/);
  assert.match(home, /data-tone="betao"/);
  assert.match(footer, /const isHome = pathname === localizePath/);
  assert.match(footer, /Tell me what you're building\. I'll show you how to make it impossible to ignore\./);
});

test("Phase 5 does not reintroduce K1–K15 legacy homepage patterns", () => {
  const home = read("src/components/home/HomePhase5.tsx");
  for (const token of ["rounded-full", "rounded-2xl", "bg-gradient", "shadow-[", "sky-300", "uppercase", "tracking-[0.28em]"]) {
    assert.equal(home.includes(token), false, "legacy pattern found: " + token);
  }
});
