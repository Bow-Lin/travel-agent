import { StateGraph } from "@langchain/langgraph";

import { getTravelCheckpointer } from "@/agent/travel-graph/checkpointer";
import { applyConfirmation } from "@/agent/travel-graph/nodes/apply-confirmation";
import { awaitConfirmation } from "@/agent/travel-graph/nodes/await-confirmation";
import { clarifyMissingInfo } from "@/agent/travel-graph/nodes/clarify-missing-info";
import { generateItineraryNode } from "@/agent/travel-graph/nodes/generate-itinerary";
import { ingestPreferences } from "@/agent/travel-graph/nodes/ingest-preferences";
import { recommendDestinationsNode } from "@/agent/travel-graph/nodes/recommend-destinations";
import { validatePreferences } from "@/agent/travel-graph/nodes/validate-preferences";
import { createInitialTravelAgentState, type TravelAgentState } from "@/agent/travel-graph/state";
import type { PreferenceInput } from "@/lib/types";
import { createTravelModel } from "@/server/llm/travel-model";

type TravelGraphRuntime = {
  workflow: StateGraph<TravelAgentState>;
  start(preferences: PreferenceInput): Promise<TravelAgentState>;
  confirm(threadId: string, destinationId: string): Promise<TravelAgentState>;
  generate(threadId: string): Promise<TravelAgentState>;
  getState(threadId: string): TravelAgentState | undefined;
};

export function createTravelGraph(): TravelGraphRuntime {
  const workflow = new StateGraph<TravelAgentState>({
    channels: {
      threadId: null,
      phase: null,
      messages: null,
      preferences: null,
      missingFields: null,
      recommendations: null,
      selectedDestination: null,
      itinerary: null,
      lastError: null,
    },
  });

  const checkpointer = getTravelCheckpointer();
  const llmAdapter = createTravelModel();

  return {
    workflow,
    async start(preferences) {
      const threadId = crypto.randomUUID();
      const ingested = ingestPreferences(createInitialTravelAgentState(threadId), preferences);
      const validated = validatePreferences(ingested);
      const finalState =
        validated.phase === "clarifying_preferences"
          ? await clarifyMissingInfo(validated, llmAdapter)
          : await recommendDestinationsNode(validated, llmAdapter);

      checkpointer.set(finalState);
      return finalState;
    },
    async confirm(threadId, destinationId) {
      const state = checkpointer.get(threadId);

      if (!state) {
        return {
          ...createInitialTravelAgentState(threadId),
          phase: "error",
          lastError: "Travel agent session not found.",
        };
      }

      if (state.phase !== "awaiting_confirmation" && state.phase !== "recommendation_ready") {
        return {
          ...state,
          phase: "error",
          lastError: "The travel agent is not ready to confirm a destination right now.",
        };
      }

      const awaited = awaitConfirmation(state);
      const confirmed = applyConfirmation(awaited, destinationId);
      checkpointer.set(confirmed);
      return confirmed;
    },
    async generate(threadId) {
      const state = checkpointer.get(threadId);

      if (!state) {
        return {
          ...createInitialTravelAgentState(threadId),
          phase: "error",
          lastError: "Travel agent session not found.",
        };
      }

      if (state.phase !== "generating_itinerary") {
        return {
          ...state,
          phase: "error",
          lastError: "The travel agent is not ready to generate an itinerary right now.",
        };
      }

      const completed = await generateItineraryNode(state, llmAdapter);
      checkpointer.set(completed);
      return completed;
    },
    getState(threadId) {
      return checkpointer.get(threadId);
    },
  };
}

export { createInitialTravelAgentState };
