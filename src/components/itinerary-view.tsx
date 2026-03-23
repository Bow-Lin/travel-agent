import type { GeneratedItinerary } from "@/lib/types";

type ItineraryViewProps = {
  itinerary: GeneratedItinerary;
};

export function ItineraryView({ itinerary }: ItineraryViewProps) {
  return (
    <section className="planner-panel p-5 sm:p-7 lg:p-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
        <div>
          <p className="planner-kicker text-amber-700">
            Day-by-day itinerary
          </p>
          <h2 className="mt-3 font-[family:var(--font-fraunces)] text-3xl leading-tight text-slate-900">
            {itinerary.days.length}-day plan for {itinerary.destination.name}
          </h2>
          <p className="planner-copy mt-4 text-sm leading-7 sm:text-base">
            Built for {itinerary.destination.name}, {itinerary.destination.country}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-white/75 bg-white/55 p-4 text-sm leading-6 text-slate-600 shadow-sm">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-amber-800">
            Step 4
          </p>
          <p className="mt-3">
            Use this draft as the working structure for the trip, then edit the details offline.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {itinerary.days.map((day, index) => (
          <article
            key={day.day}
            className={`overflow-hidden rounded-[1.75rem] border p-5 sm:p-6 ${
              index % 2 === 0
                ? "border-amber-100 bg-[linear-gradient(180deg,rgba(255,250,244,0.96),rgba(255,246,238,0.88))]"
                : "border-sky-100 bg-[linear-gradient(180deg,rgba(247,250,252,0.96),rgba(241,246,248,0.88))]"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full border border-white/80 bg-white/75 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Day {day.day}
                </span>
                <h3 className="mt-4 font-[family:var(--font-fraunces)] text-2xl text-slate-900">
                  {day.theme}
                </h3>
              </div>
            </div>

            <dl className="mt-6 grid gap-4 border-t border-white/70 pt-5 text-sm leading-7 text-slate-600">
              <div className="rounded-[1.25rem] bg-white/70 p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Morning</dt>
                <dd className="mt-2">{day.morning}</dd>
              </div>
              <div className="rounded-[1.25rem] bg-white/70 p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Afternoon</dt>
                <dd className="mt-2">{day.afternoon}</dd>
              </div>
              <div className="rounded-[1.25rem] bg-white/70 p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Evening</dt>
                <dd className="mt-2">{day.evening}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
