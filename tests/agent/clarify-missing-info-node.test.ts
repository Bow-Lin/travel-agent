import { describe, expect, it, vi } from "vitest";

import { clarifyMissingInfo } from "@/agent/travel-graph/nodes/clarify-missing-info";
import { createInitialTravelAgentState } from "@/agent/travel-graph/state";
import type { TravelModelAdapter } from "@/server/llm/travel-model";

describe("clarifyMissingInfo node", () => {
  it("writes an assistant clarification message when fields are missing", async () => {
    const adapter: TravelModelAdapter = {
      clarifyMissingInformation: vi.fn().mockResolvedValue("Please tell me your travel month and interests."),
      enhanceRecommendationSummary: vi.fn().mockResolvedValue("summary"),
      enhanceItineraryDay: vi.fn().mockResolvedValue("itinerary"),
    };

    const state = await clarifyMissingInfo(
      {
        ...createInitialTravelAgentState("thread-1"),
        phase: "clarifying_preferences",
        missingFields: ["travelMonth", "interests"],
      },
      adapter,
    );

    expect(state.messages.at(-1)).toEqual({
      role: "assistant",
      content: "Please tell me your travel month and interests.",
    });
  });

  it("does nothing when there are no missing fields", async () => {
    const adapter: TravelModelAdapter = {
      clarifyMissingInformation: vi.fn().mockResolvedValue("unused"),
      enhanceRecommendationSummary: vi.fn().mockResolvedValue("summary"),
      enhanceItineraryDay: vi.fn().mockResolvedValue("itinerary"),
    };

    const initial = createInitialTravelAgentState("thread-1");
    const state = await clarifyMissingInfo(initial, adapter);

    expect(state).toEqual(initial);
    expect(adapter.clarifyMissingInformation).not.toHaveBeenCalled();
  });
});
