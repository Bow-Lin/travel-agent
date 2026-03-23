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
    <article className="planner-card flex h-full flex-col p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="planner-kicker text-amber-700">
            {String(rank).padStart(2, "0")}
          </p>
          <h3 className="mt-3 font-[family:var(--font-fraunces)] text-3xl leading-tight text-slate-900">
            {recommendation.name}
          </h3>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-sm">
            {recommendation.country}
          </p>
        </div>
        <div className="planner-card-subtle min-w-16 px-4 py-3 text-center text-base font-semibold text-amber-900 sm:min-w-20">
          {recommendation.score}
        </div>
      </div>

      <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-[0.98rem]">{recommendation.summary}</p>

      <dl className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <div className="planner-card-subtle p-4">
          <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Budget</dt>
          <dd className="mt-2 text-base font-medium text-slate-900">
            {labelForValue(recommendation.budgetBand)}
          </dd>
        </div>
        <div className="planner-card-subtle p-4">
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
            <li key={reason} className="planner-card-subtle bg-sky-50/80 px-4 py-3">
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-white/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-sm leading-6 text-slate-500">
          {isConfirmed
            ? "Selected for itinerary generation. You can still switch to another card before generating the plan."
            : "Confirm this pick to build a day-by-day plan."}
        </p>
        <button
          className="planner-primary-button inline-flex w-full items-center justify-center px-5 py-3 text-sm font-semibold sm:w-auto"
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
