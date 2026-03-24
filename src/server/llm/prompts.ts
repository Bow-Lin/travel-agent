export function clarificationPrompt(missingFields: string[], knownContext: string) {
  return `Ask the traveler for the missing fields ${missingFields.join(", ")} using this known context: ${knownContext}`;
}

export function recommendationPrompt(
  destinationName: string,
  summary: string,
  travelerContext: string,
  additionalRequirements?: string,
) {
  return `Polish this recommendation for ${destinationName}: ${summary}. Traveler context: ${travelerContext}.${additionalRequirements ? ` Additional requirements to strictly honor: ${additionalRequirements}.` : ""}`;
}

export function itineraryPrompt(
  destinationName: string,
  dayTheme: string,
  content: string,
  additionalRequirements?: string,
) {
  return `Polish this itinerary moment for ${destinationName} with focus on ${dayTheme}. Original content: ${content}.${additionalRequirements ? ` Additional requirements to strictly honor: ${additionalRequirements}.` : ""}`;
}
