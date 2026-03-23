import { itineraryPrompt, recommendationPrompt } from "@/server/llm/prompts";

type RecommendationEnhancementInput = {
  destinationName: string;
  summary: string;
};

type ItineraryEnhancementInput = {
  destinationName: string;
  dayTheme: string;
  content: string;
};

export type TravelModel = {
  enhanceRecommendationSummary(input: RecommendationEnhancementInput): Promise<string>;
  enhanceItineraryDay(input: ItineraryEnhancementInput): Promise<string>;
};

export function createTravelModel(): TravelModel {
  return {
    async enhanceRecommendationSummary({ destinationName, summary }) {
      return `${recommendationPrompt(destinationName, summary)} ${destinationName} is a strong fit for this trip.`;
    },
    async enhanceItineraryDay({ destinationName, dayTheme, content }) {
      return `${itineraryPrompt(destinationName, dayTheme)} ${content}`;
    },
  };
}
