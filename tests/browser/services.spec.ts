import { expect, test } from "@playwright/test";

test("services page exposes four keyboard-operable billboard disciplines", async ({ page }) => {
  await page.goto("/services", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", { level: 1, name: "Visual capabilities & disciplines." }),
  ).toBeVisible();

  const disciplines = [
    "Visual Identity",
    "Art Direction",
    "Editorial & Print",
    "Digital Design",
  ];

  for (const name of disciplines) {
    const button = page.getByRole("button", { name, exact: false });
    await expect(button).toBeVisible();
  }

  const first = page.getByRole("button", { name: /Visual Identity/i }).first();
  await first.focus();
  await expect(first).toBeFocused();
  await expect(first).toHaveAttribute("aria-expanded", "true");

  await expect(page.getByText("Capabilities", { exact: true })).toBeVisible();
});

test("services discipline exposes real selected work and contextual chat", async ({ page }) => {
  await page.goto("/services", { waitUntil: "domcontentloaded" });

  await expect(page.getByText("Selected work", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Ask about this discipline/i }).first()).toBeVisible();
});

test("services CTA hands the active discipline into the existing contact wizard", async ({ page }) => {
  await page.goto("/services", { waitUntil: "domcontentloaded" });

  const cta = page.getByRole("link", { name: "Start a project", exact: true });
  await expect(cta).toHaveAttribute("href", /\/contact\?service=/);
});

test("services does not expose the empty FAQ", async ({ page }) => {
  await page.goto("/services", { waitUntil: "domcontentloaded" });

  await expect(page.getByText("Common questions.", { exact: true })).toHaveCount(0);
});
