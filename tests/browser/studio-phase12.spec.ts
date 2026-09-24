import { expect, test } from "@playwright/test";

test("studio shows prelaunch content, facts and waitlist", async ({ page }) => {
  await page.goto("/studio", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: "A studio still finding its lines." })).toBeVisible();
  await expect(page.getByText("Private, by invitation", { exact: true })).toBeVisible();
  await expect(page.getByText("When every layer holds", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Notify me" })).toBeVisible();
});

test("studio constellation has a pointer interaction surface", async ({ page }) => {
  await page.goto("/studio", { waitUntil: "domcontentloaded" });
  const constellation = page.getByRole("img", { name: "Kutuzov Studio constellation" });
  await expect(constellation).toBeVisible();
  const box = await constellation.boundingBox();
  if (!box) throw new Error("Constellation bounds unavailable");
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.3);
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.7);
});

test("studio confirmation query is handled on the Studio route", async ({ page }) => {
  await page.goto("/studio?newsletter_confirm=invalid-confirmation-token", { waitUntil: "domcontentloaded" });
  await expect(page.getByText(/Confirmation failed|Confirming your place\./)).toBeVisible();
});
