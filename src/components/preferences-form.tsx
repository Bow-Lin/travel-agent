"use client";

import { useState } from "react";

import {
  BUDGET_LEVELS,
  CLIMATE_PREFERENCES,
  DEFAULT_INTERESTS,
  PARTY_TYPES,
  TRAVEL_PACES,
} from "@/lib/constants";
import type { PreferenceInput } from "@/lib/types";

const TRAVEL_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

type SubmitResult = { ok: true } | { ok: false; error: string };

type PreferencesFormProps = {
  isLocked?: boolean;
  onSubmit: (input: PreferenceInput) => Promise<SubmitResult>;
};

type FormState = {
  originRegion: string;
  tripLengthDays: string;
  budgetLevel: PreferenceInput["budgetLevel"];
  interests: PreferenceInput["interests"];
  climate: PreferenceInput["climate"];
  pace: PreferenceInput["pace"];
  travelMonth: string;
  partyType: PreferenceInput["partyType"];
};

const initialState: FormState = {
  originRegion: "",
  tripLengthDays: "6",
  budgetLevel: "medium",
  interests: [],
  climate: "mild",
  pace: "balanced",
  travelMonth: "",
  partyType: "couple",
};

function labelForValue(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function PreferencesForm({ isLocked = false, onSubmit }: PreferencesFormProps) {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLocked) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await onSubmit({
      originRegion: formState.originRegion,
      tripLengthDays: Number(formState.tripLengthDays),
      budgetLevel: formState.budgetLevel,
      interests: formState.interests,
      climate: formState.climate,
      pace: formState.pace,
      travelMonth: formState.travelMonth,
      partyType: formState.partyType,
    });

    if (!result.ok) {
      setErrorMessage(result.error);
    }

    setIsSubmitting(false);
  }

  function toggleInterest(interest: PreferenceInput["interests"][number]) {
    setFormState((current) => {
      const interests = current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest];

      return {
        ...current,
        interests,
      };
    });
  }

  return (
    <form
      className="planner-panel p-5 sm:p-7 lg:p-8"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start">
        <div>
          <p className="planner-kicker text-amber-700">
            Travel brief
          </p>
          <h2 className="mt-3 font-[family:var(--font-fraunces)] text-3xl leading-tight text-slate-900">
            Shape the kind of trip you want before we rank destinations.
          </h2>
          <p className="planner-copy mt-4 max-w-2xl text-sm leading-7 sm:text-base">
            Keep it practical: where you are leaving from, how long you have, and the mood you want.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-white/75 bg-white/55 p-4 text-sm leading-6 text-slate-600 shadow-sm">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-amber-800">
            Step 1
          </p>
          <p className="mt-3">
            A tighter brief produces a more opinionated shortlist, so each next decision feels easier.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 rounded-[1.75rem] border border-white/75 bg-[rgba(255,251,247,0.62)] p-4 sm:grid-cols-2 sm:p-5">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Where are you leaving from?
          <input
            className="planner-field text-base"
            disabled={isLocked || isSubmitting}
            name="originRegion"
            value={formState.originRegion}
            onChange={(event) => {
              setFormState((current) => ({
                ...current,
                originRegion: event.target.value,
              }));
            }}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Trip length
          <input
            className="planner-field text-base"
            min="1"
            max="21"
            name="tripLengthDays"
            type="number"
            disabled={isLocked || isSubmitting}
            value={formState.tripLengthDays}
            onChange={(event) => {
              setFormState((current) => ({
                ...current,
                tripLengthDays: event.target.value,
              }));
            }}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Budget
          <select
            className="planner-field text-base"
            disabled={isLocked || isSubmitting}
            value={formState.budgetLevel}
            onChange={(event) => {
              setFormState((current) => ({
                ...current,
                budgetLevel: event.target.value as PreferenceInput["budgetLevel"],
              }));
            }}
          >
            {BUDGET_LEVELS.map((budgetLevel) => (
              <option key={budgetLevel} value={budgetLevel}>
                {labelForValue(budgetLevel)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Climate
          <select
            className="planner-field text-base"
            disabled={isLocked || isSubmitting}
            value={formState.climate}
            onChange={(event) => {
              setFormState((current) => ({
                ...current,
                climate: event.target.value as PreferenceInput["climate"],
              }));
            }}
          >
            {CLIMATE_PREFERENCES.map((climate) => (
              <option key={climate} value={climate}>
                {labelForValue(climate)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Pace
          <select
            className="planner-field text-base"
            disabled={isLocked || isSubmitting}
            value={formState.pace}
            onChange={(event) => {
              setFormState((current) => ({
                ...current,
                pace: event.target.value as PreferenceInput["pace"],
              }));
            }}
          >
            {TRAVEL_PACES.map((pace) => (
              <option key={pace} value={pace}>
                {labelForValue(pace)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Travel month
          <select
            className="planner-field text-base"
            disabled={isLocked || isSubmitting}
            value={formState.travelMonth}
            onChange={(event) => {
              setFormState((current) => ({
                ...current,
                travelMonth: event.target.value,
              }));
            }}
          >
            <option value="">Choose a month</option>
            {TRAVEL_MONTHS.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
          Party type
          <select
            className="planner-field text-base"
            disabled={isLocked || isSubmitting}
            value={formState.partyType}
            onChange={(event) => {
              setFormState((current) => ({
                ...current,
                partyType: event.target.value as PreferenceInput["partyType"],
              }));
            }}
          >
            {PARTY_TYPES.map((partyType) => (
              <option key={partyType} value={partyType}>
                {labelForValue(partyType)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="mt-6 rounded-[1.75rem] border border-white/75 bg-white/55 p-4 sm:p-5">
        <legend className="text-sm font-medium text-slate-700">Interests</legend>
        <p className="planner-copy mt-2 text-sm leading-6">
          Pick the experiences you want the shortlist to optimize around.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          {DEFAULT_INTERESTS.map((interest) => {
            const isChecked = formState.interests.includes(interest);

            return (
              <label
                data-checked={isChecked ? "true" : "false"}
                key={interest}
                className="planner-chip cursor-pointer px-4 py-2 text-sm font-medium"
              >
                <input
                  checked={isChecked}
                  className="sr-only"
                  disabled={isLocked || isSubmitting}
                  type="checkbox"
                  onChange={() => {
                    toggleInterest(interest);
                  }}
                />
                {labelForValue(interest)}
              </label>
            );
          })}
        </div>
      </fieldset>

      {errorMessage ? (
        <p
          aria-live="polite"
          className="planner-alert mt-6 px-4 py-3 text-sm text-rose-700"
        >
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-4 border-t border-white/65 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="max-w-md text-sm leading-6 text-slate-500">
            We use this brief to rank a focused shortlist instead of generating a generic catch-all
            plan.
          </p>
          <p aria-live="polite" className="planner-status text-sm leading-6">
            {isLocked && !isSubmitting
              ? "Planner is busy completing the current step."
              : isSubmitting
                ? "Finding destinations..."
                : "Ready to rank a focused shortlist."}
          </p>
        </div>
        <button
          className="planner-primary-button inline-flex w-full items-center justify-center px-6 py-3 text-sm font-semibold sm:w-auto"
          disabled={isLocked || isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Finding destinations..." : "Find destinations"}
        </button>
      </div>
    </form>
  );
}
