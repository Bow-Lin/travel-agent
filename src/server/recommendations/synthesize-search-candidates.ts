import type { DestinationCatalogEntry } from "@/lib/types";
import type { TavilySearchResult } from "@/server/search/tavily";

function normalize(value: string) {
  return value.toLowerCase();
}

export function synthesizeSearchCandidates(
  catalog: DestinationCatalogEntry[],
  searchResults: TavilySearchResult[],
) {
  const candidateScores = new Map<string, number>();
  const highlights = new Map<string, string>();

  for (const destination of catalog) {
    const destinationName = normalize(destination.name);
    const countryName = normalize(destination.country);

    for (const result of searchResults) {
      const searchableText = normalize(`${result.title} ${result.url} ${result.content}`);
      const nameMatched = searchableText.includes(destinationName);
      const countryMatched = searchableText.includes(countryName);

      if (nameMatched || countryMatched) {
        const weightedScore = (nameMatched ? 3 : 0) + (countryMatched ? 1 : 0);

        candidateScores.set(destination.id, (candidateScores.get(destination.id) ?? 0) + weightedScore);

        if (!highlights.has(destination.id)) {
          highlights.set(destination.id, result.content || result.title);
        }
      }
    }
  }

  const candidateIds = Array.from(candidateScores.entries())
    .sort((left, right) => right[1] - left[1])
    .map(([candidateId]) => candidateId);

  return {
    candidateIds,
    candidateScores,
    highlights,
  };
}
