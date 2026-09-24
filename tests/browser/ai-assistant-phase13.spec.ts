import { expect, test } from "@playwright/test";

test("AI assistant opens as accessible dialog with required identity and privacy notice", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const fab = page.getByRole("button", { name: "Talk to Kutuzov in Real Time" });
  await expect(fab).toBeVisible();
  await fab.click();
  const dialog = page.getByRole("dialog", { name: "Talk to Kutuzov in Real Time" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("AI Creative Director Assistant", { exact: true })).toBeVisible();
  await expect(dialog.getByText(/Conversations may be processed by Google Gemini|As conversas podem ser processadas pelo Google Gemini/)).toBeVisible();
  await expect(dialog.locator("textarea")).toBeFocused();
});

test("AI assistant keeps the four default prompt choices on Home", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Talk to Kutuzov in Real Time" }).click();
  const dialog = page.getByRole("dialog", { name: "Talk to Kutuzov in Real Time" });
  for (const prompt of ["Show me selected work", "What services do you offer?", "I have a project in mind", "What makes the approach different?"]) {
    await expect(dialog.getByRole("button", { name: prompt })).toBeVisible();
  }
});

test("AI assistant renders streamed citations and keeps Escape focus-safe", async ({ page }) => {
  await page.route("**/api/chat", async (route) => {
    const request = route.request();
    const body = request.postDataJSON();
    if (body?.action === "opening_message") {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ message: "Grounded opening." }) });
      return;
    }
    const stream = [
      "data: " + JSON.stringify({ type: "citations", citations: [{ id: "chunk-1", title: "Selected project", url: "/portfolio/example", sourceTable: "case_studies" }]) + "\n\n",
      "data: " + JSON.stringify({ type: "chunk", text: "Grounded answer." }) + "\n\n",
      "data: " + JSON.stringify({ type: "done", modelUsed: "test", latencyMs: 1 }) + "\n\n",
    ].join("");
    await route.fulfill({ status: 200, contentType: "text/event-stream", body: stream });
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const fab = page.getByRole("button", { name: "Talk to Kutuzov in Real Time" });
  await fab.click();
  await page.getByRole("button", { name: "Show me selected work" }).click();
  const dialog = page.getByRole("dialog", { name: "Talk to Kutuzov in Real Time" });
  await expect(dialog.getByText("Grounded answer.")).toBeVisible();
  await expect(dialog.getByText("Selected project")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(fab).toBeFocused();
});
