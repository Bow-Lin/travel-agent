import {
  confirmDestinationAction,
  generateItineraryAction,
  recommendDestinationsAction,
} from "@/app/actions";
import { StepShell } from "@/components/step-shell";

export default function Home() {
  return (
    <main className="min-h-screen text-slate-900">
      <section className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
        <div className="planner-stage flex w-full flex-col px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.85fr)] lg:items-end">
            <div className="max-w-3xl">
              <p className="planner-kicker text-amber-700">Travel Agent MVP</p>
              <h1 className="mt-5 font-[family:var(--font-fraunces)] text-4xl leading-[1.04] text-slate-900 sm:text-5xl lg:text-[3.5rem]">
                Tell us how you want to travel, review the shortlist, then build a clear trip plan.
              </h1>
              <p className="planner-copy mt-6 max-w-2xl text-base leading-8 sm:text-lg">
                This first release keeps the journey focused in one page flow: submit structured
                preferences, compare ranked destinations, confirm one, and generate the itinerary.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full border border-white/80 bg-white/70 px-4 py-2 shadow-sm">
                  One-page planner flow
                </span>
                <span className="rounded-full border border-white/80 bg-white/60 px-4 py-2 shadow-sm">
                  Warm editorial framing
                </span>
                <span className="rounded-full border border-white/80 bg-white/60 px-4 py-2 shadow-sm">
                  Shortlist first, itinerary second
                </span>
              </div>
            </div>

            <aside className="planner-panel planner-panel-muted relative z-10 p-6 sm:p-7">
              <p className="planner-kicker text-amber-800">Journey at a glance</p>
              <ol className="mt-5 space-y-4">
                <li className="flex items-start gap-4 border-b border-white/60 pb-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-950">
                    01
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Preferences</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Capture departure region, timing, budget, climate, pace, and interests.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4 border-b border-white/60 pb-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-950">
                    02
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Recommendations</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Compare concise editorial cards with why each destination fits the brief.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-950">
                    03
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Confirm + plan</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Lock the destination and reveal a usable day-by-day itinerary draft.
                    </p>
                  </div>
                </li>
              </ol>
            </aside>
          </div>

          <div className="relative z-10 mt-10 border-t border-white/60 pt-8 sm:mt-12 sm:pt-10">
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
