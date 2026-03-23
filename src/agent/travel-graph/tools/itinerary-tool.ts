import type { ConfirmedDestination, GeneratedItinerary, PreferenceInput } from "@/lib/types";
import { generateItinerary } from "@/server/itinerary/generate-itinerary";

export function runItineraryTool(input: {
  preferences: PreferenceInput;
  destination: ConfirmedDestination;
}): GeneratedItinerary {
  return generateItinerary(input);
}
