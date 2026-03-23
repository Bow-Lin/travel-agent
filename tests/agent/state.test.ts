import { describe, expect, it } from "vitest";

import { createInitialTravelAgentState, type TravelAgentPhase } from "@/agent/travel-graph/state";

describe("travel graph state", () => {
  it("creates a state object with a thread id and initial phase", () => {
    const state = createInitialTravelAgentState("thread-1");

    expect(state.threadId).toBe("thread-1");
    expect(state.phase).toBe("collecting_preferences" satisfies TravelAgentPhase);
    expect(state.messages).toEqual([]);
  });
});
