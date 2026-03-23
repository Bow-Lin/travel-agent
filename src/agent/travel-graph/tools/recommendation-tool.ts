import type { DestinationRecommendation, PreferenceInput } from "@/lib/types";
import { recommendDestinations } from "@/server/recommendations/recommend-destinations";

export function runRecommendationTool(preferences: PreferenceInput): DestinationRecommendation[] {
  return recommendDestinations(preferences);
}
