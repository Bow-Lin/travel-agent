import type { DestinationRecommendation } from "@/lib/types";

type DestinationCardProps = {
  recommendation: DestinationRecommendation;
  rank: number;
  isPending?: boolean;
  isConfirmed?: boolean;
  onConfirm: (destinationId: string) => void;
};

function labelForValue(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function DestinationCard({
  recommendation,
  rank,
  isPending = false,
  isConfirmed = false,
  onConfirm,
}: DestinationCardProps) {
  return (
    <article className="flex h-full flex-col rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(94,66,46,0.1)] backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
            {String(rank).padStart(2, "0")}
          </p>
          <h3 className="mt-3 font-[family:var(--font-fraunces)] text-3xl text-slate-900">
            {recommendation.name}
          </h3>
          <p className="mt-1 text-sm uppercase tracking-[0.18em] text-slate-500">
            {recommendation.country}
          </p>
        </div>
        <div className="rounded-full bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">
          {recommendation.score}
        </div>
      </div>

      <p className="mt-5 text-sm leading-7 text-slate-600">{recommendation.summary}</p>

      <dl className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <div className="rounded-2xl bg-stone-50 p-4">
          <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Budget</dt>
          <dd className="mt-2 text-base font-medium text-slate-900">
            {labelForValue(recommendation.budgetBand)}
          </dd>
        </div>
        <div className="rounded-2xl bg-stone-50 p-4">
          <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Best months</dt>
          <dd className="mt-2 text-base font-medium text-slate-900">
            {recommendation.bestMonths.join(", ")}
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Why it fits</p>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
          {recommendation.matchReasons.map((reason) => (
            <li key={reason} className="rounded-2xl bg-sky-50 px-4 py-3">
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-stone-100 pt-6">
        <p className="text-sm text-slate-500">
          {isConfirmed ? "Confirmed for itinerary generation." : "Confirm this pick to build a day-by-day plan."}
        </p>
        <button
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:bg-slate-400"
          disabled={isPending}
          type="button"
          onClick={() => {
            onConfirm(recommendation.id);
          }}
        >
          {isPending ? `Confirming ${recommendation.name}...` : `Confirm ${recommendation.name}`}
        </button>
      </div>
    </article>
  );
}
