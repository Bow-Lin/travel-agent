import type { ConfirmedDestination, GeneratedItinerary, PreferenceInput } from "@/lib/types";

type GenerateItineraryInput = {
  preferences: PreferenceInput;
  destination: ConfirmedDestination;
};

function themeForDay(interests: PreferenceInput["interests"], dayIndex: number) {
  return interests[dayIndex % interests.length] ?? "culture";
}

function eveningPlan(pace: PreferenceInput["pace"], destination: ConfirmedDestination, theme: string) {
  if (pace === "packed") {
    return `A late-night ${theme} stop and one last neighborhood walk in ${destination.name}.`;
  }

  if (pace === "relaxed") {
    return `A slow evening with a scenic dinner and an early rest in ${destination.name}.`;
  }

  return `A balanced evening with dinner, a short stroll, and time to recharge in ${destination.name}.`;
}

export function generateItinerary({
  preferences,
  destination,
}: GenerateItineraryInput): GeneratedItinerary {
  const days = Array.from({ length: preferences.tripLengthDays }, (_, dayIndex) => {
    const theme = themeForDay(preferences.interests, dayIndex);
    const formattedTheme = `${theme[0].toUpperCase()}${theme.slice(1)} discoveries`;

    return {
      day: dayIndex + 1,
      theme: formattedTheme,
      morning: `Start day ${dayIndex + 1} with a ${theme}-focused morning in ${destination.name}.`,
      afternoon: `Spend the afternoon exploring ${destination.name}'s best ${theme} spots at a ${preferences.pace} pace.`,
      evening: eveningPlan(preferences.pace, destination, theme),
    };
  });

  return {
    destination,
    days,
  };
}
