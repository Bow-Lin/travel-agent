export function clarificationPrompt(missingFields: string[], knownContext: string) {
  return `Ask the traveler for the missing fields ${missingFields.join(", ")} using this known context: ${knownContext}`;
}

export function recommendationPrompt(
  destinationName: string,
  summary: string,
  travelerContext: string,
) {
  return `Polish this recommendation for ${destinationName}: ${summary}. Traveler context: ${travelerContext}`;
}

export function itineraryPrompt(destinationName: string, dayTheme: string, content: string) {
  return `Polish this itinerary moment for ${destinationName} with focus on ${dayTheme}. Original content: ${content}`;
}
