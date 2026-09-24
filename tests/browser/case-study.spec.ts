import { expect, test } from "@playwright/test";

test("case study route renders the new narrative structure", async ({ page }) => {
  await page.goto("/portfolio/absa", { waitUntil: "domcontentloaded" });

  await expect(page.getByTestId("case-study-page")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Start a project" })).toBeVisible();
  await expect(page.getByRole("link", { name: /PDF/i })).toBeVisible();
});

test("case study share control is keyboard reachable", async ({ page }) => {
  await page.goto("/portfolio/absa", { waitUntil: "domcontentloaded" });

  const share = page.getByRole("button", { name: /Share this case study/i });
  await share.focus();

  await expect(share).toBeFocused();
});

test("gallery and result blocks stay hidden when production has no such data", async ({ page }) => {
  await page.goto("/portfolio/absa", { waitUntil: "domcontentloaded" });

  await expect(page.getByText("Results", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Gallery", { exact: true })).toHaveCount(0);
});
