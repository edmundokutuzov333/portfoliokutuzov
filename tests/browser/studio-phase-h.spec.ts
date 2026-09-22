import { test, expect } from "@playwright/test";

test.describe("Studio public construction gate", () => {
  test("public Studio stays minimal and clearly communicates the private build", async ({ page }) => {
    await page.goto("/studio");
    await expect(page.getByRole("heading", { name: /Something is taking shape/i })).toBeVisible();
    await expect(page.getByText("KUTUZOV STUDIO")).toBeVisible();
    await expect(page.getByText("PRIVATE BUILD")).toBeVisible();
    await expect(page.getByText(/A private creative space for the work behind the work/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /View portfolio/i })).toHaveAttribute("href", "/portfolio");
    await expect(page.getByTestId("studio-construction-signal")).toBeVisible();
    await expect(page.getByText("BUILD SIGNAL")).toHaveCount(0);
    await expect(page.getByText("SYSTEM MAP")).toHaveCount(0);
  });

  test("unfinished Studio surfaces stay private by default", async ({ page }) => {
    for (const path of ["/studio/business-card", "/studio/background", "/studio/identity"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/studio\/?$/);
      await expect(page.getByRole("heading", { name: /Something is taking shape/i })).toBeVisible();
    }
  });

  test("digital card publishing surface is also private by default", async ({ page }) => {
    await page.goto("/card/example-token");
    await expect(page).toHaveURL(/\/studio\/?$/);
    await expect(page.getByText(/A private creative space for the work behind the work/i)).toBeVisible();
  });
});
