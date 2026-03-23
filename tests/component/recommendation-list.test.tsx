import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RecommendationList } from "@/components/recommendation-list";
import type { DestinationRecommendation } from "@/lib/types";

const recommendations: DestinationRecommendation[] = [
  {
    id: "kyoto-japan",
    name: "Kyoto",
    country: "Japan",
    summary: "Temples, tea houses, and excellent seasonal food.",
    matchReasons: ["Great in October", "Strong food and culture match"],
    budgetBand: "medium",
    bestMonths: ["March", "April", "October"],
    score: 96,
  },
  {
    id: "lisbon-portugal",
    name: "Lisbon",
    country: "Portugal",
    summary: "Sunny streets, tiled facades, and seafood near the coast.",
    matchReasons: ["Mild climate", "History and beach mix"],
    budgetBand: "medium",
    bestMonths: ["April", "May", "October"],
    score: 88,
  },
];

describe("RecommendationList", () => {
  it("renders ranked destination cards with match reasons", () => {
    const onConfirm = vi.fn<(destinationId: string) => Promise<{ ok: true } | { ok: false; error: string }>>()
      .mockResolvedValue({ ok: true });

    render(<RecommendationList recommendations={recommendations} onConfirm={onConfirm} />);

    expect(screen.getByText("Kyoto")).toBeInTheDocument();
    expect(screen.getByText("Lisbon")).toBeInTheDocument();
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("Great in October")).toBeInTheDocument();
    expect(screen.getByText("History and beach mix")).toBeInTheDocument();
  });

  it("confirms a destination and shows async errors", async () => {
    const user = userEvent.setup();

    let resolveConfirm: ((value: { ok: false; error: string }) => void) | undefined;
    const onConfirm = vi.fn<(destinationId: string) => Promise<{ ok: true } | { ok: false; error: string }>>(
      () =>
        new Promise((resolve) => {
          resolveConfirm = resolve;
        }),
    );

    render(<RecommendationList recommendations={recommendations} onConfirm={onConfirm} />);

    await user.click(screen.getByRole("button", { name: /confirm kyoto/i }));

    expect(onConfirm).toHaveBeenCalledWith("kyoto-japan");
    expect(screen.getByRole("button", { name: /confirming kyoto/i })).toBeDisabled();

    resolveConfirm?.({ ok: false, error: "Please choose a destination again." });

    expect(await screen.findByText("Please choose a destination again.")).toBeInTheDocument();
  });
});
