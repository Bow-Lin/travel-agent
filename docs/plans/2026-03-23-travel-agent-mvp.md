# Travel Agent MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers/executing-plans` to implement this plan task-by-task.

**Goal:** Build a single Next.js MVP that collects user travel preferences, recommends destinations, lets the user confirm one destination, and generates a simple itinerary.

**Architecture:** Use a single Next.js App Router application with React, TypeScript, and Tailwind. Keep business logic in pure server-side modules, expose orchestration through server actions, and keep the UI as a step-based single-page flow. Recommendation ranking and itinerary structure should be deterministic in v1, with any future LLM integration isolated behind a small adapter.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Zod, Vitest, React Testing Library, Playwright

---

### Task 1: Bootstrap the app and test toolchain

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`

**Step 1: Add the failing baseline verification command**
Run:
```bash
npm run test
```
Expected: command fails because test setup is not present yet

**Step 2: Scaffold the Next.js app and test tooling**
- Add Next.js with App Router
- Add Tailwind
- Add Vitest and Testing Library
- Add Playwright

**Step 3: Add minimal app shell**
- Render a placeholder page so the app builds

**Step 4: Verify toolchain**
Run:
```bash
npm run lint
npm run build
```
Expected: both commands pass

**Step 5: Commit**
```bash
git add .
git commit -m "chore: scaffold app and testing toolchain"
```

### Task 2: Define shared types and validation

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/constants.ts`
- Create: `src/lib/validation.ts`
- Test: `tests/unit/validation.test.ts`

**Step 1: Write the failing test**
Add tests for:
- valid preference input passes
- missing required fields fail
- invalid numeric ranges fail

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/unit/validation.test.ts
```
Expected: FAIL because validation modules do not exist yet

**Step 3: Write minimal implementation**
- Add `PreferenceInput`
- Add supporting enums/constants
- Add Zod schema for the preference form

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test -- tests/unit/validation.test.ts
```
Expected: PASS

**Step 5: Commit**
```bash
git add tests/unit/validation.test.ts src/lib/types.ts src/lib/constants.ts src/lib/validation.ts
git commit -m "feat: add shared travel planner types and validation"
```

### Task 3: Add a static destination catalog

**Files:**
- Create: `src/server/recommendations/destination-catalog.ts`
- Test: `tests/unit/destination-catalog.test.ts`

**Step 1: Write the failing test**
Add tests asserting:
- catalog contains at least 10 destinations
- every destination has required fields
- budget/climate/tag data is present

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/unit/destination-catalog.test.ts
```
Expected: FAIL because catalog file does not exist

**Step 3: Write minimal implementation**
- Add 10-20 destinations with structured metadata
- Keep metadata simple and consistent

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test -- tests/unit/destination-catalog.test.ts
```
Expected: PASS

**Step 5: Commit**
```bash
git add tests/unit/destination-catalog.test.ts src/server/recommendations/destination-catalog.ts
git commit -m "feat: add static destination catalog for mvp recommendations"
```

### Task 4: Implement destination scoring

**Files:**
- Create: `src/server/recommendations/score-destination.ts`
- Test: `tests/unit/score-destination.test.ts`

**Step 1: Write the failing test**
Add tests asserting:
- budget match increases score
- climate match increases score
- interest overlap increases score
- mismatched inputs lower score

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/unit/score-destination.test.ts
```
Expected: FAIL because scoring function does not exist

**Step 3: Write minimal implementation**
- Implement a deterministic score function
- Keep logic transparent and easy to inspect

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test -- tests/unit/score-destination.test.ts
```
Expected: PASS

**Step 5: Commit**
```bash
git add tests/unit/score-destination.test.ts src/server/recommendations/score-destination.ts
git commit -m "feat: add deterministic destination scoring"
```

### Task 5: Implement recommendation ranking

**Files:**
- Create: `src/server/recommendations/recommend-destinations.ts`
- Test: `tests/unit/recommend-destinations.test.ts`

**Step 1: Write the failing test**
Add tests asserting:
- returns 3-5 recommendations
- results are ranked by score
- each recommendation includes match reasons
- output shape matches shared types

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/unit/recommend-destinations.test.ts
```
Expected: FAIL because recommendation function does not exist

**Step 3: Write minimal implementation**
- load catalog
- score each destination
- sort by score
- map top results into recommendation cards

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test -- tests/unit/recommend-destinations.test.ts
```
Expected: PASS

**Step 5: Commit**
```bash
git add tests/unit/recommend-destinations.test.ts src/server/recommendations/recommend-destinations.ts
git commit -m "feat: add recommendation ranking and match reasons"
```

