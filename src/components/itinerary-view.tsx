import type { GeneratedItinerary } from "@/lib/types";

type ItineraryViewProps = {
  itinerary: GeneratedItinerary;
};

export function ItineraryView({ itinerary }: ItineraryViewProps) {
  return (
    <section className="planner-panel p-5 sm:p-7 lg:p-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-end">
        <div>
          <p className="planner-kicker text-amber-700">Day-by-day itinerary</p>
          <h2 className="mt-3 font-[family:var(--font-fraunces)] text-3xl leading-tight text-slate-900">
            {itinerary.days.length}-day plan for {itinerary.destination.name}
          </h2>
          <p className="planner-copy mt-4 text-sm leading-7 sm:text-base">
            Built for {itinerary.destination.name}, {itinerary.destination.country}
          </p>
        </div>

        <div className="planner-note text-sm leading-6 text-slate-600">
          <p className="planner-kicker text-amber-800">Step 4</p>
          <p className="mt-3">
            Use this draft as the working structure for the trip, then edit the details offline.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {itinerary.days.map((day, index) => (
          <article
            key={day.day}
            className={`planner-card overflow-hidden p-5 sm:p-6 ${
              index % 2 === 0
                ? "border-amber-100 bg-[linear-gradient(180deg,rgba(255,250,244,0.98),rgba(255,246,238,0.88))]"
                : "border-sky-100 bg-[linear-gradient(180deg,rgba(247,250,252,0.98),rgba(241,246,248,0.88))]"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="planner-tag">
                  Day {day.day}
                </span>
                <h3 className="mt-4 font-[family:var(--font-fraunces)] text-2xl text-slate-900">
                  {day.theme}
                </h3>
              </div>
            </div>

            <dl className="mt-6 grid gap-4 border-t border-white/70 pt-5 text-sm leading-7 text-slate-600">
              <div className="planner-card-subtle p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Morning</dt>
                <dd className="mt-2">{day.morning}</dd>
              </div>
              <div className="planner-card-subtle p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Afternoon</dt>
                <dd className="mt-2">{day.afternoon}</dd>
              </div>
              <div className="planner-card-subtle p-4">
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
