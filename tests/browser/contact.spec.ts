import { expect, test } from "@playwright/test";

test("contact renders the five named steps and primary channels", async ({ page }) => {
  await page.goto("/contact", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1, name: "Let's talk." })).toBeVisible();

  for (const label of ["Identity", "Project", "Budget", "Timing", "References"]) {
    await expect(page.getByRole("button", { name: new RegExp(label) }).first()).toBeVisible();
  }

  await expect(page.getByText("WhatsApp Direct", { exact: true })).toBeVisible();
  await expect(page.getByText("Formal Email", { exact: true })).toBeVisible();
  await expect(page.getByText("Schedule 30-Min Call", { exact: true })).toBeVisible();
  await expect(page.getByText("Approx. 3–5 min", { exact: true })).toBeVisible();
});

test("contact validates Identity before allowing progress", async ({ page }) => {
  await page.goto("/contact", { waitUntil: "domcontentloaded" });

  await page.getByRole("button", { name: /Continue/ }).click();

  await expect(page.getByRole("alert").filter({ hasText: "Your name is required" })).toBeVisible();
  await expect(page.getByRole("alert").filter({ hasText: "Invalid email" })).toBeVisible();
});

test("contact preserves service handoff in the Project step", async ({ page }) => {
  await page.goto("/contact?service=Digital%20Design", { waitUntil: "domcontentloaded" });

  await expect(page.getByText("Selected discipline: Digital Design", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Project/ }).first()).toBeVisible();
});

test("contact draft persists across reloads", async ({ page }) => {
  await page.goto("/contact", { waitUntil: "domcontentloaded" });

  await page.getByLabel("Full name").fill("Phase 11 Test");
  await page.getByLabel("Email").fill("phase11@example.com");

  await page.reload();

  await expect(page.getByLabel("Full name")).toHaveValue("Phase 11 Test");
  await expect(page.getByLabel("Email")).toHaveValue("phase11@example.com");
});

test("contact uses no visible micro-labels under 14px in the new page", async ({ page }) => {
  await page.goto("/contact", { waitUntil: "domcontentloaded" });

  const tiny = await page.evaluate(() =>
    [...document.querySelectorAll("body *")].filter((element) => {
      const style = getComputedStyle(element);
      return (
        element.childNodes.length > 0 &&
        Number.parseFloat(style.fontSize || "0") < 14 &&
        (element.textContent || "").trim().length > 3 &&
        style.display !== "none" &&
        style.visibility !== "hidden"
      );
    }).length,
  );

  expect(tiny).toBe(0);
});
