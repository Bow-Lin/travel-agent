"use server";

import type {
  ConfirmedDestination,
  ConfirmationStepData,
  ItineraryStepData,
  PreferenceInput,
  RecommendationStepData,
} from "@/lib/types";
import { confirmedDestinationSchema } from "@/lib/validation";
import {
  mapStateToConfirmationStep,
  mapStateToItineraryStep,
  mapStateToRecommendationStep,
} from "@/agent/travel-graph/action-mappers";
import { createTravelGraph } from "@/agent/travel-graph/graph";
import { normalizeActionError } from "@/server/errors";

type ActionSuccess<T> = {
  ok: true;
  data: T;
};

type ActionFailure = {
  ok: false;
  error: string;
};

type ActionResult<T> = ActionSuccess<T> | ActionFailure;

export async function recommendDestinationsAction(
  input: PreferenceInput,
): Promise<ActionResult<RecommendationStepData>> {
  try {
    const graph = createTravelGraph();
    const state = await graph.start(input);

    return {
      ok: true,
      data: mapStateToRecommendationStep(state),
    };
  } catch (error) {
    return {
      ok: false,
      error: normalizeActionError(error),
    };
  }
}

export async function confirmDestinationAction(
  input: { threadId: string; destinationId: string },
): Promise<ActionResult<ConfirmationStepData>> {
  if (!input.threadId.trim()) {
    return {
      ok: false,
      error: "Travel agent thread id is required.",
    };
  }

  if (!input.destinationId.trim()) {
    return {
      ok: false,
      error: "Please choose one of the recommended destinations.",
    };
  }

  try {
    const graph = createTravelGraph();
    const state = await graph.confirm(input.threadId, input.destinationId);

    if (state.phase === "error") {
      return {
        ok: false,
        error: state.lastError ?? "Please choose one of the recommended destinations.",
      };
    }

    return {
      ok: true,
      data: mapStateToConfirmationStep(state),
    };
  } catch (error) {
    return {
      ok: false,
      error: normalizeActionError(error),
    };
  }
}

export async function generateItineraryAction(input: {
  threadId: string;
  destination?: ConfirmedDestination;
}): Promise<ActionResult<ItineraryStepData>> {
  if (!input.threadId.trim()) {
    return {
      ok: false,
      error: "Travel agent thread id is required.",
    };
  }

  if (input.destination) {
    const parsedDestination = confirmedDestinationSchema.safeParse(input.destination);

    if (!parsedDestination.success) {
      const fieldErrors = parsedDestination.error.flatten().fieldErrors;
      const message = Object.values(fieldErrors).flat()[0] ?? "Please confirm a recommended destination first.";

      return {
        ok: false,
        error: message,
      };
    }
  }

  try {
    const graph = createTravelGraph();
    const currentState = graph.getState(input.threadId);

    if (input.destination && currentState?.selectedDestination) {
      const selected = currentState.selectedDestination;
      const provided = input.destination;

      if (
        selected.destinationId !== provided.destinationId ||
        selected.name !== provided.name ||
        selected.country !== provided.country
      ) {
        return {
          ok: false,
          error: "The provided destination does not match the active travel agent thread.",
        };
      }
    }

    const state = await graph.generate(input.threadId);

    if (state.phase === "error") {
      return {
        ok: false,
        error: state.lastError ?? "Itinerary generation failed.",
      };
    }

    return {
      ok: true,
      data: mapStateToItineraryStep(state),
    };
  } catch (error) {
    return {
      ok: false,
      error: normalizeActionError(error),
    };
  }
}
