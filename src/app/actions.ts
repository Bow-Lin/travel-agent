"use server";

import type {
  ConfirmedDestination,
  DestinationRecommendation,
  GeneratedItinerary,
  PreferenceInput,
} from "@/lib/types";
import { confirmedDestinationSchema, preferenceInputSchema } from "@/lib/validation";
import { generateItinerary } from "@/server/itinerary/generate-itinerary";
import { recommendDestinations } from "@/server/recommendations/recommend-destinations";
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
): Promise<ActionResult<DestinationRecommendation[]>> {
  const parsed = preferenceInputSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const message = Object.values(fieldErrors).flat()[0] ?? "Invalid travel preferences.";

    return {
      ok: false,
      error: message,
    };
  }

  try {
    return {
      ok: true,
      data: recommendDestinations(parsed.data),
    };
  } catch (error) {
    return {
      ok: false,
      error: normalizeActionError(error),
    };
  }
}

export async function confirmDestinationAction(
  destinationId: string,
  preferences: PreferenceInput,
): Promise<ActionResult<ConfirmedDestination>> {
  const parsed = preferenceInputSchema.safeParse(preferences);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const message = Object.values(fieldErrors).flat()[0] ?? "Invalid travel preferences.";

    return {
      ok: false,
      error: message,
    };
  }

  const recommendations = recommendDestinations(parsed.data);
  const selected = recommendations.find((recommendation) => recommendation.id === destinationId);

  if (!selected) {
    return {
      ok: false,
      error: "Please choose one of the recommended destinations.",
    };
  }

  return {
    ok: true,
    data: {
      destinationId: selected.id,
      name: selected.name,
      country: selected.country,
    },
  };
}

export async function generateItineraryAction(input: {
  preferences: PreferenceInput;
  destination: ConfirmedDestination;
}): Promise<ActionResult<GeneratedItinerary>> {
  const parsedPreferences = preferenceInputSchema.safeParse(input.preferences);

  if (!parsedPreferences.success) {
    const fieldErrors = parsedPreferences.error.flatten().fieldErrors;
    const message = Object.values(fieldErrors).flat()[0] ?? "Invalid travel preferences.";

    return {
      ok: false,
      error: message,
    };
  }

  const parsedDestination = confirmedDestinationSchema.safeParse(input.destination);

  if (!parsedDestination.success) {
    const fieldErrors = parsedDestination.error.flatten().fieldErrors;
    const message = Object.values(fieldErrors).flat()[0] ?? "Please confirm a recommended destination first.";

    return {
      ok: false,
      error: message,
    };
  }

  try {
    return {
      ok: true,
      data: generateItinerary({
        preferences: parsedPreferences.data,
        destination: parsedDestination.data,
      }),
    };
  } catch (error) {
    return {
      ok: false,
      error: normalizeActionError(error),
    };
  }
}
