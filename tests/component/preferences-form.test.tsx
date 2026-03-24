import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PreferencesForm } from "@/components/preferences-form";
import type { PreferenceInput } from "@/lib/types";

describe("PreferencesForm", () => {
  it("submits structured travel preferences", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn<
      (input: PreferenceInput) => Promise<{ ok: true } | { ok: false; error: string }>
    >().mockResolvedValue({ ok: true });

    render(<PreferencesForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/where are you leaving from/i), "Shanghai");
    await user.clear(screen.getByLabelText(/trip length/i));
    await user.type(screen.getByLabelText(/trip length/i), "10");
    await user.clear(screen.getByLabelText(/budget minimum/i));
    await user.type(screen.getByLabelText(/budget minimum/i), "9000");
    await user.clear(screen.getByLabelText(/budget maximum/i));
    await user.type(screen.getByLabelText(/budget maximum/i), "22000");
    await user.click(screen.getByRole("button", { name: /domestic/i }));
    await user.selectOptions(screen.getByLabelText(/climate/i), "warm");
    await user.selectOptions(screen.getByLabelText(/pace/i), "packed");
    await user.selectOptions(screen.getByLabelText(/travel month/i), "May");
    await user.selectOptions(screen.getByLabelText(/party type/i), "friends");
    await user.click(screen.getByRole("button", { name: /add requirements/i }));
    await user.type(
      screen.getByLabelText(/additional requirements note/i),
      "Need easy train access and tea-house neighborhoods.",
    );
    await user.click(screen.getByRole("button", { name: /save requirements/i }));
    await user.click(screen.getByLabelText(/food/i));
    await user.click(screen.getByLabelText(/beach/i));
    await user.click(screen.getByRole("button", { name: /find destinations/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        originRegion: "Shanghai",
        tripLengthDays: 10,
        budgetMin: 9000,
        budgetMax: 22000,
        destinationScope: "domestic",
        additionalRequirements: "Need easy train access and tea-house neighborhoods.",
        interests: ["food", "beach"],
        climate: "warm",
        pace: "packed",
        travelMonth: "May",
        partyType: "friends",
      });
    });
  });

  it("shows loading and submit errors", async () => {
    const user = userEvent.setup();

    let resolveSubmit: ((value: { ok: false; error: string }) => void) | undefined;
    const onSubmit = vi.fn<
      (input: PreferenceInput) => Promise<{ ok: true } | { ok: false; error: string }>
    >(
      () =>
        new Promise((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    render(<PreferencesForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/where are you leaving from/i), "Shanghai");
    await user.click(screen.getByLabelText(/food/i));
    await user.selectOptions(screen.getByLabelText(/travel month/i), "October");
    await user.click(screen.getByRole("button", { name: /find destinations/i }));

    expect(screen.getByRole("button", { name: /finding destinations/i })).toBeDisabled();

    resolveSubmit?.({ ok: false, error: "Planner is unavailable right now." });

    expect(await screen.findByText("Planner is unavailable right now.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /find destinations/i })).toBeEnabled();
  });

  it("supports save, cancel, and clear flows for additional requirements", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn<
      (input: PreferenceInput) => Promise<{ ok: true } | { ok: false; error: string }>
    >().mockResolvedValue({ ok: true });

    render(<PreferencesForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: /add requirements/i }));
    const triggerButton = screen.getByRole("button", { name: /add requirements/i });
    const noteField = screen.getByLabelText(/additional requirements note/i);

    await user.type(noteField, "Avoid overnight transfers");
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.getByText(/no extra requirements saved yet/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(triggerButton).toHaveFocus();
    });

    await user.click(screen.getByRole("button", { name: /add requirements/i }));
    await user.type(screen.getByLabelText(/additional requirements note/i), "Need calm tea houses");
    await user.click(screen.getByRole("button", { name: /save requirements/i }));

    expect(screen.getAllByText("Need calm tea houses").length).toBeGreaterThan(0);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /edit requirements/i })).toHaveFocus();
    });

    await user.click(screen.getByRole("button", { name: /edit requirements/i }));
    expect(screen.getByLabelText(/additional requirements note/i)).toHaveValue("Need calm tea houses");

    await user.click(screen.getByRole("button", { name: /clear note/i }));
    expect(screen.getByLabelText(/additional requirements note/i)).toHaveValue("");

    await user.click(screen.getByRole("button", { name: /save requirements/i }));

    expect(screen.getByText(/no extra requirements saved yet/i)).toBeInTheDocument();
  });
});
