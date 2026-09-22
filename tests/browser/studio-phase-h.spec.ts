import { test, expect } from "@playwright/test";

test.describe("Studio public construction gate", () => {
  test("public Studio surface communicates the private build and exposes the work", async ({ page }) => {
    await page.goto("/studio");
    await expect(page.getByRole("heading", { name: /Something more precise is taking shape/i })).toBeVisible();
    await expect(page.getByText(/Kutuzov Studio is the private creative layer/i)).toBeVisible();
    await expect(page.getByText(/The portfolio remains open/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /Explore the work/i })).toHaveAttribute("href", "/portfolio");
    await expect(page.getByRole("link", { name: /Open portfolio/i })).toHaveAttribute("href", "/portfolio");
    await expect(page.getByRole("button", { name: /Wake the signal/i })).toBeVisible();
    await expect(page.getByRole("button", { name: "Signal" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("studio-construction-signal")).toBeVisible();
    await expect(page.getByText("BUILD SIGNAL")).toBeVisible();
    await expect(page.getByText("A studio is more than a toolbox.")).toBeVisible();
  });

  test("signal mode is interactive", async ({ page }) => {
    await page.goto("/studio");
    const wake = page.getByRole("button", { name: /Wake the signal/i });
    await wake.click();
    await expect(page.getByRole("button", { name: "Signal awake" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText("ACTIVE")).toBeVisible();
  });

  test("unfinished Studio surfaces stay private by default", async ({ page }) => {
    for (const path of ["/studio/business-card", "/studio/background", "/studio/identity"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/studio\/?$/);
      await expect(page.getByRole("heading", { name: /Something more precise is taking shape/i })).toBeVisible();
    }
  });

  test("digital card publishing surface is also private by default", async ({ page }) => {
    await page.goto("/card/example-token");
    await expect(page).toHaveURL(/\/studio\/?$/);
    await expect(page.getByText(/The portfolio remains open/i)).toBeVisible();
  });
});
