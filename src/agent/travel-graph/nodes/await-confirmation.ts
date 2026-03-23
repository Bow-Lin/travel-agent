import type { TravelAgentState } from "@/agent/travel-graph/state";

export function awaitConfirmation(state: TravelAgentState): TravelAgentState {
  return {
    ...state,
    phase: "awaiting_confirmation",
    lastError: undefined,
  };
}
