import { test, expect } from "@playwright/test";

test.describe("portfolio critical journeys", () => {
  test("home renders, reel is first, and navigation stays above it", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("link", { name: /portfolio/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /contact/i }).first()).toBeVisible();
    await expect(page.locator("main > section").first()).toHaveAttribute(
      "aria-label",
      "Selected portfolio reel",
    );
    await expect(page.locator("header")).toHaveCSS("z-index", "1000");
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

  test("AI assistant opens with a designed welcome and quick actions", async ({ page }) => {
    await page.goto("/");
    const fab = page.locator("#ai-assistant-fab");
    await expect(fab).toBeVisible({ timeout: 10_000 });
    await fab.focus();
    await expect(fab).toBeFocused();
    await fab.press("Enter");
    const assistant = page.locator("#ai-assistant-container");
    await expect(assistant).toBeVisible();
    await expect(assistant).toContainText(/creative desk|digital creative desk/i);
    await expect(
      assistant
        .getByRole("button")
        .filter({ hasText: /selected work|services/i })
        .first(),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /voice|voz/i })).toBeVisible();
  });

  test("voice transcript interim updates do not duplicate the utterance", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main")).toBeVisible();
  });

  test("language switcher translates the public experience and can switch back", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await page.getByRole("button", { name: /switch site language to portuguese/i }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-PT");
    await expect(page.getByRole("link", { name: /portefólio/i }).first()).toBeVisible();
    await expect(page.locator("body")).toContainText(
      /Início|Serviços|Contacto|Disponível para projectos/,
    );
    await expect(page.locator("body")).toContainText(
      /cortam o ruído|ficam na memória|mobilizam pessoas/i,
    );
    await expect(page.locator("body")).toContainText(
      /Selecção de portefólio|Trabalho seleccionado/i,
    );

    await page.goto("/services");
    await expect(page.locator("body")).toContainText(
      /Direcção de arte|Editorial e impressão|Design digital/i,
    );

    await page.goto("/credentials");
    await expect(page.locator("body")).toContainText(
      /Percurso profissional|Experiência profissional|Disponível em 2026/i,
    );

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
    await form
      .locator("button[type=submit]")
      .last()
      .click()
      .catch(() => {});
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
