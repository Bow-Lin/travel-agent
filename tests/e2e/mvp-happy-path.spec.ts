import { expect, test } from "@playwright/test";

test("happy path from preferences to itinerary", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel(/where are you leaving from/i).fill("Shanghai");
  await page.getByLabel(/budget minimum/i).fill("8000");
  await page.getByLabel(/budget maximum/i).fill("18000");
  await page.getByLabel(/travel month/i).selectOption("October");
  await page.getByText(/^Food$/).click();
  await page.getByText(/^Culture$/).click();
  await page.getByRole("button", { name: /find destinations/i }).click();

  await expect(page.getByText(/ranked shortlist/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Kyoto" })).toBeVisible();

  await page.getByRole("button", { name: /confirm kyoto/i }).click();

  await expect(page.getByText(/confirmed destination/i)).toBeVisible();
  await page.getByRole("button", { name: /generate 6-day itinerary/i }).click();

  await expect(page.getByText(/6-day plan for kyoto/i)).toBeVisible();
  await expect(page.getByText("Day 1", { exact: true })).toBeVisible();
});
