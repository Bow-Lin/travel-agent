import { describe, expect, it, vi } from "vitest";

import { generateItineraryNode } from "@/agent/travel-graph/nodes/generate-itinerary";
import { createInitialTravelAgentState } from "@/agent/travel-graph/state";
import type { TravelModelAdapter } from "@/server/llm/travel-model";

describe("generateItineraryNode", () => {
  it("calls the itinerary tool and polishes itinerary text", async () => {
    const adapter: TravelModelAdapter = {
      clarifyMissingInformation: vi.fn().mockResolvedValue("clarify"),
      enhanceRecommendationSummary: vi.fn().mockResolvedValue("summary"),
      enhanceItineraryDay: vi
        .fn()
        .mockImplementation(async ({ destinationName, content }) => `${destinationName}: ${content}`),
    };

    const state = await generateItineraryNode(
      {
        ...createInitialTravelAgentState("thread-1"),
        phase: "generating_itinerary",
        preferences: {
          originRegion: "Shanghai",
          tripLengthDays: 2,
          budgetMin: 8000,
          budgetMax: 18000,
          additionalRequirements: "Need quiet tea-house neighborhoods.",
          interests: ["food", "culture"],
          climate: "mild",
          pace: "balanced",
          travelMonth: "October",
          partyType: "couple",
        },
        selectedDestination: {
          destinationId: "kyoto-japan",
          name: "Kyoto",
          country: "Japan",
        },
      },
      adapter,
    );

    expect(state.phase).toBe("completed");
    expect(state.itinerary?.days).toHaveLength(2);
    expect(state.itinerary?.days[0].morning).toContain("Kyoto:");
    expect(adapter.enhanceItineraryDay).toHaveBeenCalledWith(
      expect.objectContaining({
        additionalRequirements: "Need quiet tea-house neighborhoods.",
      }),
    );
  });
});
