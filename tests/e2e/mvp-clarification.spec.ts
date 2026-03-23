import { expect, test } from "@playwright/test";

test("agent clarification appears before a valid shortlist", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel(/where are you leaving from/i).fill("Shanghai");
  await page.getByRole("button", { name: /find destinations/i }).click();

  await expect(page.getByText(/please share interests/i)).toBeVisible();

  await page.getByLabel(/travel month/i).selectOption("October");
  await page.getByText(/^Food$/).click();
  await page.getByText(/^Culture$/).click();
  await page.getByRole("button", { name: /find destinations/i }).click();

  await expect(page.getByText(/ranked shortlist/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Kyoto" })).toBeVisible();
});
