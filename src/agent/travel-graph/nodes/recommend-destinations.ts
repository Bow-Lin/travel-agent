import type { TravelAgentState } from "@/agent/travel-graph/state";
import { runRecommendationTool } from "@/agent/travel-graph/tools/recommendation-tool";
import { destinationCatalog } from "@/server/recommendations/destination-catalog";
import { synthesizeSearchCandidates } from "@/server/recommendations/synthesize-search-candidates";
import { searchTravelResearch } from "@/server/search/tavily";
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
    `The traveler prefers ${preferences.interests.join(", ")} in ${preferences.travelMonth} with a budget range of CNY ${preferences.budgetMin}-${preferences.budgetMax} and wants a ${preferences.destinationScope} destination.`,
    preferences.additionalRequirements
      ? `Additional requirements to honor: ${preferences.additionalRequirements}.`
      : null,
  ]
    .filter((value) => value !== null)
    .join(" ");

  const searchQuery = [
    preferences.destinationScope,
    preferences.travelMonth,
    preferences.interests.join(" "),
    preferences.additionalRequirements,
  ]
    .filter((value) => value.length > 0)
    .join(" ");
  const searchResults = await searchTravelResearch(searchQuery);
  const searchCandidates = synthesizeSearchCandidates(destinationCatalog, searchResults);
  const searchMatchedIds = new Set(searchCandidates.candidateIds);

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
        ...(searchMatchedIds.has(recommendation.id)
          ? [
              `Web research also surfaced ${recommendation.name} as a relevant match${searchCandidates.highlights.get(recommendation.id) ? `: ${searchCandidates.highlights.get(recommendation.id)}` : "."}`,
            ]
          : []),
      ],
    })),
  );

  recommendations.sort((left, right) => {
    const leftBoost = searchMatchedIds.has(left.id) ? 1 : 0;
    const rightBoost = searchMatchedIds.has(right.id) ? 1 : 0;

    if (leftBoost !== rightBoost) {
      return rightBoost - leftBoost;
    }

    return right.score - left.score;
  });

  return {
    ...state,
    phase: "awaiting_confirmation",
    recommendations,
    lastError: undefined,
  };
}
