export function recommendationPrompt(destinationName: string, summary: string) {
  return `Polish this recommendation for ${destinationName}: ${summary}`;
}

export function itineraryPrompt(destinationName: string, dayTheme: string) {
  return `Polish this itinerary moment for ${destinationName} with focus on ${dayTheme}.`;
}
