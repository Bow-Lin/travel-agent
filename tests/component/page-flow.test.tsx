import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ConfirmedDestination, DestinationRecommendation, GeneratedItinerary } from "@/lib/types";

const mockedActions = vi.hoisted(() => ({
  recommendDestinationsAction: vi.fn(),
  confirmDestinationAction: vi.fn(),
  generateItineraryAction: vi.fn(),
}));

vi.mock("@/app/actions", () => mockedActions);

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
];

const destination: ConfirmedDestination = {
  destinationId: "kyoto-japan",
  name: "Kyoto",
  country: "Japan",
};

const itinerary: GeneratedItinerary = {
  destination,
  days: Array.from({ length: 6 }, (_, index) => ({
    day: index + 1,
    theme: index % 2 === 0 ? "Food discoveries" : "Culture discoveries",
    morning: `Start day ${index + 1} with a focused morning in Kyoto.`,
    afternoon: `Spend the afternoon exploring Kyoto on day ${index + 1}.`,
    evening: `Settle into the evening plan for day ${index + 1} in Kyoto.`,
  })),
};

describe("Home page flow", () => {
  beforeEach(() => {
    mockedActions.recommendDestinationsAction.mockReset();
    mockedActions.confirmDestinationAction.mockReset();
    mockedActions.generateItineraryAction.mockReset();

    mockedActions.recommendDestinationsAction.mockResolvedValue({
      ok: true,
      data: {
        threadId: "thread-1",
        phase: "awaiting_confirmation",
        recommendations,
      },
    });
    mockedActions.confirmDestinationAction.mockResolvedValue({
      ok: true,
      data: {
        threadId: "thread-1",
        phase: "generating_itinerary",
        destination,
      },
    });
    mockedActions.generateItineraryAction.mockResolvedValue({
      ok: true,
      data: {
        threadId: "thread-1",
        phase: "completed",
        itinerary,
      },
    });
  });

  it("moves from preferences to recommendations to itinerary", async () => {
    const user = userEvent.setup();
    const { default: Home } = await import("@/app/page");

    render(<Home />);

    await user.type(screen.getByLabelText(/where are you leaving from/i), "Shanghai");
    await user.selectOptions(screen.getByLabelText(/travel month/i), "October");
    await user.click(screen.getByLabelText(/food/i));
    await user.click(screen.getByRole("button", { name: /find destinations/i }));

    expect(await screen.findByText("Kyoto")).toBeInTheDocument();
    expect(screen.getByText(/ranked shortlist/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /confirm kyoto/i }));

    expect(await screen.findByText(/confirmed destination/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /generate 6-day itinerary/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /generate 6-day itinerary/i }));

    expect(await screen.findByText(/6-day plan for kyoto/i)).toBeInTheDocument();
    expect(screen.getAllByText("Food discoveries").length).toBeGreaterThan(0);
    expect(screen.getByText(/step 4 of 4/i)).toBeInTheDocument();
  });
});
