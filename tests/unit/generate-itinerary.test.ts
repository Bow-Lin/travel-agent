import { describe, expect, it } from "vitest";

import type { ConfirmedDestination, PreferenceInput } from "@/lib/types";
import { generateItinerary } from "@/server/itinerary/generate-itinerary";

const preferences: PreferenceInput = {
  originRegion: "Shanghai",
  tripLengthDays: 4,
  budgetMin: 8000,
  budgetMax: 18000,
  destinationScope: "overseas",
  additionalRequirements: "",
  interests: ["food", "culture"],
  climate: "mild",
  pace: "relaxed",
  travelMonth: "October",
  partyType: "couple",
};

const destination: ConfirmedDestination = {
  destinationId: "kyoto-japan",
  name: "Kyoto",
  country: "Japan",
};

describe("generateItinerary", () => {
  it("creates one itinerary day per requested trip day", () => {
    const itinerary = generateItinerary({ preferences, destination });

    expect(itinerary.days).toHaveLength(preferences.tripLengthDays);
  });

  it("keeps the chosen destination in the itinerary payload", () => {
    const itinerary = generateItinerary({ preferences, destination });

    expect(itinerary.destination).toEqual(destination);
  });

  it("changes activity density when the travel pace changes", () => {
    const relaxed = generateItinerary({ preferences, destination });
    const packed = generateItinerary({
      preferences: {
        ...preferences,
        pace: "packed",
      },
      destination,
    });

    expect(relaxed.days[0].evening).toContain("slow");
    expect(packed.days[0].evening).toContain("late-night");
  });

  it("uses interests to shape day themes", () => {
    const itinerary = generateItinerary({ preferences, destination });

    expect(itinerary.days[0].theme.toLowerCase()).toContain("food");
    expect(itinerary.days[1].theme.toLowerCase()).toContain("culture");
  });
});
