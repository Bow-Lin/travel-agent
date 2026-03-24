import type { TravelAgentState } from "@/agent/travel-graph/state";
import { runRecommendationTool } from "@/agent/travel-graph/tools/recommendation-tool";
import type { TravelModelAdapter } from "@/server/llm/travel-model";

export async function recommendDestinationsNode(
  state: TravelAgentState,
  llmAdapter: TravelModelAdapter,
): Promise<TravelAgentState> {
  if (!state.preferences) {
    return {
      ...state,
      phase: "error",
      lastError: "Travel preferences are required before recommendations can be generated.",
    };
  }

  const preferences = state.preferences;

  const baseRecommendations = runRecommendationTool(preferences);
  const travelerContext = [
    `The traveler prefers ${preferences.interests.join(", ")} in ${preferences.travelMonth} with a budget range of CNY ${preferences.budgetMin}-${preferences.budgetMax}.`,
    preferences.additionalRequirements
      ? `Additional requirements to honor: ${preferences.additionalRequirements}.`
      : null,
  ]
    .filter((value) => value !== null)
    .join(" ");

  const recommendations = await Promise.all(
    baseRecommendations.map(async (recommendation) => ({
      ...recommendation,
      matchReasons: [
        await llmAdapter.enhanceRecommendationSummary({
          destinationName: recommendation.name,
          summary: recommendation.summary,
          travelerContext,
          additionalRequirements: preferences.additionalRequirements,
        }),
      ],
    })),
  );

  return {
    ...state,
    phase: "awaiting_confirmation",
    recommendations,
    lastError: undefined,
  };
}
