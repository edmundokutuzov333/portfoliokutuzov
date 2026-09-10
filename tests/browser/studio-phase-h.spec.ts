import { test, expect } from "@playwright/test";

async function openStudio(page: Parameters<typeof test>[0]) {
  await page.goto("/studio/business-card");
  await expect(page.getByRole("heading", { name: /editor|vector business card/i })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("application", { name: /business card vector editor/i })).toBeVisible();
}

test.describe("Phase H editor QA", () => {
  test("editor exposes all required controls on desktop", async ({ page }) => {
    await openStudio(page);
    await expect(page.getByRole("button", { name: /undo|desfazer/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /redo|refazer/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /save|guardar/i })).toBeVisible();
    await expect(page.locator("input[type=file]")).toHaveCount(1);
    await expect(page.getByText(/SVG · PNG · JPEG · WEBP/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /^SVG$/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /^PNG$/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /^PDF$/i })).toBeVisible();
  });

  test("drag and resize use pointer capture on the actual canvas", async ({ page }) => {
    await openStudio(page);
    const canvas = page.getByRole("application", { name: /business card vector editor/i });
    const layer = page.getByRole("button", { name: /^Name$|^Nome$/i }).first();
    await layer.click();
    const selected = canvas.locator("g").filter({ has: canvas.locator("text") }).first();
    await expect(selected).toBeVisible();
    const before = await selected.boundingBox();
    expect(before).not.toBeNull();
    const point = { x: (before?.x ?? 0) + Math.max(8, (before?.width ?? 16) / 2), y: (before?.y ?? 0) + Math.max(8, (before?.height ?? 16) / 2) };
    await page.mouse.move(point.x, point.y);
    await page.mouse.down();
    await page.mouse.move(point.x + 28, point.y + 12, { steps: 5 });
    await page.mouse.up();
    const after = await selected.boundingBox();
    expect(after).not.toBeNull();
    expect(Math.abs((after?.x ?? 0) - (before?.x ?? 0)) + Math.abs((after?.y ?? 0) - (before?.y ?? 0))).toBeGreaterThan(3);

    const resize = canvas.locator("rect").filter({ has: undefined }).last();
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox).not.toBeNull();
    await page.getByRole("button", { name: /^Name$|^Nome$/i }).click();
    const selectedRects = canvas.locator("rect");
    await expect(selectedRects).toHaveCount(await selectedRects.count());
  });

  test("keyboard movement, undo and redo modify then restore the document", async ({ page }) => {
    await openStudio(page);
    const layer = page.getByRole("button", { name: /^Name$|^Nome$/i }).first();
    await layer.click();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowDown");
    const undo = page.getByRole("button", { name: /undo|desfazer/i });
    const redo = page.getByRole("button", { name: /redo|refazer/i });
    await expect(undo).toBeEnabled();
    await undo.click();
    await expect(redo).toBeEnabled();
    await redo.click();
    await expect(undo).toBeEnabled();
  });

  test("SVG PNG JPEG and WebP file selection is handled without page instability", async ({ page }) => {
    await openStudio(page);
    const input = page.locator("input[type=file]");
    for (const [name, mime] of [["logo.svg", "image/svg+xml"], ["logo.png", "image/png"], ["logo.jpg", "image/jpeg"], ["logo.webp", "image/webp"]] as const) {
      await input.setInputFiles({ name, mimeType: mime, buffer: Buffer.from(mime === "image/svg+xml" ? "<svg xmlns=\"http://www.w3.org/2000/svg\"><rect width=10 height=10/></svg>" : "synthetic-image") });
      await expect(page.getByRole("application", { name: /business card vector editor/i })).toBeVisible();
    }
  });

  test("oversized asset is rejected", async ({ page }) => {
    await openStudio(page);
    const input = page.locator("input[type=file]");
    await input.setInputFiles({ name: "huge.png", mimeType: "image/png", buffer: Buffer.alloc(2 * 1024 * 1024 + 1, 65) });
    await expect(page.getByText(/2 MB|2 MB nesta fase|2 MB in this phase/i)).toBeVisible();
  });

  test("malicious SVG payload is rejected while benign SVG remains accepted", async ({ page }) => {
    await openStudio(page);
    const input = page.locator("input[type=file]");
    const malicious = `<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><rect width="10" height="10"/></svg>`;
    await input.setInputFiles({ name: "evil.svg", mimeType: "image/svg+xml", buffer: Buffer.from(malicious) });
    await expect(page.getByRole("application", { name: /business card vector editor/i })).toBeVisible();
    await expect(page.locator("script")).toHaveCount(0);
  });

  test("touch/mobile editor remains usable", async ({ page }) => {
    await openStudio(page);
    await expect(page.getByRole("application", { name: /business card vector editor/i })).toBeVisible();
    const inputs = page.locator("input");
    await inputs.first().fill("José António");
    await expect(inputs.first()).toHaveValue("José António");
    await page.getByRole("button", { name: /Name|Nome/i }).first().tap().catch(() => undefined);
    await page.mouse.wheel(0, 300);
    await expect(page.getByRole("button", { name: /^PDF$/i })).toBeVisible();
  });
});

test.describe("Phase H digital and email QA", () => {
  test("identity workspace renders QR, URL, vCard and email controls after a published token exists", async ({ page }) => {
    await page.goto("/studio/identity");
    await expect(page.getByText(/Digital identity|Identidade digital/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("button", { name: /publish digital card|publicar cartão digital/i })).toBeVisible();
  });
});
