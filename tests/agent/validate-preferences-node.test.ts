import { describe, expect, it } from "vitest";

import { createInitialTravelAgentState } from "@/agent/travel-graph/state";
import { ingestPreferences } from "@/agent/travel-graph/nodes/ingest-preferences";
import { validatePreferences } from "@/agent/travel-graph/nodes/validate-preferences";
import type { PreferenceInput } from "@/lib/types";

const validPreferences: PreferenceInput = {
  originRegion: "Shanghai",
  tripLengthDays: 6,
  budgetLevel: "medium",
  interests: ["food", "culture"],
  climate: "mild",
  pace: "balanced",
  travelMonth: "October",
  partyType: "couple",
};

describe("validatePreferences node", () => {
  it("accepts valid structured preferences", () => {
    const ingested = ingestPreferences(createInitialTravelAgentState("thread-1"), validPreferences);
    const state = validatePreferences(ingested);

    expect(state.phase).toBe("recommendation_ready");
    expect(state.preferences).toEqual(validPreferences);
    expect(state.missingFields).toEqual([]);
  });

  it("records normalized missing fields when values are empty", () => {
    const ingested = ingestPreferences(createInitialTravelAgentState("thread-1"), {
      ...validPreferences,
      originRegion: "",
      interests: [],
      travelMonth: "",
    });
    const state = validatePreferences(ingested);

    expect(state.phase).toBe("clarifying_preferences");
    expect(state.missingFields).toEqual([
      "originRegion",
      "interests",
      "travelMonth",
    ]);
  });

  it("moves invalid numeric values into clarification state", () => {
    const ingested = ingestPreferences(createInitialTravelAgentState("thread-1"), {
      ...validPreferences,
      tripLengthDays: 0,
    });
    const state = validatePreferences(ingested);

    expect(state.phase).toBe("clarifying_preferences");
    expect(state.missingFields).toContain("tripLengthDays");
  });
});
