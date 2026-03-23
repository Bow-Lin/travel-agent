import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ConfirmationPanel } from "@/components/confirmation-panel";
import { ItineraryView } from "@/components/itinerary-view";
import type { ConfirmedDestination, GeneratedItinerary } from "@/lib/types";

const destination: ConfirmedDestination = {
  destinationId: "kyoto-japan",
  name: "Kyoto",
  country: "Japan",
};

const itinerary: GeneratedItinerary = {
  destination,
  days: [
    {
      day: 1,
      theme: "Food discoveries",
      morning: "Start with a market breakfast.",
      afternoon: "Explore central neighborhoods.",
      evening: "Settle into a slow dinner.",
    },
    {
      day: 2,
      theme: "Culture discoveries",
      morning: "Visit a temple district.",
      afternoon: "Spend time in a museum.",
      evening: "Take a twilight walk.",
    },
  ],
};

describe("ConfirmationPanel and ItineraryView", () => {
  it("shows the confirmed destination and itinerary generation errors", async () => {
    const user = userEvent.setup();

    let resolveGenerate: ((value: { ok: false; error: string }) => void) | undefined;
    const onGenerate = vi.fn<() => Promise<{ ok: true } | { ok: false; error: string }>>(
      () =>
        new Promise((resolve) => {
          resolveGenerate = resolve;
        }),
    );

    render(
      <ConfirmationPanel destination={destination} tripLengthDays={4} onGenerate={onGenerate} />,
    );

    expect(screen.getByText(/kyoto, japan/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /generate 4-day itinerary/i }));

    expect(onGenerate).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /generating itinerary/i })).toBeDisabled();

    resolveGenerate?.({ ok: false, error: "Itinerary generation failed." });

    expect(await screen.findByText("Itinerary generation failed.")).toBeInTheDocument();
  });

  it("renders the generated itinerary by day", () => {
    render(<ItineraryView itinerary={itinerary} />);

    expect(screen.getByText(/2-day plan for kyoto/i)).toBeInTheDocument();
    expect(screen.getByText("Food discoveries")).toBeInTheDocument();
    expect(screen.getByText("Culture discoveries")).toBeInTheDocument();
    expect(screen.getByText("Start with a market breakfast.")).toBeInTheDocument();
    expect(screen.getByText("Take a twilight walk.")).toBeInTheDocument();
  });
});
