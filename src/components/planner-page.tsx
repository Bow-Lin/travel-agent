import {
  confirmDestinationAction,
  generateItineraryAction,
  recommendDestinationsAction,
} from "@/app/actions";
import { StepShell } from "@/components/step-shell";

export function PlannerPage() {
  return (
    <main className="min-h-screen text-slate-900">
      <section className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-6 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="planner-stage flex w-full flex-col px-5 py-6 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
          <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_280px] lg:items-end lg:gap-8">
            <div className="max-w-3xl pt-1">
              <p className="planner-kicker text-amber-700">Plan your trip</p>
              <h1 className="mt-5 max-w-3xl font-[family:var(--font-fraunces)] text-4xl leading-[1.02] text-slate-900 sm:text-5xl lg:text-[3.35rem]">
                Fill in your travel brief, compare the shortlist, then generate a clear itinerary.
              </h1>
              <p className="planner-copy mt-6 max-w-2xl text-base leading-8 sm:text-[1.05rem]">
                This page is dedicated to planning, so you can move through the full flow without the
                homepage competing for attention.
              </p>
            </div>

            <aside className="planner-note text-sm leading-6 text-slate-600 lg:text-right">
              <p className="planner-kicker text-amber-800">What happens here</p>
              <p className="mt-3">
                Share preferences, confirm one destination, and turn that choice into a practical
                day-by-day draft.
              </p>
            </aside>
          </div>

          <div className="relative z-10 mt-8 border-t border-white/65 pt-8 sm:mt-10 sm:pt-10">
            <StepShell
              confirmDestination={confirmDestinationAction}
              generateItinerary={generateItineraryAction}
              recommendDestinations={recommendDestinationsAction}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