### Task 6: Implement itinerary generation

**Files:**
- Create: `src/server/itinerary/generate-itinerary.ts`
- Test: `tests/unit/generate-itinerary.test.ts`

**Step 1: Write the failing test**
Add tests asserting:
- itinerary length equals requested trip length
- itinerary references the chosen destination
- pace changes the density of activities
- interests influence the day themes

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/unit/generate-itinerary.test.ts
```
Expected: FAIL because itinerary generator does not exist

**Step 3: Write minimal implementation**
- Generate one day object per trip day
- Use template-driven day structures
- Keep output deterministic

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test -- tests/unit/generate-itinerary.test.ts
```
Expected: PASS

**Step 5: Commit**
```bash
git add tests/unit/generate-itinerary.test.ts src/server/itinerary/generate-itinerary.ts
git commit -m "feat: add itinerary generator for confirmed destinations"
```

### Task 7: Add optional LLM boundary for future enhancement

**Files:**
- Create: `src/server/llm/travel-model.ts`
- Create: `src/server/llm/prompts.ts`
- Test: `tests/unit/travel-model.test.ts`

**Step 1: Write the failing test**
Add tests asserting:
- adapter exposes a stable interface
- adapter can be mocked in tests
- no provider-specific logic leaks into domain modules

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/unit/travel-model.test.ts
```
Expected: FAIL because adapter does not exist

**Step 3: Write minimal implementation**
- add a tiny interface for text enhancement
- leave concrete provider integration empty or mocked

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test -- tests/unit/travel-model.test.ts
```
Expected: PASS

**Step 5: Commit**
```bash
git add tests/unit/travel-model.test.ts src/server/llm/travel-model.ts src/server/llm/prompts.ts
git commit -m "feat: add optional llm adapter boundary"
```

### Task 8: Add server actions for MVP orchestration

**Files:**
- Create: `src/app/actions.ts`
- Create: `src/server/errors.ts`
- Test: `tests/integration/actions.test.ts`

**Step 1: Write the failing test**
Add tests asserting:
- preference submission returns recommendations
- confirmation returns selected destination data
- itinerary generation returns structured day data
- invalid input returns safe errors

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/integration/actions.test.ts
```
Expected: FAIL because actions do not exist

**Step 3: Write minimal implementation**
- implement action wrappers around domain functions
- validate input at the boundary
- normalize error messages

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test -- tests/integration/actions.test.ts
```
Expected: PASS

**Step 5: Commit**
```bash
git add tests/integration/actions.test.ts src/app/actions.ts src/server/errors.ts
git commit -m "feat: add server actions for recommendation and itinerary flow"
```

### Task 9: Add the wizard shell page

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/step-shell.tsx`
- Test: `tests/component/page-flow.test.tsx`

**Step 1: Write the failing test**
Add tests asserting:
- page starts on preferences step
- page can transition to recommendations state
- page can transition to itinerary state after selection

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/component/page-flow.test.tsx
```
Expected: FAIL because wizard shell is incomplete

**Step 3: Write minimal implementation**
- add top-level step container
- add local orchestration state
- render placeholder content for each step

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test -- tests/component/page-flow.test.tsx
```
Expected: PASS

**Step 5: Commit**
```bash
git add tests/component/page-flow.test.tsx src/app/page.tsx src/components/step-shell.tsx
git commit -m "feat: add single-page travel planner shell"
```

### Task 10: Add the preferences form

**Files:**
- Create: `src/components/preferences-form.tsx`
- Test: `tests/component/preferences-form.test.tsx`

**Step 1: Write the failing test**
Add tests asserting:
- all required fields render
- invalid submission shows feedback
- valid submission calls the recommendation action path
- submit button respects loading state

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/component/preferences-form.test.tsx
```
Expected: FAIL because form component does not exist

**Step 3: Write minimal implementation**
- build structured form controls
- wire submit handling
- surface validation feedback

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test -- tests/component/preferences-form.test.tsx
```
Expected: PASS

**Step 5: Commit**
```bash
git add tests/component/preferences-form.test.tsx src/components/preferences-form.tsx
git commit -m "feat: add structured travel preference form"
```

### Task 11: Add destination recommendation UI

**Files:**
- Create: `src/components/destination-card.tsx`
- Create: `src/components/recommendation-list.tsx`
- Test: `tests/component/recommendation-list.test.tsx`

**Step 1: Write the failing test**
Add tests asserting:
- recommendation cards render name, summary, reasons, and budget
- selection button is shown
- clicking selection triggers confirmation flow

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/component/recommendation-list.test.tsx
```
Expected: FAIL because recommendation components do not exist

