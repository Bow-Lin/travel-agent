import { describe, expect, it } from "vitest";

import { applyConfirmation } from "@/agent/travel-graph/nodes/apply-confirmation";
import { awaitConfirmation } from "@/agent/travel-graph/nodes/await-confirmation";
import { createInitialTravelAgentState } from "@/agent/travel-graph/state";

describe("confirmation flow nodes", () => {
  it("marks the state as awaiting confirmation", () => {
    const state = awaitConfirmation({
      ...createInitialTravelAgentState("thread-1"),
      phase: "recommendation_ready",
      recommendations: [
        {
          id: "kyoto-japan",
          name: "Kyoto",
          country: "Japan",
          summary: "Temples and food.",
          matchReasons: ["Strong culture fit"],
          budgetBand: "medium",
          bestMonths: ["October"],
          score: 95,
        },
      ],
    });

    expect(state.phase).toBe("awaiting_confirmation");
  });

  it("applies a valid destination id and moves the graph forward", () => {
    const state = applyConfirmation(
      {
        ...createInitialTravelAgentState("thread-1"),
        phase: "awaiting_confirmation",
        recommendations: [
          {
            id: "kyoto-japan",
            name: "Kyoto",
            country: "Japan",
            summary: "Temples and food.",
            matchReasons: ["Strong culture fit"],
            budgetBand: "medium",
            bestMonths: ["October"],
            score: 95,
          },
        ],
      },
      "kyoto-japan",
    );

    expect(state.phase).toBe("generating_itinerary");
    expect(state.selectedDestination).toEqual({
      destinationId: "kyoto-japan",
      name: "Kyoto",
      country: "Japan",
    });
  });

  it("returns a safe error for invalid destination ids", () => {
    const state = applyConfirmation(
      {
        ...createInitialTravelAgentState("thread-1"),
        phase: "awaiting_confirmation",
        recommendations: [],
      },
      "missing-id",
    );

    expect(state.phase).toBe("error");
    expect(state.lastError).toContain("recommended destination");
  });
});
