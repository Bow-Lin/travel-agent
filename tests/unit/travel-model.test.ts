import { beforeEach, describe, expect, it, vi } from "vitest";

import { createTravelModel, type TravelModel } from "@/server/llm/travel-model";

describe("createTravelModel", () => {
  beforeEach(() => {
    delete process.env.IFLOW_API_KEY;
    delete process.env.IFLOW_BASE_URL;
    delete process.env.IFLOW_MODEL;
  });

  it("exposes a stable text enhancement interface", async () => {
    const model = createTravelModel();

    const result = await model.enhanceRecommendationSummary({
      destinationName: "Kyoto",
      summary: "A calm cultural city.",
      additionalRequirements: "Need quiet tea-house neighborhoods.",
    });

    expect(result).toContain("Kyoto");
    expect(result).toContain("quiet tea-house neighborhoods");
  });

  it("can be mocked in tests through the shared interface", async () => {
    const mockModel: TravelModel = {
      clarifyMissingInformation: vi.fn().mockResolvedValue("clarify"),
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
