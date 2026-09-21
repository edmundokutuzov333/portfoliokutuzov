import { test, expect } from "@playwright/test";

test.describe("Studio public construction gate", () => {
  test("public Studio surface clearly communicates private construction and links to the portfolio", async ({ page }) => {
    await page.goto("/studio");
    await expect(page.getByRole("heading", { name: /Something is taking shape/i })).toBeVisible();
    await expect(page.getByText("Private construction")).toHaveCount(0);
    await expect(page.getByText("Public surface")).toHaveCount(0);
    await expect(page.getByText("Portfolio first")).toHaveCount(0);
    await expect(page.getByText("Private build")).toHaveCount(0);
    await expect(page.getByText(/Kutuzov Studio is currently under construction/i)).toBeVisible();
    await expect(page.getByText(/The tools are being built privately/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /Explore the portfolio/i })).toHaveAttribute("href", "/portfolio");
    await expect(page.getByRole("link", { name: /Return home/i })).toHaveAttribute("href", "/");
    await expect(page.getByTestId("studio-construction-signal")).toBeVisible();
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
    await expect(page.getByText(/Kutuzov Studio is currently under construction/i)).toBeVisible();
  });
});
