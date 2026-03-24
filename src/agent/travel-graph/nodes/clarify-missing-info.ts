import type { TravelAgentState } from "@/agent/travel-graph/state";
import type { TravelModelAdapter } from "@/server/llm/travel-model";

function buildKnownContext(state: TravelAgentState) {
  if (!state.preferences) {
    return "No structured travel preferences have been recorded yet.";
  }

  const noteContext = state.preferences.additionalRequirements
    ? ` Additional requirements: ${state.preferences.additionalRequirements}.`
    : "";

  return `Current preferences: origin ${state.preferences.originRegion || "unknown"}, budget CNY ${state.preferences.budgetMin}-${state.preferences.budgetMax}, scope ${state.preferences.destinationScope}, climate ${state.preferences.climate}, pace ${state.preferences.pace}.${noteContext}`;
}

export async function clarifyMissingInfo(
  state: TravelAgentState,
  llmAdapter: TravelModelAdapter,
): Promise<TravelAgentState> {
  if (!state.missingFields || state.missingFields.length === 0) {
    return state;
  }

  const clarification = await llmAdapter.clarifyMissingInformation({
    missingFields: state.missingFields,
    knownContext: buildKnownContext(state),
  });

  return {
    ...state,
    messages: [
      ...state.messages,
      {
        role: "assistant",
        content: clarification,
      },
    ],
    phase: "clarifying_preferences",
  };
}
