import type { TravelAgentState } from "@/agent/travel-graph/state";
import { runItineraryTool } from "@/agent/travel-graph/tools/itinerary-tool";
import type { TravelModelAdapter } from "@/server/llm/travel-model";

export async function generateItineraryNode(
  state: TravelAgentState,
  llmAdapter: TravelModelAdapter,
): Promise<TravelAgentState> {
  if (!state.preferences || !state.selectedDestination) {
    return {
      ...state,
      phase: "error",
      lastError: "Preferences and a confirmed destination are required before itinerary generation.",
    };
  }

  const preferences = state.preferences;
  const destination = state.selectedDestination;

  const baseItinerary = runItineraryTool({
    preferences,
    destination,
  });

  const days = await Promise.all(
    baseItinerary.days.map(async (day) => ({
      ...day,
      morning: await llmAdapter.enhanceItineraryDay({
        destinationName: destination.name,
        dayTheme: day.theme,
        content: day.morning,
        additionalRequirements: preferences.additionalRequirements,
      }),
      afternoon: await llmAdapter.enhanceItineraryDay({
        destinationName: destination.name,
        dayTheme: day.theme,
        content: day.afternoon,
        additionalRequirements: preferences.additionalRequirements,
      }),
      evening: await llmAdapter.enhanceItineraryDay({
        destinationName: destination.name,
        dayTheme: day.theme,
        content: day.evening,
        additionalRequirements: preferences.additionalRequirements,
      }),
    })),
  );

  return {
    ...state,
    phase: "completed",
    itinerary: {
      ...baseItinerary,
      days,
    },
    lastError: undefined,
  };
}
