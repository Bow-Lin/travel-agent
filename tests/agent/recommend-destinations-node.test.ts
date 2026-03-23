import { describe, expect, it, vi } from "vitest";

import { recommendDestinationsNode } from "@/agent/travel-graph/nodes/recommend-destinations";
import { createInitialTravelAgentState } from "@/agent/travel-graph/state";
import type { TravelModelAdapter } from "@/server/llm/travel-model";

describe("recommendDestinationsNode", () => {
  it("calls the recommendation tool and enriches reasons with llm output", async () => {
    const adapter: TravelModelAdapter = {
      clarifyMissingInformation: vi.fn().mockResolvedValue("clarify"),
      enhanceRecommendationSummary: vi
        .fn()
        .mockImplementation(async ({ destinationName }) => `${destinationName} is ideal for this trip.`),
      enhanceItineraryDay: vi.fn().mockResolvedValue("itinerary"),
    };

    const state = await recommendDestinationsNode(
      {
        ...createInitialTravelAgentState("thread-1"),
        phase: "recommendation_ready",
        preferences: {
          originRegion: "Shanghai",
          tripLengthDays: 6,
          budgetMin: 8000,
          budgetMax: 18000,
          interests: ["food", "culture"],
          climate: "mild",
          pace: "balanced",
          travelMonth: "October",
          partyType: "couple",
        },
      },
      adapter,
    );

    expect(state.phase).toBe("awaiting_confirmation");
    expect(state.recommendations?.length).toBeGreaterThan(0);
    expect(state.recommendations?.[0].matchReasons[0]).toContain("ideal for this trip");
  });
});
