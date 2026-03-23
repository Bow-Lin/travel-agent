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
      <p className="planner-kicker text-emerald-700">
        Confirmed destination
      </p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span className="rounded-full border border-white/80 bg-white/70 px-3 py-2">Step 3</span>
            <span className="rounded-full border border-emerald-100 bg-emerald-50/90 px-3 py-2 text-emerald-800">
              {tripLengthDays} days planned
            </span>
          </div>
          <h2 className="mt-4 font-[family:var(--font-fraunces)] text-3xl leading-tight text-slate-900">
            {destination.name}, {destination.country}
          </h2>
          <p className="planner-copy mt-3 max-w-2xl text-sm leading-7 sm:text-base">
            You have locked in the destination. Generate a {tripLengthDays}-day itinerary next to turn
            the shortlist into a concrete plan.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 lg:items-end">
            <p aria-live="polite" className="planner-status text-sm leading-6">
            {disabled && !isGenerating
              ? "Planner is busy finishing the current step."
              : isGenerating
                ? "Generating itinerary..."
                : "Ready to turn this destination into a day-by-day plan."}
          </p>
          <button
            className="planner-primary-button inline-flex w-full items-center justify-center px-6 py-3 text-sm font-semibold sm:w-auto"
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
