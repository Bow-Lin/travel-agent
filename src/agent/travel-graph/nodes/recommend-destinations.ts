import type { TravelAgentState } from "@/agent/travel-graph/state";
import { rankDestinations } from "@/server/recommendations/recommend-destinations";
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

  const baseRecommendations = rankDestinations(preferences);
  const travelerContext = `The traveler prefers ${preferences.interests.join(", ")} in ${preferences.travelMonth} with a budget range of CNY ${preferences.budgetMin}-${preferences.budgetMax} and wants a ${preferences.destinationScope} destination.`;

  const searchQuery = [
    preferences.destinationScope,
    preferences.travelMonth,
    preferences.interests.join(" "),
    preferences.additionalRequirements,
  ]
    .filter((value) => value.length > 0)
    .join(" ");
  const searchResults = await searchTravelResearch(searchQuery);
  const searchCandidates = synthesizeSearchCandidates(
    baseRecommendations.map((recommendation) => ({
      id: recommendation.id,
      name: recommendation.name,
      country: recommendation.country,
      summary: recommendation.summary,
      budgetBand: recommendation.budgetBand,
      climate: [],
      interests: [],
      bestMonths: recommendation.bestMonths,
      tripStyles: [],
    })),
    searchResults,
  );
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
    const leftBoost = searchCandidates.candidateScores.get(left.id) ?? 0;
    const rightBoost = searchCandidates.candidateScores.get(right.id) ?? 0;

    if (leftBoost !== rightBoost) {
      return rightBoost - leftBoost;
    }

    return right.score - left.score;
  });

  const shortlistedRecommendations = recommendations.slice(0, 4);

  return {
    ...state,
    phase: "awaiting_confirmation",
    recommendations: shortlistedRecommendations,
    lastError: undefined,
  };
}
