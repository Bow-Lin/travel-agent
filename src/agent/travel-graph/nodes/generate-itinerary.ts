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

  const baseItinerary = runItineraryTool({
    preferences: state.preferences,
    destination: state.selectedDestination,
  });

  const days = await Promise.all(
    baseItinerary.days.map(async (day) => ({
      ...day,
      morning: await llmAdapter.enhanceItineraryDay({
        destinationName: state.selectedDestination!.name,
        dayTheme: day.theme,
        content: day.morning,
      }),
      afternoon: await llmAdapter.enhanceItineraryDay({
        destinationName: state.selectedDestination!.name,
        dayTheme: day.theme,
        content: day.afternoon,
      }),
      evening: await llmAdapter.enhanceItineraryDay({
        destinationName: state.selectedDestination!.name,
        dayTheme: day.theme,
        content: day.evening,
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
