import type { DestinationRecommendation, PreferenceInput } from "@/lib/types";
import { destinationCatalog } from "@/server/recommendations/destination-catalog";
import { scoreDestination } from "@/server/recommendations/score-destination";

export function recommendDestinations(preferences: PreferenceInput): DestinationRecommendation[] {
  return destinationCatalog
    .map((destination) => scoreDestination(preferences, destination))
    .sort((left, right) => right.score - left.score)
    .slice(0, 4)
    .map(({ destination, score, reasons }) => ({
      id: destination.id,
      name: destination.name,
      country: destination.country,
      summary: destination.summary,
      matchReasons:
        reasons.length > 0
          ? reasons.slice(0, 3)
          : ["Balanced match for your timing, budget, and travel party."],
      budgetBand: destination.budgetBand,
      bestMonths: destination.bestMonths,
      score,
    }));
}
