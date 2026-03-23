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
      expect(result.data.threadId).toBeTruthy();
      expect(result.data.phase).toBe("awaiting_confirmation");
      expect(result.data.recommendations.length).toBeGreaterThan(0);
    }
  });

  it("returns confirmed destination data from a recommendation list", async () => {
    const recommendationsResult = await recommendDestinationsAction(validPreferences);

    expect(recommendationsResult.ok).toBe(true);
    if (!recommendationsResult.ok) {
      return;
    }

    const confirmed = await confirmDestinationAction({
      threadId: recommendationsResult.data.threadId,
      destinationId: recommendationsResult.data.recommendations[0].id,
    });

    expect(confirmed.ok).toBe(true);
    if (confirmed.ok) {
      expect(confirmed.data.threadId).toBe(recommendationsResult.data.threadId);
      expect(confirmed.data.phase).toBe("generating_itinerary");
      expect(confirmed.data.destination.destinationId).toBe(
        recommendationsResult.data.recommendations[0].id,
      );
    }
  });

  it("returns structured itinerary data for valid input", async () => {
    const started = await recommendDestinationsAction({
      ...validPreferences,
      tripLengthDays: 4,
    });

    expect(started.ok).toBe(true);
    if (!started.ok) {
      return;
    }

    const confirmed = await confirmDestinationAction({
      threadId: started.data.threadId,
      destinationId: started.data.recommendations[0].id,
    });

    expect(confirmed.ok).toBe(true);
    if (!confirmed.ok) {
      return;
    }

    const result = await generateItineraryAction({
      threadId: confirmed.data.threadId,
      destination: confirmed.data.destination,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.phase).toBe("completed");
      expect(result.data.itinerary.days).toHaveLength(4);
    }
  });

  it("returns clarification output for incomplete input", async () => {
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

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.phase).toBe("clarifying_preferences");
      expect(result.data.message).toContain("originRegion");
    }
  });

  it("rejects destination confirmation that does not belong to authoritative recommendations", async () => {
    const started = await recommendDestinationsAction(validPreferences);

    expect(started.ok).toBe(true);
    if (!started.ok) {
      return;
    }

    const confirmed = await confirmDestinationAction({
      threadId: started.data.threadId,
      destinationId: "fake-destination",
    });

    expect(confirmed.ok).toBe(false);
    if (!confirmed.ok) {
      expect(confirmed.error).toContain("Please choose one of the recommended destinations");
    }
  });

  it("rejects malformed destination payloads before itinerary generation", async () => {
    const started = await recommendDestinationsAction(validPreferences);

    expect(started.ok).toBe(true);
    if (!started.ok) {
      return;
    }

    const result = await generateItineraryAction({
      threadId: started.data.threadId,
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

  it("rejects itinerary generation when the provided destination mismatches the active thread", async () => {
    const started = await recommendDestinationsAction(validPreferences);

    expect(started.ok).toBe(true);
    if (!started.ok) {
      return;
    }

    const confirmed = await confirmDestinationAction({
      threadId: started.data.threadId,
      destinationId: started.data.recommendations[0].id,
    });

    expect(confirmed.ok).toBe(true);
    if (!confirmed.ok) {
      return;
    }

    const result = await generateItineraryAction({
      threadId: confirmed.data.threadId,
      destination: {
        destinationId: "lisbon-portugal",
        name: "Lisbon",
        country: "Portugal",
      },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("does not match");
    }
  });
});
