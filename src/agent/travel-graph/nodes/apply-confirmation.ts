import type { TravelAgentState } from "@/agent/travel-graph/state";

export function applyConfirmation(
  state: TravelAgentState,
  destinationId: string,
): TravelAgentState {
  const selected = state.recommendations?.find((recommendation) => recommendation.id === destinationId);

  if (!selected) {
    return {
      ...state,
      phase: "error",
      lastError: "Please choose one of the recommended destinations before continuing.",
    };
  }

  return {
    ...state,
    phase: "generating_itinerary",
    selectedDestination: {
      destinationId: selected.id,
      name: selected.name,
      country: selected.country,
    },
    lastError: undefined,
  };
}
