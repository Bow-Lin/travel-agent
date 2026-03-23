import { expect, test } from "@playwright/test";

test("homepage CTA opens the planner page", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /tell us how you want to travel/i })).toBeVisible();
  await page.getByRole("link", { name: /start planning/i }).click();

  await expect(page).toHaveURL(/\/plan$/);
  await expect(page.getByLabel(/where are you leaving from/i)).toBeVisible();
});
