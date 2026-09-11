import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");

test("Public site locale is permanently English-only", () => {
  const locale = read("src/lib/site-locale.ts");
  const switcher = read("src/components/layout/LanguageSwitcher.tsx");
  const root = read("src/routes/__root.tsx");
  assert.match(locale, /export type SiteLocale = \"en\"/);
  assert.match(locale, /const DEFAULT_LOCALE: SiteLocale = \"en\"/);
  assert.doesNotMatch(locale, /PT_TRANSLATIONS/);
  assert.doesNotMatch(locale, /pt-PT/);
  assert.match(switcher, /return null/);
  assert.doesNotMatch(switcher, /Portuguese|Português|pt-PT/);
  assert.match(root, /document\.documentElement\.lang=\\?\"en\\?\"/);
  assert.doesNotMatch(root, /installPortugueseCompletionBridge/);
});

test("Legacy Portuguese preference cannot survive hydration", () => {
  const root = read("src/routes/__root.tsx");
  assert.match(root, /localStorage\.removeItem\(\\?\"ek_locale_v2\\?\"\)/);
  assert.match(root, /document\.documentElement\.lang=\\?\"en\\?\"/);
});
