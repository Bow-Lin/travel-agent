import { expect, test } from "@playwright/test";

test("validation failure can be corrected", async ({ page }) => {
  await page.goto("/plan");

  await page.getByRole("button", { name: /find destinations/i }).click();

  await expect(page.getByText(/please share originRegion/i)).toBeVisible();

  await page.getByLabel(/where are you leaving from/i).fill("Shanghai");
  await page.getByLabel(/budget minimum/i).fill("8000");
  await page.getByLabel(/budget maximum/i).fill("18000");
  await page.getByRole("button", { name: /overseas/i }).click();
  await page.getByLabel(/travel month/i).selectOption("October");
  await page.getByText(/^Food$/).click();
  await page.getByRole("button", { name: /find destinations/i }).click();

  await expect(page.getByText(/ranked shortlist/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Kyoto" })).toBeVisible();
});
