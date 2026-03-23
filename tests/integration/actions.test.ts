import { describe, expect, it } from "vitest";

import {
  confirmDestinationAction,
  generateItineraryAction,
  recommendDestinationsAction,
} from "@/app/actions";
import type { PreferenceInput } from "@/lib/types";

describe("travel actions", () => {
  const validPreferences: PreferenceInput = {
    originRegion: "Shanghai",
    tripLengthDays: 6,
    budgetLevel: "medium",
    interests: ["food", "culture"],
    climate: "mild",
    pace: "balanced",
    travelMonth: "October",
    partyType: "couple",
  };

  it("returns recommendations for valid preference input", async () => {
    const result = await recommendDestinationsAction(validPreferences);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.length).toBeGreaterThan(0);
    }
  });

  it("returns confirmed destination data from a recommendation list", async () => {
    const recommendationsResult = await recommendDestinationsAction(validPreferences);

    expect(recommendationsResult.ok).toBe(true);
    if (!recommendationsResult.ok) {
      return;
    }

    const confirmed = await confirmDestinationAction(recommendationsResult.data[0].id, validPreferences);

    expect(confirmed.ok).toBe(true);
    if (confirmed.ok) {
      expect(confirmed.data.destinationId).toBe(recommendationsResult.data[0].id);
    }
  });

  it("returns structured itinerary data for valid input", async () => {
    const result = await generateItineraryAction({
      preferences: {
        ...validPreferences,
        tripLengthDays: 4,
      },
      destination: {
        destinationId: "kyoto-japan",
        name: "Kyoto",
        country: "Japan",
      },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.days).toHaveLength(4);
    }
  });

  it("returns safe errors for invalid input", async () => {
    const result = await recommendDestinationsAction({
      originRegion: "",
      tripLengthDays: 0,
      budgetLevel: "medium",
      interests: [],
      climate: "mild",
      pace: "balanced",
      travelMonth: "October",
      partyType: "couple",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("Please choose your departure region");
    }
  });

  it("rejects destination confirmation that does not belong to authoritative recommendations", async () => {
    const confirmed = await confirmDestinationAction("fake-destination", validPreferences);

    expect(confirmed.ok).toBe(false);
    if (!confirmed.ok) {
      expect(confirmed.error).toContain("Please choose one of the recommended destinations");
    }
  });

  it("rejects malformed destination payloads before itinerary generation", async () => {
    const result = await generateItineraryAction({
      preferences: validPreferences,
      destination: {
        destinationId: "",
        name: "",
        country: "",
      },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("Please confirm a recommended destination first");
    }
  });
});
