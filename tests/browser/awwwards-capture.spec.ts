import { test } from "@playwright/test";

const routes = ["/", "/portfolio", "/services", "/credentials", "/contact", "/studio"];

test.use({ video: "on" });
test.setTimeout(60_000);

test.describe("Awwwards capture", () => {
  test("desktop walkthrough", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.screenshot({ path: "docs/awwwards/desktop-home.png", fullPage: true });
    for (const route of routes.slice(1)) {
      await page.goto(route, { waitUntil: "networkidle" });
      await page.waitForTimeout(300);
      const name = route === "/portfolio" ? "portfolio" : route.slice(1);
      await page.screenshot({ path: "docs/awwwards/desktop-" + name + ".png", fullPage: false });
    }
    await page.goto("/", { waitUntil: "networkidle" });
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(500);
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(500);
    await page.mouse.wheel(0, 1600);
    await page.waitForTimeout(31_000);
  });

  test("mobile walkthrough", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.screenshot({ path: "docs/awwwards/mobile-home.png", fullPage: true });
    for (const route of routes.slice(1)) {
      await page.goto(route, { waitUntil: "networkidle" });
      await page.waitForTimeout(300);
      const name = route === "/portfolio" ? "portfolio" : route.slice(1);
      await page.screenshot({ path: "docs/awwwards/mobile-" + name + ".png", fullPage: false });
    }
    await page.goto("/", { waitUntil: "networkidle" });
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(500);
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(31_000);
  });
});