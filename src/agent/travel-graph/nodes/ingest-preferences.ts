import type { PreferenceInput } from "@/lib/types";
import type { TravelAgentState } from "@/agent/travel-graph/state";

export function ingestPreferences(
  state: TravelAgentState,
  preferences: PreferenceInput,
): TravelAgentState {
  return {
    ...state,
    preferences,
    lastError: undefined,
  };
}
