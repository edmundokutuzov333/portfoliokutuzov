import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/", "/portfolio", "/services", "/credentials", "/contact", "/studio", "/pt", "/pt/portfolio", "/pt/services", "/pt/credentials", "/pt/contact", "/pt/studio"];

test.describe("Phase 15 WCAG 2.2 AA audit", () => {
  for (const route of routes) {
    test(`axe: ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "networkidle" });
      const results = await new AxeBuilder({ page }).analyze();
      const blocking = results.violations.filter((violation) => ["critical", "serious"].includes(violation.impact ?? ""));
      expect(blocking, `WCAG violations on ${route}`).toEqual([]);
    });
  }
});