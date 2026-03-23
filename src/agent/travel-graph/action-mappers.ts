import type { TravelAgentState } from "@/agent/travel-graph/state";
import type {
  ConfirmationStepData,
  ItineraryStepData,
  RecommendationStepData,
} from "@/lib/types";

export function mapStateToRecommendationStep(state: TravelAgentState): RecommendationStepData {
  return {
    threadId: state.threadId,
    phase: state.phase,
    recommendations: state.recommendations ?? [],
    message: state.messages.at(-1)?.content,
  };
}

export function mapStateToConfirmationStep(state: TravelAgentState): ConfirmationStepData {
  if (!state.selectedDestination) {
    throw new Error("Confirmed destination is missing from travel graph state.");
  }

  return {
    threadId: state.threadId,
    phase: state.phase,
    destination: state.selectedDestination,
    message: state.messages.at(-1)?.content,
  };
}

export function mapStateToItineraryStep(state: TravelAgentState): ItineraryStepData {
  if (!state.itinerary) {
    throw new Error("Itinerary is missing from travel graph state.");
  }

  return {
    threadId: state.threadId,
    phase: state.phase,
    itinerary: state.itinerary,
    message: state.messages.at(-1)?.content,
  };
}
