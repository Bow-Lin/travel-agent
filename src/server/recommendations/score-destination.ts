import type {
  BudgetLevel,
  DestinationCatalogEntry,
  DestinationScore,
  PreferenceInput,
} from "@/lib/types";

function budgetBandFromRange(preferences: Pick<PreferenceInput, "budgetMin" | "budgetMax">): BudgetLevel {
  const midpoint = (preferences.budgetMin + preferences.budgetMax) / 2;

  if (midpoint < 8000) {
    return "low";
  }

  if (midpoint < 18000) {
    return "medium";
  }

  return "high";
}

function budgetDistance(preferred: BudgetLevel, actual: DestinationCatalogEntry["budgetBand"]) {
  const scale = {
    low: 0,
    medium: 1,
    high: 2,
  } as const;

  return Math.abs(scale[preferred] - scale[actual]);
}

export function scoreDestination(
  preferences: PreferenceInput,
  destination: DestinationCatalogEntry,
): DestinationScore {
  let score = 0;
  const reasons: string[] = [];

  const derivedBudgetBand = budgetBandFromRange(preferences);
  const budgetGap = budgetDistance(derivedBudgetBand, destination.budgetBand);
  if (budgetGap === 0) {
    score += 3;
    reasons.push(`Fits your budget range of CNY ${preferences.budgetMin}-${preferences.budgetMax}.`);
  } else if (budgetGap === 1) {
    score += 1;
  } else {
    score -= 1;
  }

  if (preferences.climate === "any" || destination.climate.includes(preferences.climate)) {
    score += 3;
    reasons.push(`Fits your ${preferences.climate === "any" ? "flexible" : preferences.climate} climate preference.`);
  }

  const interestMatches = destination.interests.filter((interest) => preferences.interests.includes(interest));
  if (interestMatches.length > 0) {
    score += interestMatches.length * 2;
    reasons.push(`Strong ${interestMatches.join(" and ")} match.`);
  }

  if (destination.bestMonths.includes(preferences.travelMonth)) {
    score += 2;
    reasons.push(`Works especially well in ${preferences.travelMonth}.`);
  }

  if (destination.tripStyles.includes(preferences.partyType)) {
    score += 2;
    reasons.push(`Well suited for ${preferences.partyType} trips.`);
  }

  if (preferences.pace === "relaxed" && destination.interests.includes("nature")) {
    score += 1;
  }

  if (preferences.pace === "packed" && destination.interests.includes("nightlife")) {
    score += 1;
  }

  return {
    destination,
    score,
    reasons,
  };
}
