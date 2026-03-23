import { describe, expect, it } from "vitest";

import type { PreferenceInput } from "@/lib/types";
import { recommendDestinations } from "@/server/recommendations/recommend-destinations";

const preferences: PreferenceInput = {
  originRegion: "Shanghai",
  tripLengthDays: 7,
  budgetLevel: "medium",
  interests: ["culture", "food", "history"],
  climate: "mild",
  pace: "balanced",
  travelMonth: "October",
  partyType: "couple",
};

describe("recommendDestinations", () => {
  it("returns between three and five recommendations", () => {
    const recommendations = recommendDestinations(preferences);

    expect(recommendations.length).toBeGreaterThanOrEqual(3);
    expect(recommendations.length).toBeLessThanOrEqual(5);
  });

  it("sorts results by descending score", () => {
    const recommendations = recommendDestinations(preferences);

    expect(recommendations[0].score).toBeGreaterThanOrEqual(recommendations[1].score);
    expect(recommendations[1].score).toBeGreaterThanOrEqual(recommendations[2].score);
  });

  it("includes concise match reasons for every recommendation", () => {
    const recommendations = recommendDestinations(preferences);

    expect(recommendations[0].matchReasons.length).toBeGreaterThan(0);
    expect(recommendations[0].matchReasons.length).toBeLessThanOrEqual(3);
  });

  it("returns recommendation cards in the shared output shape", () => {
    const recommendations = recommendDestinations(preferences);

    expect(recommendations[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      country: expect.any(String),
      summary: expect.any(String),
      matchReasons: expect.any(Array),
      budgetBand: expect.any(String),
      bestMonths: expect.any(Array),
      score: expect.any(Number),
    });
  });
});
