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

const NOTE_STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "any",
  "around",
  "at",
  "be",
  "for",
  "from",
  "good",
  "great",
  "have",
  "in",
  "is",
  "like",
  "my",
  "near",
  "need",
  "of",
  "on",
  "or",
  "our",
  "prefer",
  "really",
  "some",
  "that",
  "the",
  "this",
  "to",
  "travel",
  "trip",
  "want",
  "we",
  "with",
]);

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesWholePhrase(source: string, phrase: string) {
  if (!phrase) {
    return false;
  }

  return new RegExp(`(^|\\s)${escapeRegExp(phrase)}(?=\\s|$)`, "u").test(source);
}

function tokenizeNote(value: string) {
  return Array.from(
    new Set(
      normalizeText(value)
        .split(" ")
        .filter((token) => token.length >= 3 && !NOTE_STOPWORDS.has(token)),
    ),
  );
}

function joinLabels(labels: string[]) {
  if (labels.length === 1) {
    return labels[0];
  }

  if (labels.length === 2) {
    return `${labels[0]} and ${labels[1]}`;
  }

  return `${labels.slice(0, -1).join(", ")}, and ${labels.at(-1)}`;
}

function scoreAdditionalRequirements(
  preferences: Pick<PreferenceInput, "additionalRequirements">,
  destination: DestinationCatalogEntry,
) {
  const normalizedNote = normalizeText(preferences.additionalRequirements);

  if (!normalizedNote) {
    return {
      score: 0,
      reason: undefined,
    };
  }

  const exactMatchLabels: string[] = [];
  const summaryMatches: string[] = [];
  const summary = normalizeText(destination.summary);
  const noteTokens = tokenizeNote(preferences.additionalRequirements);
  const fieldGroups = [
    {
      values: [destination.name],
      label: (value: string) => value,
    },
    {
      values: [destination.country],
      label: (value: string) => value,
    },
  ] as const;

  fieldGroups.forEach((group) => {
    group.values.forEach((value) => {
      const label = group.label(value);

      if (includesWholePhrase(normalizedNote, normalizeText(value)) && !exactMatchLabels.includes(label)) {
        exactMatchLabels.push(label);
      }
    });
  });

  noteTokens.forEach((token) => {
    if (
      includesWholePhrase(summary, token) &&
      !summaryMatches.includes(token) &&
      !exactMatchLabels.includes(token)
    ) {
      summaryMatches.push(token);
    }
  });

  const score = Math.min(3, Math.min(2, exactMatchLabels.length) + (summaryMatches.length >= 2 ? 1 : 0));
  const reasonLabels = [
    ...exactMatchLabels.slice(0, 2),
    ...(summaryMatches.length >= 2 ? [`${summaryMatches[0]} and ${summaryMatches[1]} details`] : []),
  ];

  return {
    score,
    reason:
      score >= 2 && reasonLabels.length > 0
        ? `Your extra requirements align with ${joinLabels(reasonLabels)}.`
        : undefined,
  };
}

function scoreDestinationScope(preferences: Pick<PreferenceInput, "destinationScope">, destination: DestinationCatalogEntry) {
  const isDomesticDestination = destination.country === "China";

  if (preferences.destinationScope === "domestic") {
    return {
      score: isDomesticDestination ? 4 : -4,
      reason: isDomesticDestination ? "Matches your domestic destination scope." : undefined,
    };
  }

  return {
    score: isDomesticDestination ? -3 : 3,
    reason: !isDomesticDestination ? "Matches your overseas destination scope." : undefined,
  };
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

  const scopeMatch = scoreDestinationScope(preferences, destination);
  score += scopeMatch.score;
  if (scopeMatch.reason) {
    reasons.push(scopeMatch.reason);
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

  const additionalRequirementMatch = scoreAdditionalRequirements(preferences, destination);
  if (additionalRequirementMatch.score > 0) {
    score += additionalRequirementMatch.score;

    if (additionalRequirementMatch.reason) {
      reasons.push(additionalRequirementMatch.reason);
    }
  }

  return {
    destination,
    score,
    reasons,
  };
}
