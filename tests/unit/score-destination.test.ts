import { describe, expect, it } from "vitest";

import type { PreferenceInput } from "@/lib/types";
import { destinationCatalog } from "@/server/recommendations/destination-catalog";
import { scoreDestination } from "@/server/recommendations/score-destination";

const basePreferences: PreferenceInput = {
  originRegion: "Shanghai",
  tripLengthDays: 5,
  budgetMin: 8000,
  budgetMax: 16000,
  interests: ["culture", "food"],
  climate: "mild",
  pace: "balanced",
  travelMonth: "October",
  partyType: "couple",
};

describe("scoreDestination", () => {
  it("increases score when the budget matches", () => {
    const mediumMatch = destinationCatalog.find((destination) => destination.id === "kyoto-japan");
    const lowMismatch = destinationCatalog.find((destination) => destination.id === "chiang-mai-thailand");

    expect(mediumMatch).toBeDefined();
    expect(lowMismatch).toBeDefined();

    const matchedScore = scoreDestination(basePreferences, mediumMatch!);
    const mismatchedScore = scoreDestination(basePreferences, lowMismatch!);

    expect(matchedScore.score).toBeGreaterThan(mismatchedScore.score);
  });

  it("increases score when climate and month align", () => {
    const mildOctober = destinationCatalog.find((destination) => destination.id === "kyoto-japan");
    const warmOnly = destinationCatalog.find((destination) => destination.id === "da-nang-vietnam");

    expect(mildOctober).toBeDefined();
    expect(warmOnly).toBeDefined();

    const preferredScore = scoreDestination(basePreferences, mildOctober!);
    const lessSuitableScore = scoreDestination(basePreferences, warmOnly!);

    expect(preferredScore.score).toBeGreaterThan(lessSuitableScore.score);
  });

  it("rewards overlapping interests", () => {
    const foodAndCulture = destinationCatalog.find((destination) => destination.id === "kyoto-japan");
    const outdoorOnly = destinationCatalog.find((destination) => destination.id === "queenstown-new-zealand");

    expect(foodAndCulture).toBeDefined();
    expect(outdoorOnly).toBeDefined();

    const overlapScore = scoreDestination(basePreferences, foodAndCulture!);
    const nonOverlapScore = scoreDestination(basePreferences, outdoorOnly!);

    expect(overlapScore.score).toBeGreaterThan(nonOverlapScore.score);
  });

  it("returns scoring reasons for matched dimensions", () => {
    const kyoto = destinationCatalog.find((destination) => destination.id === "kyoto-japan");

    expect(kyoto).toBeDefined();

    const result = scoreDestination(basePreferences, kyoto!);

    expect(result.reasons).toEqual(
      expect.arrayContaining([
        expect.stringContaining("budget"),
        expect.stringContaining("climate"),
        expect.stringContaining("food"),
      ]),
    );
  });
});
