import { describe, expect, it } from "vitest";

describe("travel graph module", () => {
  it("exposes a graph factory", async () => {
    await expect(import("@/agent/travel-graph/graph")).resolves.toHaveProperty("createTravelGraph");
  });
});
