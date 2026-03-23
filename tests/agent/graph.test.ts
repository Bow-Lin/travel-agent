import { describe, expect, it } from "vitest";

import { createTravelGraph } from "@/agent/travel-graph/graph";
import { getTravelCheckpointer } from "@/agent/travel-graph/checkpointer";

describe("travel graph", () => {
  it("creates a graph instance", () => {
    const graph = createTravelGraph();

    expect(graph).toHaveProperty("start");
    expect(graph).toHaveProperty("confirm");
    expect(graph).toHaveProperty("generate");
  });

  it("can reach recommendation-ready flow from valid preferences", async () => {
    getTravelCheckpointer().clear();
    const graph = createTravelGraph();

    const state = await graph.start({
      originRegion: "Shanghai",
      tripLengthDays: 6,
      budgetMin: 8000,
      budgetMax: 18000,
      interests: ["food", "culture"],
      climate: "mild",
      pace: "balanced",
      travelMonth: "October",
      partyType: "couple",
    });

    expect(state.threadId).toBeTruthy();
    expect(state.phase).toBe("awaiting_confirmation");
    expect(state.recommendations?.length).toBeGreaterThan(0);
  });

  it("can resume interrupted runs with thread id", async () => {
    getTravelCheckpointer().clear();
    const graph = createTravelGraph();

    const started = await graph.start({
      originRegion: "Shanghai",
      tripLengthDays: 4,
      budgetMin: 8000,
      budgetMax: 18000,
      interests: ["food", "culture"],
      climate: "mild",
      pace: "balanced",
      travelMonth: "October",
      partyType: "couple",
    });
    const confirmed = await graph.confirm(started.threadId, started.recommendations![0].id);
    const completed = await graph.generate(confirmed.threadId);

    expect(completed.phase).toBe("completed");
    expect(completed.itinerary?.days).toHaveLength(4);
  });

  it("rejects out-of-order generate calls", async () => {
    getTravelCheckpointer().clear();
    const graph = createTravelGraph();

    const started = await graph.start({
      originRegion: "Shanghai",
      tripLengthDays: 4,
      budgetMin: 8000,
      budgetMax: 18000,
      interests: ["food", "culture"],
      climate: "mild",
      pace: "balanced",
      travelMonth: "October",
      partyType: "couple",
    });
    const generated = await graph.generate(started.threadId);

    expect(generated.phase).toBe("error");
    expect(generated.lastError).toContain("not ready to generate");
  });
});
