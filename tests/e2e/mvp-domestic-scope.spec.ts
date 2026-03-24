import { expect, test } from "@playwright/test";

test("domestic scope keeps shortlist inside China", async ({ page }) => {
  await page.goto("/plan");

  await page.getByLabel(/where are you leaving from/i).fill("Shanghai");
  await page.getByLabel(/budget minimum/i).fill("4000");
  await page.getByLabel(/budget maximum/i).fill("12000");
  await page.getByRole("button", { name: /domestic/i }).click();
  await page.getByLabel(/travel month/i).selectOption("October");
  await page.getByText(/^Food$/).click();
  await page.getByRole("button", { name: /find destinations/i }).click();

  await expect(page.getByText(/ranked shortlist/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Chengdu" })).toBeVisible();
  await expect(page.getByText("China")).toBeVisible();
});
