import type { TravelAgentState } from "@/agent/travel-graph/state";
import { preferenceInputSchema } from "@/lib/validation";

const FIELD_ORDER = [
  "originRegion",
  "tripLengthDays",
  "budgetMin",
  "budgetMax",
  "interests",
  "climate",
  "pace",
  "travelMonth",
  "partyType",
] as const;

export function validatePreferences(state: TravelAgentState): TravelAgentState {
  if (!state.preferences) {
    return {
      ...state,
      phase: "clarifying_preferences",
      missingFields: ["preferences"],
      lastError: "Travel preferences are required.",
    };
  }

  const parsed = preferenceInputSchema.safeParse(state.preferences);

  if (parsed.success) {
    return {
      ...state,
      preferences: parsed.data,
      phase: "recommendation_ready",
      missingFields: [],
      lastError: undefined,
    };
  }

  const fieldErrors = parsed.error.flatten().fieldErrors;
  const missingFields = FIELD_ORDER.filter((field) => (fieldErrors[field] ?? []).length > 0);

  return {
    ...state,
    phase: "clarifying_preferences",
    missingFields,
    lastError: Object.values(fieldErrors).flat()[0] ?? "Please refine your travel preferences.",
  };
}
