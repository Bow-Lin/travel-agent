"use client";

import { useMemo, useRef, useState } from "react";

import { ConfirmationPanel } from "@/components/confirmation-panel";
import { ItineraryView } from "@/components/itinerary-view";
import { PreferencesForm } from "@/components/preferences-form";
import { RecommendationList } from "@/components/recommendation-list";
import type {
  ConfirmedDestination,
  DestinationRecommendation,
  GeneratedItinerary,
  PreferenceInput,
} from "@/lib/types";

type ActionResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: string;
    };

type StepShellProps = {
  recommendDestinations: (input: PreferenceInput) => Promise<ActionResult<DestinationRecommendation[]>>;
  confirmDestination: (
    destinationId: string,
    preferences: PreferenceInput,
  ) => Promise<ActionResult<ConfirmedDestination>>;
  generateItinerary: (input: {
    preferences: PreferenceInput;
    destination: ConfirmedDestination;
  }) => Promise<ActionResult<GeneratedItinerary>>;
};

const steps = [
  {
    title: "Preferences",
    description: "Capture timing, budget, travel style, and interests.",
  },
  {
    title: "Recommendations",
    description: "Review the shortlist and compare why each match made the cut.",
  },
  {
    title: "Confirmation",
    description: "Lock one destination before generating the trip outline.",
  },
  {
    title: "Itinerary",
    description: "Read the day-by-day plan and use it as the starting draft.",
  },
] as const;

export function StepShell({
  recommendDestinations,
  confirmDestination,
  generateItinerary,
}: StepShellProps) {
  const [preferences, setPreferences] = useState<PreferenceInput | null>(null);
  const [recommendations, setRecommendations] = useState<DestinationRecommendation[]>([]);
  const [confirmedDestination, setConfirmedDestination] = useState<ConfirmedDestination | null>(null);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [isSubmittingPreferences, setIsSubmittingPreferences] = useState(false);
  const [isConfirmingDestination, setIsConfirmingDestination] = useState(false);
  const [isGeneratingItinerary, setIsGeneratingItinerary] = useState(false);
  const activeSubmissionId = useRef(0);

  const currentStep = useMemo(() => {
    if (itinerary) {
      return 4;
    }

    if (confirmedDestination) {
      return 3;
    }

    if (recommendations.length > 0) {
      return 2;
    }

    return 1;
  }, [confirmedDestination, itinerary, recommendations.length]);

  const isBusy = isSubmittingPreferences || isConfirmingDestination || isGeneratingItinerary;

  async function handlePreferencesSubmit(input: PreferenceInput) {
    if (isBusy) {
      return {
        ok: false,
        error: "Please wait for the current planner step to finish.",
      } as const;
    }

    const submissionId = activeSubmissionId.current + 1;
    activeSubmissionId.current = submissionId;
    setIsSubmittingPreferences(true);

    const result = await recommendDestinations(input);

    if (activeSubmissionId.current !== submissionId) {
      return {
        ok: false,
        error: "A newer planner request has replaced this result.",
      } as const;
    }

    setIsSubmittingPreferences(false);

    if (!result.ok) {
      return result;
    }

    setPreferences(input);
    setRecommendations(result.data);
    setConfirmedDestination(null);
    setItinerary(null);

    return { ok: true } as const;
  }

  async function handleConfirm(destinationId: string) {
    if (!preferences || isBusy) {
      return {
        ok: false,
        error: "Please wait for the current planner step to finish.",
      } as const;
    }

    const submissionId = activeSubmissionId.current + 1;
    activeSubmissionId.current = submissionId;
    setIsConfirmingDestination(true);

    const result = await confirmDestination(destinationId, preferences);

    if (activeSubmissionId.current !== submissionId) {
      return {
        ok: false,
        error: "A newer planner request has replaced this result.",
      } as const;
    }

    setIsConfirmingDestination(false);

    if (!result.ok) {
      return result;
    }

    setConfirmedDestination(result.data);
    setItinerary(null);

    return { ok: true } as const;
  }

  async function handleGenerate() {
    if (!preferences || !confirmedDestination) {
      return {
        ok: false,
        error: "Complete the planner steps before generating an itinerary.",
      } as const;
    }

    if (isBusy) {
      return {
        ok: false,
        error: "Please wait for the current planner step to finish.",
      } as const;
    }

    const submissionId = activeSubmissionId.current + 1;
    activeSubmissionId.current = submissionId;
    setIsGeneratingItinerary(true);

    const result = await generateItinerary({
      preferences,
      destination: confirmedDestination,
    });

    if (activeSubmissionId.current !== submissionId) {
      return {
        ok: false,
        error: "A newer planner request has replaced this result.",
      } as const;
    }

    setIsGeneratingItinerary(false);

    if (!result.ok) {
      return result;
    }

    setItinerary(result.data);

    return { ok: true } as const;
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start xl:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="planner-panel planner-panel-muted p-5 sm:p-7 lg:sticky lg:top-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="planner-kicker text-amber-700">Planner flow</p>
            <h2 className="mt-4 font-[family:var(--font-fraunces)] text-3xl leading-tight text-slate-900">
              Step {currentStep} of 4
            </h2>
          </div>
          <div className="rounded-full border border-white/80 bg-white/75 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            0{currentStep}/04
          </div>
        </div>

        <p className="planner-copy mt-4 text-sm leading-7">
          The planner keeps one clear decision in front of you instead of showing every option at once.
        </p>

        <div className="mt-6 rounded-full bg-white/70 p-1" aria-hidden="true">
          <div
            className="h-2 rounded-full bg-[linear-gradient(90deg,_#b86c2d,_#d0a06f)] transition-[width] duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>

        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isComplete = stepNumber < currentStep;

            return (
              <li
                key={step.title}
                className={`rounded-[1.5rem] border px-4 py-4 transition ${
                  isActive
                    ? "border-amber-300 bg-amber-50/90 shadow-[0_12px_30px_rgba(180,118,58,0.12)]"
                    : isComplete
                      ? "border-emerald-200 bg-emerald-50/85"
                      : "border-white/80 bg-white/72"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      isActive
                        ? "bg-amber-200 text-amber-950"
                        : isComplete
                          ? "bg-emerald-200 text-emerald-950"
                          : "bg-stone-200 text-slate-700"
                    }`}
                  >
                    {String(stepNumber).padStart(2, "0")}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {isComplete ? "Complete" : isActive ? "Current" : "Up next"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </aside>

      <div className="min-w-0 space-y-6 lg:space-y-7">
        <PreferencesForm isLocked={isBusy} onSubmit={handlePreferencesSubmit} />

        {recommendations.length > 0 ? (
          <RecommendationList
            disabled={isBusy}
            confirmedDestinationId={confirmedDestination?.destinationId}
            recommendations={recommendations}
            onConfirm={handleConfirm}
          />
        ) : null}

        {confirmedDestination && preferences ? (
          <ConfirmationPanel
            destination={confirmedDestination}
            disabled={isBusy}
            tripLengthDays={preferences.tripLengthDays}
            onGenerate={handleGenerate}
          />
        ) : null}

        {itinerary ? <ItineraryView itinerary={itinerary} /> : null}
      </div>
    </section>
  );
}
