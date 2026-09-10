import { test, expect, type Page } from "@playwright/test";

async function openStudio(page: Page) {
  await page.goto("/studio/business-card");
  await expect(page.getByRole("application", { name: /business card vector editor/i })).toBeVisible({ timeout: 15_000 });
}

async function readDownloadMagic(download: { path(): Promise<string | null> }, expected: "png" | "pdf") {
  const filePath = await download.path();
  expect(filePath).not.toBeNull();
  const { readFile } = await import("node:fs/promises");
  const bytes = await readFile(filePath!);
  const magic = expected === "png" ? [137, 80, 78, 71] : [37, 80, 68, 70];
  expect(Array.from(bytes.slice(0, magic.length))).toEqual(magic);
}

test.describe("Phase H editor QA", () => {
  test("editor exposes controls and physical canvas", async ({ page }) => {
    await openStudio(page);
    await expect(page.getByRole("button", { name: /undo|desfazer/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /redo|refazer/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /save|guardar/i })).toBeVisible();
    await expect(page.getByText(/90 × 50 mm/i)).toBeVisible();
    await expect(page.getByText(/4 mm safe area/i)).toBeVisible();
  });

  test("drag, resize and keyboard movement work on the vector canvas", async ({ page }) => {
    await openStudio(page);
    const canvas = page.getByRole("application", { name: /business card vector editor/i });
    const nameText = canvas.locator("text").filter({ hasText: "Name" }).first();
    await expect(nameText).toBeVisible();
    const before = await nameText.boundingBox();
    expect(before).not.toBeNull();
    await nameText.click();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("button", { name: /undo|desfazer/i })).toBeEnabled();

    const resizeHandle = canvas.locator("rect").last();
    const beforeHandle = await resizeHandle.boundingBox();
    expect(beforeHandle).not.toBeNull();
    await page.mouse.move((beforeHandle?.x ?? 0) + 5, (beforeHandle?.y ?? 0) + 5);
    await page.mouse.down();
    await page.mouse.move((beforeHandle?.x ?? 0) + 30, (beforeHandle?.y ?? 0) + 20, { steps: 5 });
    await page.mouse.up();
    const afterHandle = await resizeHandle.boundingBox();
    expect(afterHandle).not.toBeNull();
    expect(Math.abs((afterHandle?.x ?? 0) - (beforeHandle?.x ?? 0)) + Math.abs((afterHandle?.y ?? 0) - (beforeHandle?.y ?? 0))).toBeGreaterThan(3);
    const after = await nameText.boundingBox();
    expect(after).not.toBeNull();
    expect(Math.abs((after?.x ?? 0) - (before?.x ?? 0))).toBeGreaterThan(0);
  });

  test("undo and redo restore editor history", async ({ page }) => {
    await openStudio(page);
    const layer = page.getByRole("button", { name: /^Name$|^Nome$/i }).first();
    await layer.click();
    await page.keyboard.press("ArrowRight");
    const undo = page.getByRole("button", { name: /undo|desfazer/i });
    const redo = page.getByRole("button", { name: /redo|refazer/i });
    await expect(undo).toBeEnabled();
    await undo.click();
    await expect(redo).toBeEnabled();
    await redo.click();
    await expect(undo).toBeEnabled();
  });

  test("SVG PNG JPEG and WebP assets are accepted without page instability", async ({ page }) => {
    await openStudio(page);
    const input = page.locator("input[type=file]");
    const assets = [
      ["logo.svg", "image/svg+xml", "<svg xmlns=\"http://www.w3.org/2000/svg\"><rect width=10 height=10/></svg>"],
      ["logo.png", "image/png", "synthetic-png"],
      ["logo.jpg", "image/jpeg", "synthetic-jpeg"],
      ["logo.webp", "image/webp", "synthetic-webp"],
    ] as const;
    for (const [name, mime, content] of assets) {
      await input.setInputFiles({ name, mimeType: mime, buffer: Buffer.from(content) });
      await expect(page.getByRole("application", { name: /business card vector editor/i })).toBeVisible();
      await expect(page.locator("script")).toHaveCount(0);
    }
  });

  test("oversized assets are rejected", async ({ page }) => {
    await openStudio(page);
    await page.locator("input[type=file]").setInputFiles({ name: "huge.png", mimeType: "image/png", buffer: Buffer.alloc(2 * 1024 * 1024 + 1, 65) });
    await expect(page.getByText(/2 MB/i)).toBeVisible();
  });

  test("malicious SVG cannot inject script into the application", async ({ page }) => {
    await openStudio(page);
    const malicious = `<svg xmlns="http://www.w3.org/2000/svg"><script>window.__pwned=true</script><rect width="10" height="10"/></svg>`;
    await page.locator("input[type=file]").setInputFiles({ name: "evil.svg", mimeType: "image/svg+xml", buffer: Buffer.from(malicious) });
    await expect(page.locator("script")).toHaveCount(0);
    expect(await page.evaluate(() => Boolean((window as Window & { __pwned?: boolean }).__pwned))).toBe(false);
  });

  test("SVG PNG PDF exports are created with expected file signatures", async ({ page }) => {
    await openStudio(page);
    const svgPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /^SVG$/i }).click();
    const svg = await svgPromise;
    expect(svg.suggestedFilename()).toMatch(/\.svg$/i);

    const pngPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /^PNG$/i }).click();
    await readDownloadMagic(await pngPromise, "png");

    const pdfPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /^PDF$/i }).click();
    await readDownloadMagic(await pdfPromise, "pdf");
  });

  test("Portuguese and English Unicode stay intact in the editor", async ({ page }) => {
    await openStudio(page);
    const inputs = page.locator("input:not([type=file])");
    await inputs.nth(0).fill("José António");
    await inputs.nth(1).fill("Director de Arte / Art Director");
    await expect(inputs.nth(0)).toHaveValue("José António");
    await expect(inputs.nth(1)).toHaveValue("Director de Arte / Art Director");
  });
});

test.describe("Phase H mobile and digital-card QA", () => {
  test("mobile editor remains usable and keeps controls reachable", async ({ page }) => {
    await openStudio(page);
    await expect(page.getByRole("application", { name: /business card vector editor/i })).toBeVisible();
    const firstInput = page.locator("input:not([type=file])").first();
    await firstInput.fill("José António");
    await expect(firstInput).toHaveValue("José António");
    await page.mouse.wheel(0, 700);
    await expect(page.getByRole("button", { name: /^PDF$/i })).toBeVisible();
  });

  test("digital identity workspace renders its publication entry point", async ({ page }) => {
    await page.goto("/studio/identity");
    await expect(page.getByText(/Digital identity|Identidade digital/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("button", { name: /publish digital card|publicar cartão digital/i })).toBeVisible();
  });
});
