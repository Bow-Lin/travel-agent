import { describe, expect, it, vi } from "vitest";

import { createTravelModel, type TravelModelAdapter } from "@/server/llm/travel-model";

describe("travel model adapter", () => {
  it("can summarize missing fields", async () => {
    const adapter = createTravelModel();

    await expect(
      adapter.clarifyMissingInformation({
        missingFields: ["travelMonth", "interests"],
        knownContext: "Budget is medium and the traveler leaves from Shanghai.",
      }),
    ).resolves.toContain("travelMonth");
  });

  it("can generate recommendation reasoning", async () => {
    const adapter = createTravelModel();

    await expect(
      adapter.enhanceRecommendationSummary({
        destinationName: "Kyoto",
        summary: "Temples and seasonal food.",
        travelerContext: "The traveler prefers culture and food in October.",
      }),
    ).resolves.toContain("Kyoto");
  });

  it("can polish itinerary text", async () => {
    const adapter = createTravelModel();

    await expect(
      adapter.enhanceItineraryDay({
        destinationName: "Kyoto",
        dayTheme: "Food discoveries",
        content: "Visit a morning market and finish with dinner.",
      }),
    ).resolves.toContain("Kyoto");
  });

  it("is mockable without provider-specific fields", async () => {
    const mockAdapter: TravelModelAdapter = {
      clarifyMissingInformation: vi.fn().mockResolvedValue("clarify"),
      enhanceRecommendationSummary: vi.fn().mockResolvedValue("summary"),
      enhanceItineraryDay: vi.fn().mockResolvedValue("itinerary"),
    };

    await expect(
      mockAdapter.clarifyMissingInformation({
        missingFields: ["travelMonth"],
        knownContext: "The traveler wants a warm trip.",
      }),
    ).resolves.toBe("clarify");

    expect(mockAdapter).not.toHaveProperty("modelName");
  });
});
