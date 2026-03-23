import { describe, expect, it } from "vitest";

import { DEFAULT_INTERESTS } from "@/lib/constants";
import { preferenceInputSchema } from "@/lib/validation";

describe("preferenceInputSchema", () => {
  it("accepts a valid travel preference payload", () => {
    const result = preferenceInputSchema.safeParse({
      originRegion: "Shanghai",
      tripLengthDays: 6,
      budgetLevel: "medium",
      interests: [DEFAULT_INTERESTS[0], DEFAULT_INTERESTS[2]],
      climate: "mild",
      pace: "balanced",
      travelMonth: "October",
      partyType: "couple",
    });

    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const result = preferenceInputSchema.safeParse({
      tripLengthDays: 4,
      budgetLevel: "medium",
      interests: [DEFAULT_INTERESTS[0]],
      climate: "warm",
      pace: "relaxed",
      travelMonth: "May",
      partyType: "solo",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.originRegion).toContain(
        "Please choose your departure region.",
      );
    }
  });

  it("rejects trip lengths outside the supported range", () => {
    const result = preferenceInputSchema.safeParse({
      originRegion: "Beijing",
      tripLengthDays: 0,
      budgetLevel: "low",
      interests: [DEFAULT_INTERESTS[1]],
      climate: "cold",
      pace: "packed",
      travelMonth: "January",
      partyType: "friends",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.tripLengthDays).toContain(
        "Trip length must be between 1 and 21 days.",
      );
    }
  });
});
