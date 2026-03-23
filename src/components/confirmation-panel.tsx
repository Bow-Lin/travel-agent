"use client";

import { useState } from "react";

import type { ConfirmedDestination } from "@/lib/types";

type GenerateResult = { ok: true } | { ok: false; error: string };

type ConfirmationPanelProps = {
  destination: ConfirmedDestination;
  disabled?: boolean;
  tripLengthDays: number;
  onGenerate: () => Promise<GenerateResult>;
};

export function ConfirmationPanel({
  destination,
  disabled = false,
  tripLengthDays,
  onGenerate,
}: ConfirmationPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleGenerate() {
    if (disabled) {
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    const result = await onGenerate();

    if (!result.ok) {
      setErrorMessage(result.error);
    }

    setIsGenerating(false);
  }

  return (
    <section className="planner-panel planner-panel-success p-5 sm:p-7 lg:p-8">
      <p className="planner-kicker text-emerald-700">Confirmed destination</p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
        <div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span className="planner-tag">Step 3</span>
            <span className="planner-tag border-emerald-100 bg-emerald-50/90 text-emerald-800">
              {tripLengthDays} days planned
            </span>
          </div>
          <h2 className="mt-4 font-[family:var(--font-fraunces)] text-3xl leading-tight text-slate-900">
            {destination.name}, {destination.country}
          </h2>
          <p className="planner-copy mt-3 max-w-2xl text-sm leading-7 sm:text-base">
            This destination is currently selected for your trip. Generate a {tripLengthDays}-day
            itinerary next, or go back to the shortlist above if you want to switch destinations.
          </p>
        </div>

        <div className="planner-note flex flex-col items-start gap-4 lg:items-end lg:text-right">
          <p aria-live="polite" className="planner-status text-sm leading-6">
            {disabled && !isGenerating
              ? "Planner is busy finishing the current step."
              : isGenerating
                ? "Generating itinerary..."
                : "Ready to turn this destination into a day-by-day plan."}
          </p>
          <button
            className="planner-primary-button inline-flex w-full items-center justify-center px-6 py-3 text-sm font-semibold"
            disabled={disabled || isGenerating}
            type="button"
            onClick={handleGenerate}
          >
            {isGenerating ? "Generating itinerary..." : `Generate ${tripLengthDays}-day itinerary`}
          </button>
        </div>
      </div>

      {errorMessage ? (
        <p
          aria-live="polite"
          className="planner-alert mt-6 px-4 py-3 text-sm text-rose-700"
        >
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
}
