import { describe, expect, it } from "vitest";

import { destinationCatalog } from "@/server/recommendations/destination-catalog";

describe("destinationCatalog", () => {
  it("contains at least ten destinations for the MVP", () => {
    expect(destinationCatalog.length).toBeGreaterThanOrEqual(10);
  });

  it("stores the required fields for each destination", () => {
    for (const destination of destinationCatalog) {
      expect(destination.id).toBeTruthy();
      expect(destination.name).toBeTruthy();
      expect(destination.country).toBeTruthy();
      expect(destination.summary).toBeTruthy();
      expect(destination.interests.length).toBeGreaterThan(0);
      expect(destination.bestMonths.length).toBeGreaterThan(0);
    }
  });

  it("captures budget, climate, and trip-style metadata", () => {
    const kyoto = destinationCatalog.find((destination) => destination.id === "kyoto-japan");

    expect(kyoto).toMatchObject({
      budgetBand: "medium",
      climate: ["mild", "cold"],
      interests: expect.arrayContaining(["culture", "history", "food"]),
    });
  });
});
