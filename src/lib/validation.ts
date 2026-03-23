import { z } from "zod";

import {
  BUDGET_LEVELS,
  CLIMATE_PREFERENCES,
  DEFAULT_INTERESTS,
  MAX_TRIP_LENGTH_DAYS,
  MIN_TRIP_LENGTH_DAYS,
  PARTY_TYPES,
  TRAVEL_PACES,
} from "@/lib/constants";

export const preferenceInputSchema = z.object({
  originRegion: z
    .string({ error: "Please choose your departure region." })
    .trim()
    .min(1, "Please choose your departure region."),
  tripLengthDays: z
    .number({ error: "Trip length must be between 1 and 21 days." })
    .int("Trip length must be between 1 and 21 days.")
    .min(MIN_TRIP_LENGTH_DAYS, "Trip length must be between 1 and 21 days.")
    .max(MAX_TRIP_LENGTH_DAYS, "Trip length must be between 1 and 21 days."),
  budgetLevel: z.enum(BUDGET_LEVELS),
  interests: z
    .array(z.enum(DEFAULT_INTERESTS), { error: "Choose at least one travel interest." })
    .min(1, "Choose at least one travel interest."),
  climate: z.enum(CLIMATE_PREFERENCES),
  pace: z.enum(TRAVEL_PACES),
  travelMonth: z
    .string({ error: "Please choose an approximate travel month." })
    .trim()
    .min(1, "Please choose an approximate travel month."),
  partyType: z.enum(PARTY_TYPES),
});

export const confirmedDestinationSchema = z.object({
  destinationId: z
    .string({ error: "Please confirm a recommended destination first." })
    .trim()
    .min(1, "Please confirm a recommended destination first."),
  name: z
    .string({ error: "Destination name is required." })
    .trim()
    .min(1, "Destination name is required."),
  country: z
    .string({ error: "Destination country is required." })
    .trim()
    .min(1, "Destination country is required."),
});

export type PreferenceInputSchema = z.infer<typeof preferenceInputSchema>;
export type ConfirmedDestinationSchema = z.infer<typeof confirmedDestinationSchema>;
