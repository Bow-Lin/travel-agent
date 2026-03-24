"use client";

import { useEffect, useId, useRef, useState } from "react";

import {
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
  helperMessage?: string | null;
  isLocked?: boolean;
  onSubmit: (input: PreferenceInput) => Promise<SubmitResult>;
};

type FormState = {
  originRegion: string;
  tripLengthDays: string;
  budgetMin: string;
  budgetMax: string;
  destinationScope: PreferenceInput["destinationScope"];
  additionalRequirements: string;
  interests: PreferenceInput["interests"];
  climate: PreferenceInput["climate"];
  pace: PreferenceInput["pace"];
  travelMonth: string;
  partyType: PreferenceInput["partyType"];
};

const initialState: FormState = {
  originRegion: "",
  tripLengthDays: "6",
  budgetMin: "5000",
  budgetMax: "15000",
  destinationScope: "overseas",
  additionalRequirements: "",
  interests: [],
  climate: "mild",
  pace: "balanced",
  travelMonth: "",
  partyType: "couple",
};

function labelForValue(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function PreferencesForm({ helperMessage = null, isLocked = false, onSubmit }: PreferencesFormProps) {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [draftAdditionalRequirements, setDraftAdditionalRequirements] = useState(
    initialState.additionalRequirements,
  );
  const [isRequirementsDialogOpen, setIsRequirementsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const additionalRequirementsTriggerRef = useRef<HTMLButtonElement | null>(null);
  const additionalRequirementsId = useId();
  const additionalRequirementsTitleId = useId();
  const additionalRequirementsDescriptionId = useId();
  const isInteractionDisabled = isLocked || isSubmitting;

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isRequirementsDialogOpen) {
      if (!dialog.open) {
        if (typeof dialog.showModal === "function") {
          dialog.showModal();
        } else {
          dialog.setAttribute("open", "");
        }
      }

      return;
    }

    if (!dialog.open) {
      return;
    }

    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }, [isRequirementsDialogOpen]);

  function openAdditionalRequirementsDialog() {
    if (isInteractionDisabled) {
      return;
    }

    setDraftAdditionalRequirements(formState.additionalRequirements);
    setIsRequirementsDialogOpen(true);
  }

  function restoreAdditionalRequirementsTriggerFocus() {
    const trigger = additionalRequirementsTriggerRef.current;

    if (!trigger) {
      return;
    }

    setTimeout(() => {
      trigger.focus();
    }, 0);
  }

  function closeAdditionalRequirementsDialog() {
    setIsRequirementsDialogOpen(false);
    restoreAdditionalRequirementsTriggerFocus();
  }

  function handleAdditionalRequirementsCancel() {
    setDraftAdditionalRequirements(formState.additionalRequirements);
    closeAdditionalRequirementsDialog();
  }

  function handleAdditionalRequirementsSave() {
    const nextRequirements = draftAdditionalRequirements.trim();

    setFormState((current) => ({
      ...current,
      additionalRequirements: nextRequirements,
    }));
    setDraftAdditionalRequirements(nextRequirements);
    closeAdditionalRequirementsDialog();
  }

  function handleAdditionalRequirementsClear() {
    setDraftAdditionalRequirements("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isInteractionDisabled) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await onSubmit({
      originRegion: formState.originRegion,
      tripLengthDays: Number(formState.tripLengthDays),
      budgetMin: Number(formState.budgetMin),
      budgetMax: Number(formState.budgetMax),
      destinationScope: formState.destinationScope,
      additionalRequirements: formState.additionalRequirements,
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
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
        <div>
          <p className="planner-kicker text-amber-700">Travel brief</p>
          <h2 className="mt-3 font-[family:var(--font-fraunces)] text-3xl leading-tight text-slate-900">
            Shape the kind of trip you want before we rank destinations.
          </h2>
          <p className="planner-copy mt-4 max-w-2xl text-sm leading-7 sm:text-base">
            Keep it practical: where you are leaving from, how long you have, and the mood you want.
          </p>
        </div>

        <div className="planner-note text-sm leading-6 text-slate-600">
          <p className="planner-kicker text-amber-800">Step 1</p>
          <p className="mt-3">
            A tighter brief produces a more opinionated shortlist, so each next decision feels easier.
          </p>
        </div>
      </div>

      <div className="planner-card-subtle mt-8 grid gap-5 p-4 sm:grid-cols-2 sm:p-5">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Where are you leaving from?
          <input
            className="planner-field text-base"
            disabled={isInteractionDisabled}
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
            disabled={isInteractionDisabled}
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
          Budget minimum (CNY)
          <input
            className="planner-field text-base"
            type="number"
            min="0"
            disabled={isInteractionDisabled}
            value={formState.budgetMin}
            onChange={(event) => {
              setFormState((current) => ({
                ...current,
                budgetMin: event.target.value,
              }));
            }}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Budget maximum (CNY)
          <input
            className="planner-field text-base"
            type="number"
            min="0"
            disabled={isInteractionDisabled}
            value={formState.budgetMax}
            onChange={(event) => {
              setFormState((current) => ({
                ...current,
                budgetMax: event.target.value,
              }));
            }}
          />
        </label>

        <fieldset className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          <legend>Destination scope</legend>
          <div
            aria-label="Destination scope"
            className="inline-flex rounded-full border border-stone-200 bg-white/80 p-1"
            role="group"
          >
            {([
              ["domestic", "Domestic"],
              ["overseas", "Overseas"],
            ] as const).map(([value, label]) => {
              const isSelected = formState.destinationScope === value;

              return (
                <button
                  key={value}
                  aria-pressed={isSelected}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isSelected ? "bg-slate-900 text-white" : "text-slate-600"
                  }`}
                  disabled={isInteractionDisabled}
                  type="button"
                  onClick={() => {
                    setFormState((current) => ({
                      ...current,
                      destinationScope: value,
                    }));
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Climate
          <select
            className="planner-field text-base"
            disabled={isInteractionDisabled}
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
            disabled={isInteractionDisabled}
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
            disabled={isInteractionDisabled}
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
            disabled={isInteractionDisabled}
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

      <fieldset className="planner-card-subtle mt-6 p-4 sm:p-5">
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
                  disabled={isInteractionDisabled}
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

      <section className="planner-card-subtle mt-6 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-slate-700">Additional requirements</p>
            <p className="planner-copy mt-2 text-sm leading-6">
              Add any notes that do not fit the structured fields, like destination constraints,
              must-have details, or context we should keep in mind.
            </p>
          </div>

          <button
            aria-expanded={isRequirementsDialogOpen}
            aria-haspopup="dialog"
            className="planner-secondary-button inline-flex items-center justify-center px-4 py-3 text-sm font-medium"
            disabled={isInteractionDisabled}
            ref={additionalRequirementsTriggerRef}
            type="button"
            onClick={openAdditionalRequirementsDialog}
          >
            {formState.additionalRequirements ? "Edit requirements" : "Add requirements"}
          </button>
        </div>

        <div className="planner-card-subtle mt-4 px-4 py-4 text-sm leading-6 text-slate-600">
          {formState.additionalRequirements ? (
            <>
              <p className="planner-kicker text-amber-800">Saved note</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {formState.additionalRequirements}
              </p>
            </>
          ) : (
            <p className="planner-copy text-sm leading-6">
              No extra requirements saved yet. Leave this blank if the structured fields already
              cover the brief.
            </p>
          )}
        </div>
      </section>

      <dialog
        aria-describedby={additionalRequirementsDescriptionId}
        aria-labelledby={additionalRequirementsTitleId}
        className="planner-dialog planner-panel p-0 text-left text-slate-900"
        ref={dialogRef}
        onCancel={(event) => {
          event.preventDefault();
          handleAdditionalRequirementsCancel();
        }}
      >
        <div className="p-5 sm:p-7">
          <p className="planner-kicker text-amber-700">Additional requirements</p>
          <h3
            className="mt-3 font-[family:var(--font-fraunces)] text-3xl leading-tight text-slate-900"
            id={additionalRequirementsTitleId}
          >
            Capture any extra constraints before we rank destinations.
          </h3>
          <p
            className="planner-copy mt-4 text-sm leading-7 sm:text-base"
            id={additionalRequirementsDescriptionId}
          >
            Keep the note concise and specific so the shortlist can use it without overpowering the
            structured fields.
          </p>

          <label className="mt-6 flex flex-col gap-2 text-sm font-medium text-slate-700">
            Additional requirements note
            <textarea
              className="planner-field planner-textarea text-base"
              disabled={isInteractionDisabled}
              id={additionalRequirementsId}
              value={draftAdditionalRequirements}
              onChange={(event) => {
                setDraftAdditionalRequirements(event.target.value);
              }}
            />
          </label>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/65 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <button
            className="planner-secondary-button inline-flex items-center justify-center px-4 py-3 text-sm font-medium"
            disabled={isInteractionDisabled || draftAdditionalRequirements.length === 0}
            type="button"
            onClick={handleAdditionalRequirementsClear}
          >
            Clear note
          </button>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              className="planner-secondary-button inline-flex items-center justify-center px-4 py-3 text-sm font-medium"
              disabled={isInteractionDisabled}
              type="button"
              onClick={handleAdditionalRequirementsCancel}
            >
              Cancel
            </button>
            <button
              className="planner-primary-button inline-flex items-center justify-center px-6 py-3 text-sm font-semibold"
              disabled={isInteractionDisabled}
              type="button"
              onClick={handleAdditionalRequirementsSave}
            >
              Save requirements
            </button>
          </div>
        </div>
      </dialog>

      {errorMessage ? (
        <p
          aria-live="polite"
          className="planner-alert mt-6 px-4 py-3 text-sm text-rose-700"
        >
          {errorMessage}
        </p>
      ) : null}

      {!errorMessage && helperMessage ? (
        <p aria-live="polite" className="planner-note mt-6 text-sm leading-6 text-amber-900">
          {helperMessage}
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
          disabled={isInteractionDisabled}
          type="submit"
        >
          {isSubmitting ? "Finding destinations..." : "Find destinations"}
        </button>
      </div>
    </form>
  );
}
