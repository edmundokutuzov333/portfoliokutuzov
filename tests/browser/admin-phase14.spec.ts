import { expect, test } from "@playwright/test";

test("Admin Studio exposes noindex metadata without changing public Studio route", async ({ page }) => {
  await page.goto("/admin/studio", { waitUntil: "domcontentloaded" });
  await expect(page.locator("meta[name=\"robots\"]")).toHaveAttribute("content", /noindex/);
  await page.goto("/studio", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/studio$/);
  await expect(page.getByText("A studio still finding its lines.", { exact: true })).toBeVisible();
});

test("Admin route remains protected from unauthenticated access", async ({ page }) => {
  await page.goto("/admin", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/admin/);
  await expect(page.getByText(/sign in|access restricted|Control Room/i).first()).toBeVisible();
});
