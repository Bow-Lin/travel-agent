import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen text-slate-900">
      <section className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-6 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="planner-stage flex w-full flex-col px-5 py-6 sm:px-8 sm:py-9 lg:px-10 lg:py-11">
          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1.32fr)_minmax(320px,0.88fr)] lg:items-start lg:gap-10">
            <div className="max-w-3xl pt-1">
              <p className="planner-kicker text-amber-700">Travel Agent MVP</p>
              <h1 className="mt-5 max-w-3xl font-[family:var(--font-fraunces)] text-4xl leading-[1.02] text-slate-900 sm:text-5xl lg:text-[3.65rem]">
                Tell us how you want to travel, review the shortlist, then build a clear trip plan.
              </h1>
              <p className="planner-copy mt-6 max-w-2xl text-base leading-8 sm:text-[1.05rem]">
                This first release keeps the journey focused in one page flow: submit structured
                preferences, compare ranked destinations, confirm one, and generate the itinerary.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="planner-tag">One-page planner flow</span>
                <span className="planner-tag">Warm editorial framing</span>
                <span className="planner-tag">Shortlist first, itinerary second</span>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  className="planner-primary-button inline-flex items-center justify-center px-7 py-3 text-sm font-semibold"
                  href="/plan"
                >
                  Open planner
                </Link>
                <p className="max-w-md text-sm leading-6 text-slate-500">
                  Open a dedicated planning page so you can fill in the brief without scrolling through
                  the homepage.
                </p>
              </div>
            </div>

            <aside className="planner-panel planner-panel-muted relative z-10 p-6 sm:p-7 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="planner-kicker text-amber-800">Journey at a glance</p>
                  <h2 className="mt-4 font-[family:var(--font-fraunces)] text-3xl leading-tight text-slate-900">
                    A steady three-step arc from brief to plan.
                  </h2>
                </div>
                <span className="planner-tag text-amber-800">3-step path</span>
              </div>

              <p className="planner-copy mt-4 text-sm leading-7">
                Start from the landing page, then move into a dedicated planner workspace when you are
                ready to fill out the trip brief.
              </p>

              <ol className="mt-6 space-y-3">
                <li className="planner-card-subtle flex items-start gap-4 p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-950">
                    01
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Preferences</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Capture departure region, timing, budget, climate, pace, and interests.
                    </p>
                  </div>
                </li>
                <li className="planner-card-subtle flex items-start gap-4 p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-950">
                    02
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Recommendations</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Compare concise editorial cards with why each destination fits the brief.
                    </p>
                  </div>
                </li>
                <li className="planner-card-subtle flex items-start gap-4 p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-950">
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

          <div className="relative z-10 mt-10 border-t border-white/65 pt-8 sm:mt-12 sm:pt-10">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
              <div>
                <p className="planner-kicker text-amber-700">Enter the planner</p>
                <h2 className="mt-4 font-[family:var(--font-fraunces)] text-3xl leading-tight text-slate-900">
                  Go straight into the form when you are ready to plan.
                </h2>
                <p className="planner-copy mt-4 max-w-2xl text-sm leading-7 sm:text-base">
                  We moved the full planner into its own page so the homepage stays clean and the form
                  flow gets the space it needs.
                </p>
              </div>

              <div className="planner-note flex flex-col gap-4 lg:items-end lg:text-right">
                <p className="text-sm leading-6 text-slate-600">
                  Jump into the dedicated planner to submit preferences, compare destinations, and
                  generate your itinerary.
                </p>
                <Link
                  className="planner-primary-button inline-flex items-center justify-center px-7 py-3 text-sm font-semibold"
                  href="/plan"
                >
                  Start planning
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
