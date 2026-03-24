import { describe, expect, it, vi } from "vitest";

import { recommendDestinationsNode } from "@/agent/travel-graph/nodes/recommend-destinations";
import { createInitialTravelAgentState } from "@/agent/travel-graph/state";
import type { TravelModelAdapter } from "@/server/llm/travel-model";

const { searchTravelResearchMock } = vi.hoisted(() => ({
  searchTravelResearchMock: vi.fn(),
}));

vi.mock("@/server/search/tavily", () => ({
  searchTravelResearch: searchTravelResearchMock,
}));

describe("recommendDestinationsNode", () => {
  it("calls the recommendation tool and enriches reasons with llm output", async () => {
    searchTravelResearchMock.mockResolvedValue([
      {
        title: "Sapporo winter city guide",
        url: "https://example.com/sapporo",
        content: "Sapporo, Japan is a compelling choice for a calm cultural winter trip.",
      },
    ]);

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
          destinationScope: "overseas",
          additionalRequirements: "Need tea-house neighborhoods",
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
    const sapporoRecommendation = state.recommendations?.find(
      (recommendation) => recommendation.id === "sapporo-japan",
    );
    expect(sapporoRecommendation).toBeDefined();
    expect(sapporoRecommendation?.matchReasons[0]).toContain("ideal for this trip");
    expect(sapporoRecommendation?.matchReasons).toEqual(
      expect.arrayContaining([expect.stringContaining("Web research")]),
    );
    expect(adapter.enhanceRecommendationSummary).toHaveBeenCalledWith(
      expect.objectContaining({
        additionalRequirements: "Need tea-house neighborhoods",
        travelerContext: expect.not.stringContaining("Need tea-house neighborhoods"),
      }),
    );
    expect(searchTravelResearchMock).toHaveBeenCalledWith(expect.stringContaining("tea-house neighborhoods"));
  });
});
