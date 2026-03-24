import { describe, expect, it } from "vitest";

import { destinationCatalog } from "@/server/recommendations/destination-catalog";
import { synthesizeSearchCandidates } from "@/server/recommendations/synthesize-search-candidates";

describe("synthesizeSearchCandidates", () => {
  it("extracts catalog matches from search results", () => {
    const result = synthesizeSearchCandidates(destinationCatalog, [
      {
        title: "Kyoto tea house guide",
        url: "https://example.com/kyoto",
        content: "Kyoto and Japan are ideal for tea-house neighborhoods and quiet cultural travel.",
      },
      {
        title: "Lisbon coast tips",
        url: "https://example.com/lisbon",
        content: "Lisbon is a sunny city break with seafood and nearby beaches.",
      },
    ]);

    expect(result.candidateIds).toContain("kyoto-japan");
    expect(result.candidateIds).toContain("lisbon-portugal");
    expect(result.highlights.get("kyoto-japan")).toContain("tea-house neighborhoods");
  });

  it("does not boost cities from country-only mentions", () => {
    const result = synthesizeSearchCandidates(destinationCatalog, [
      {
        title: "Japan autumn travel tips",
        url: "https://example.com/japan",
        content: "Japan offers excellent autumn travel without naming any city.",
      },
    ]);

    expect(result.candidateIds).not.toContain("kyoto-japan");
    expect(result.candidateIds).not.toContain("sapporo-japan");
    expect(result.highlights.size).toBe(0);
  });
});
