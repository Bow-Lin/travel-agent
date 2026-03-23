import type { TravelAgentState } from "@/agent/travel-graph/types";

export type { TravelAgentMessage, TravelAgentPhase, TravelAgentState } from "@/agent/travel-graph/types";

export function createInitialTravelAgentState(threadId: string): TravelAgentState {
  return {
    threadId,
    phase: "collecting_preferences",
    messages: [],
  };
}
