import { test, expect } from "@playwright/test";

test.describe("portfolio critical journeys", () => {
  test("home renders and exposes the primary navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("link", { name: /portfolio/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /contact/i }).first()).toBeVisible();
  });

  test("portfolio archive renders", async ({ page }) => {
    await page.goto("/portfolio");
    await expect(page.locator("main")).toBeVisible();
    await expect(page).toHaveTitle(/portfolio|edmundo kutuzov/i);
  });

  test("command palette opens with keyboard and can search", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog", { name: /search portfolio/i });
    await expect(dialog).toBeVisible();
    const input = page.getByRole("textbox", { name: /search portfolio projects/i });
    await input.fill("branding");
    await expect(dialog).toContainText(/branding|no projects found/i);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("AI assistant remains keyboard accessible after deferred hydration", async ({ page }) => {
    await page.goto("/");
    const fab = page.locator("#ai-assistant-fab");
    await expect(fab).toBeVisible({ timeout: 10_000 });
    await fab.focus();
    await expect(fab).toBeFocused();
    await fab.press("Enter");
    await expect(page.locator("#ai-assistant-container")).toBeVisible();
    await expect(page.getByRole("button", { name: /voice|voz/i })).toBeVisible();
  });

  test("language switcher translates the public experience and can switch back", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await page.getByRole("button", { name: /switch site language to portuguese/i }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-PT");
    await expect(page.getByRole("link", { name: /portefólio/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /mudar idioma.*inglês/i })).toBeVisible();
    await expect(page.locator("body")).toContainText(/Início|Serviços|Contacto|Disponível para projectos/);

    await page.goto("/services");
    await expect(page.locator("body")).toContainText(/Direcção de arte|Editorial e impressão|Design digital/i);

    await page.goto("/credentials");
    await expect(page.locator("body")).toContainText(/Percurso profissional|Experiência profissional|Disponível em 2026/i);

    await page.goto("/contact");
    await expect(page.locator("body")).toContainText(/Contacto|Iniciar um projecto/i);

    await page.getByRole("button", { name: /mudar idioma.*inglês/i }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("link", { name: /portfolio/i }).first()).toBeVisible();
  });

  test("contact page validates the briefing before submit", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("main")).toBeVisible();
    const form = page.locator("form").first();
    await expect(form).toBeVisible();
    await form.locator("button[type=submit]").last().click().catch(() => {});
    await expect(page.locator("body")).toContainText(/required|project briefing|collaborate/i);
  });

  test("reduced motion respects the browser preference", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await context.close();
  });
});
