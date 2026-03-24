import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("searchTravelResearch", () => {
  const originalEnv = { ...process.env };
  const fetchMock = vi.fn();

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.TAVILY_API_KEY;
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.unstubAllGlobals();
  });

  it("returns no results when Tavily is not configured", async () => {
    const { searchTravelResearch } = await import("@/server/search/tavily");

    await expect(searchTravelResearch("kyoto tea houses")).resolves.toEqual([]);
  });

  it("calls Tavily and returns normalized results", async () => {
    process.env.TAVILY_API_KEY = "tavily-test";
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            title: "Kyoto tea house guide",
            url: "https://example.com/kyoto",
            content: "Kyoto is well known for tea-house neighborhoods and calm cultural travel.",
          },
        ],
      }),
    });

    const { searchTravelResearch } = await import("@/server/search/tavily");
    const results = await searchTravelResearch("kyoto tea houses");

    expect(fetchMock).toHaveBeenCalled();
    expect(results).toEqual([
      {
        title: "Kyoto tea house guide",
        url: "https://example.com/kyoto",
        content: "Kyoto is well known for tea-house neighborhoods and calm cultural travel.",
      },
    ]);
  });

  it("falls back to an empty list when fetch throws", async () => {
    process.env.TAVILY_API_KEY = "tavily-test";
    fetchMock.mockRejectedValue(new Error("network failed"));

    const { searchTravelResearch } = await import("@/server/search/tavily");

    await expect(searchTravelResearch("kyoto tea houses")).resolves.toEqual([]);
  });
});
