import { expect, test } from "@playwright/test";

test("validation failure can be corrected", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /find destinations/i }).click();

  await expect(page.getByText(/please choose your departure region/i)).toBeVisible();

  await page.getByLabel(/where are you leaving from/i).fill("Shanghai");
  await page.getByLabel(/travel month/i).selectOption("October");
  await page.getByText(/^Food$/).click();
  await page.getByRole("button", { name: /find destinations/i }).click();

  await expect(page.getByText(/ranked shortlist/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Kyoto" })).toBeVisible();
});
