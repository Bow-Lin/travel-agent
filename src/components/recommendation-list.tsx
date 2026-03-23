"use client";

import { useState } from "react";

import { DestinationCard } from "@/components/destination-card";
import type { DestinationRecommendation } from "@/lib/types";

type ConfirmResult = { ok: true } | { ok: false; error: string };

type RecommendationListProps = {
  disabled?: boolean;
  recommendations: DestinationRecommendation[];
  onConfirm: (destinationId: string) => Promise<ConfirmResult>;
  confirmedDestinationId?: string;
};

export function RecommendationList({
  disabled = false,
  recommendations,
  onConfirm,
  confirmedDestinationId,
}: RecommendationListProps) {
  const [pendingDestinationId, setPendingDestinationId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleConfirm(destinationId: string) {
    if (disabled) {
      return;
    }

    setPendingDestinationId(destinationId);
    setErrorMessage(null);

    const result = await onConfirm(destinationId);

    if (!result.ok) {
      setErrorMessage(result.error);
    }

    setPendingDestinationId(null);
  }

  return (
    <section className="planner-panel planner-panel-cool p-5 sm:p-7 lg:p-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start">
        <div>
          <p className="planner-kicker text-sky-700">
            Ranked shortlist
          </p>
          <h2 className="mt-3 font-[family:var(--font-fraunces)] text-3xl leading-tight text-slate-900">
            Compare a focused set of destinations before you commit to one.
          </h2>
          <p className="planner-copy mt-4 max-w-2xl text-sm leading-7 sm:text-base">
            Each match stays concise so the next decision is clear instead of overwhelming.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-white/75 bg-white/55 p-4 text-sm leading-6 text-slate-600 shadow-sm">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-sky-800">
            Step 2
          </p>
          <p className="mt-3">
            Review the ranked cards, confirm one destination, then the itinerary step opens below.
          </p>
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

      <div className="mt-6 flex flex-col gap-4 border-t border-white/65 pt-6">
        <p aria-live="polite" className="planner-status text-sm leading-6">
          {pendingDestinationId
            ? "Confirming your selected destination..."
            : disabled
              ? "Planner is busy finishing the current step."
            : "Choose one destination to continue to itinerary generation."}
        </p>

        <div className="rounded-[1.75rem] border border-white/75 bg-white/45 p-2 sm:p-3">
          <div className="grid gap-5 xl:grid-cols-2">
            {recommendations.map((recommendation, index) => (
              <DestinationCard
                key={recommendation.id}
                isConfirmed={confirmedDestinationId === recommendation.id}
                isPending={disabled || pendingDestinationId === recommendation.id}
                rank={index + 1}
                recommendation={recommendation}
                onConfirm={handleConfirm}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