**Step 3: Write minimal implementation**
- render cards from recommendation data
- expose one CTA per card

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test -- tests/component/recommendation-list.test.tsx
```
Expected: PASS

**Step 5: Commit**
```bash
git add tests/component/recommendation-list.test.tsx src/components/destination-card.tsx src/components/recommendation-list.tsx
git commit -m "feat: add destination recommendation cards"
```

### Task 12: Add destination confirmation and itinerary view

**Files:**
- Create: `src/components/confirmation-panel.tsx`
- Create: `src/components/itinerary-view.tsx`
- Test: `tests/component/confirmation-and-itinerary.test.tsx`

**Step 1: Write the failing test**
Add tests asserting:
- selected destination summary renders
- generate itinerary action can be triggered
- itinerary days render in order
- user can move back if needed

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/component/confirmation-and-itinerary.test.tsx
```
Expected: FAIL because confirmation and itinerary components do not exist

**Step 3: Write minimal implementation**
- add confirmation panel
- add itinerary rendering component
- show day-by-day sections

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test -- tests/component/confirmation-and-itinerary.test.tsx
```
Expected: PASS

**Step 5: Commit**
```bash
git add tests/component/confirmation-and-itinerary.test.tsx src/components/confirmation-panel.tsx src/components/itinerary-view.tsx
git commit -m "feat: add confirmation panel and itinerary results view"
```

### Task 13: Add end-to-end MVP coverage

**Files:**
- Create: `tests/e2e/mvp-happy-path.spec.ts`
- Create: `tests/e2e/mvp-validation.spec.ts`

**Step 1: Write the failing test**
Add E2E coverage for:
- happy path from preferences to itinerary
- validation failure and correction path

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test:e2e
```
Expected: FAIL because full UI flow is not complete yet

**Step 3: Adjust implementation only as needed**
- fix wiring gaps
- fix loading and transition issues
- keep changes minimal

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test:e2e
```
Expected: PASS

**Step 5: Commit**
```bash
git add tests/e2e/mvp-happy-path.spec.ts tests/e2e/mvp-validation.spec.ts
git commit -m "test: add end-to-end coverage for mvp planner flow"
```

### Task 14: Final verification and MVP polish

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/*.tsx`
- Modify: `src/app/globals.css`

**Step 1: Verify lint**
Run:
```bash
npm run lint
```
Expected: PASS

**Step 2: Verify tests**
Run:
```bash
npm run test
```
Expected: PASS

**Step 3: Verify E2E**
Run:
```bash
npm run test:e2e
```
Expected: PASS

**Step 4: Verify production build**
Run:
```bash
npm run build
```
Expected: PASS

**Step 5: Do manual QA**
Check:
- desktop layout
- mobile layout
- loading state
- error state
- back navigation
- duplicate submit prevention

**Step 6: Commit**
```bash
git add .
git commit -m "chore: polish mvp states and verify production build"
```

## State Model

```ts
type PreferenceInput = {
  originRegion: string;
  tripLengthDays: number;
  budgetLevel: "low" | "medium" | "high";
  interests: string[];
  climate: "warm" | "mild" | "cold" | "any";
  pace: "relaxed" | "balanced" | "packed";
  travelMonth: string;
  partyType: "solo" | "couple" | "friends" | "family";
};

type DestinationRecommendation = {
  id: string;
  name: string;
  country: string;
  summary: string;
  matchReasons: string[];
  budgetBand: "low" | "medium" | "high";
  bestMonths: string[];
  score: number;
};

type ConfirmedDestination = {
  destinationId: string;
  name: string;
  country: string;
};

type ItineraryDay = {
  day: number;
  theme: string;
  morning: string;
  afternoon: string;
  evening: string;
};
```

## API / Action Boundaries

- `recommendDestinationsAction(input: PreferenceInput)`
- `confirmDestinationAction(destinationId: string, recommendations: DestinationRecommendation[])`
- `generateItineraryAction(input: { preferences: PreferenceInput; destination: ConfirmedDestination })`

## Deferred for v1

- auth
- database
- saved trips
- maps
- booking APIs
- live pricing
- chat interface
- multi-city planning
- user history personalization

## Notes for the Implementer

- Keep recommendation ranking deterministic.
- Keep itinerary generation deterministic before any LLM enhancement.
- Do not put recommendation logic inside React components.
- Do not add global state management unless the page state becomes unmanageable.
- Do not introduce a DB in this MVP.
