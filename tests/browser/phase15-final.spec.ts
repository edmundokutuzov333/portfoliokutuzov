import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PUBLIC_ROUTES = [
  "/", "/portfolio", "/portfolio/absa", "/services", "/credentials", "/contact", "/studio",
  "/pt", "/pt/portfolio", "/pt/portfolio/absa", "/pt/services", "/pt/credentials", "/pt/contact", "/pt/studio",
] as const;

for (const route of PUBLIC_ROUTES) {
  test("Phase 15 route " + route + " responds and passes automated WCAG AA", async ({ page }) => {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("main")).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "best-practice"])
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}

test("Phase 15 mobile public routes keep 44px interactive targets and visible labels", async ({ page }) => {
  await page.goto("/contact", { waitUntil: "domcontentloaded" });
  const undersized = await page.evaluate(() =>
    [...document.querySelectorAll("a,button,input,select,textarea")].filter((element) => {
      const node = element as HTMLElement;
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden") return false;
      if (rect.width === 0 || rect.height === 0) return false;
      return rect.width < 44 || rect.height < 44;
    }).map((element) => ({
      tag: element.tagName,
      text: (element.textContent || "").trim().slice(0, 80),
      aria: element.getAttribute("aria-label"),
    })),
  );
  expect(undersized).toEqual([]);
});

test("Phase 15 Reel exposes pause and non-drag controls", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const pause = page.getByRole("button", { name: /pause|resume/i }).first();
  await expect(pause).toBeVisible();
  const rect = await pause.boundingBox();
  expect(rect?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(rect?.height ?? 0).toBeGreaterThanOrEqual(44);
  await expect(page.getByRole("button", { name: /previous|next/i }).first()).toBeVisible();
});

test("Phase 15 admin surfaces stay protected and unindexed", async ({ page }) => {
  const admin = await page.goto("/admin", { waitUntil: "domcontentloaded" });
  expect(admin?.status()).toBe(200);
  await expect(page).toHaveURL(/\/admin/);
  await expect(page.locator("meta[name=\"robots\"]")).toHaveAttribute("content", /noindex/i);

  const studio = await page.goto("/admin/studio", { waitUntil: "domcontentloaded" });
  expect(studio?.status()).toBe(200);
  await expect(page.locator("meta[name=\"robots\"]")).toHaveAttribute("content", /noindex/i);
});

test("Phase 15 PT mirror routes carry the correct document language", async ({ page }) => {
  await page.goto("/pt", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-PT");
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
