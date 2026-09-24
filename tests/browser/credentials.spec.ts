import { expect, test } from "@playwright/test";

test("credentials dossier exposes its seven chapters and primary actions", async ({ page }) => {
  await page.goto("/credentials", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", { level: 1, name: /Strategy, craft and a sharp point of view/i }),
  ).toBeVisible();

  for (const label of ["Profile", "Numbers", "Experience", "Toolbelt", "Competencies", "Clients", "Principles"]) {
    await expect(page.getByRole("link", { name: label, exact: true })).toBeVisible();
  }

  await expect(page.getByRole("link", { name: "Start a project", exact: true }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Press kit \\/ CV/i })).toBeVisible();
});

test("credentials uses rectangular chapter navigation and no percentage bars", async ({ page }) => {
  await page.goto("/credentials", { waitUntil: "domcontentloaded" });

  await expect(page.locator("text=95")).toBeVisible();
  await expect(page.locator("text=Core")).toBeVisible();
  await expect(page.locator("text=Fluent")).toBeVisible();
  await expect(page.locator("text=Exploring")).toBeVisible();
  await expect(page.locator("text=Skill Matrix")).toHaveCount(0);
});

test("credentials press kit endpoint responds as a PDF", async ({ request }) => {
  const response = await request.get("/api/credentials/press-kit.pdf");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
});
