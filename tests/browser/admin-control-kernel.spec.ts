import { test, expect } from "@playwright/test";

test.describe("Admin Control Kernel public boundary", () => {
  test("/admin remains protected for anonymous visitors", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByText("CONTROL ROOM").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Enter Control Room/i })).toBeVisible();
    await expect(page.getByText(/Signed in but not authorized/i)).not.toBeVisible();
  });

  test("/admin/studio remains protected for anonymous visitors", async ({ page }) => {
    await page.goto("/admin/studio");
    await expect(page.getByText(/CONTROL ROOM|Access restricted/i).first()).toBeVisible();
  });
});
