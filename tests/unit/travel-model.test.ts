import { describe, expect, it, vi } from "vitest";

import { createTravelModel, type TravelModel } from "@/server/llm/travel-model";

describe("createTravelModel", () => {
  it("exposes a stable text enhancement interface", async () => {
    const model = createTravelModel();

    const result = await model.enhanceRecommendationSummary({
      destinationName: "Kyoto",
      summary: "A calm cultural city.",
    });

    expect(result).toContain("Kyoto");
  });

  it("can be mocked in tests through the shared interface", async () => {
    const mockModel: TravelModel = {
      enhanceRecommendationSummary: vi.fn().mockResolvedValue("mocked summary"),
      enhanceItineraryDay: vi.fn().mockResolvedValue("mocked day"),
    };

    await expect(
      mockModel.enhanceRecommendationSummary({
        destinationName: "Lisbon",
        summary: "Sunny city break",
      }),
    ).resolves.toBe("mocked summary");
  });

  it("keeps provider-specific details out of the public contract", () => {
    const model = createTravelModel();

    expect(model).not.toHaveProperty("baseURL");
    expect(model).not.toHaveProperty("modelName");
  });
});
