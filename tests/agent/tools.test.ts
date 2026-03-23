import { describe, expect, it } from "vitest";

import type { ConfirmedDestination, PreferenceInput } from "@/lib/types";
import { runItineraryTool } from "@/agent/travel-graph/tools/itinerary-tool";
import { runRecommendationTool } from "@/agent/travel-graph/tools/recommendation-tool";

const preferences: PreferenceInput = {
  originRegion: "Shanghai",
  tripLengthDays: 5,
  budgetMin: 8000,
  budgetMax: 18000,
  interests: ["food", "culture"],
  climate: "mild",
  pace: "balanced",
  travelMonth: "October",
  partyType: "couple",
};

const destination: ConfirmedDestination = {
  destinationId: "kyoto-japan",
  name: "Kyoto",
  country: "Japan",
};

describe("travel graph tools", () => {
  it("returns ranked recommendations from the recommendation tool", () => {
    const recommendations = runRecommendationTool(preferences);

    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      score: expect.any(Number),
    });
  });

  it("returns itinerary structure from the itinerary tool", () => {
    const itinerary = runItineraryTool({ preferences, destination });

    expect(itinerary.destination).toEqual(destination);
    expect(itinerary.days).toHaveLength(5);
  });
});
