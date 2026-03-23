# LangGraph Travel Agent Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers/executing-plans` to implement this plan task-by-task.

**Goal:** Convert the current step-based travel planner into a LangGraph-driven travel agent that keeps the existing UI while adding graph orchestration, human-in-the-loop confirmation, and LLM-powered preference clarification, recommendation reasoning, and itinerary polishing.

**Architecture:** Keep the Next.js App Router UI and current component flow, but move orchestration behind `src/app/actions.ts` into a LangGraph graph with explicit state, nodes, tools, and interrupt/resume boundaries. Preserve the current deterministic recommendation and itinerary logic as tools first, then add LLM-backed nodes for missing-info handling, recommendation reasoning, and itinerary polishing.

**Tech Stack:** Next.js, React, TypeScript, Zod, LangGraph JS/TS, LangChain core packages, Vitest, React Testing Library, Playwright

---

### Task 1: Install LangGraph and graph-support dependencies

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

**Step 1: Write the failing smoke test placeholder**
Create a test file that imports a future graph entrypoint and fails because the module does not exist yet.

```ts
import { describe, expect, it } from "vitest";

describe("travel graph module", () => {
  it("exposes a graph factory", async () => {
    await expect(import("@/agent/travel-graph/graph")).resolves.toHaveProperty("createTravelGraph");
  });
});
```

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/agent/graph-smoke.test.ts
```
Expected: FAIL because the graph module does not exist yet

**Step 3: Install the minimal packages**
Add the packages needed for the migration:
- `@langchain/langgraph`
- `@langchain/core`
- one chat model adapter you intend to use first

**Step 4: Run install verification**
Run:
```bash
npm install
```
Expected: PASS and lockfile updated

**Step 5: Commit**
```bash
git add package.json package-lock.json tests/agent/graph-smoke.test.ts
git commit -m "chore: add langgraph dependencies for travel agent"
```

### Task 2: Define graph state, phases, and shared agent contracts

**Files:**
- Create: `src/agent/travel-graph/state.ts`
- Create: `src/agent/travel-graph/types.ts`
- Modify: `src/lib/types.ts`
- Test: `tests/agent/state.test.ts`

**Step 1: Write the failing test**
Add tests asserting:
- graph phases include recommendation-ready and awaiting-confirmation
- state can hold preferences, recommendations, selected destination, itinerary, and messages
- thread identifier is required

```ts
import { describe, expect, it } from "vitest";

import { createInitialTravelAgentState, TravelAgentPhase } from "@/agent/travel-graph/state";

describe("travel graph state", () => {
  it("creates a state object with a thread id and initial phase", () => {
    const state = createInitialTravelAgentState("thread-1");

    expect(state.threadId).toBe("thread-1");
    expect(state.phase).toBe("collecting_preferences" satisfies TravelAgentPhase);
  });
});
```

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/agent/state.test.ts
```
Expected: FAIL because the state module does not exist yet

**Step 3: Write minimal implementation**
- Add `TravelAgentPhase`
- Add `TravelAgentState`
- Add initial-state factory
- Extend shared app types only where needed for graph outputs

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test -- tests/agent/state.test.ts
```
Expected: PASS

**Step 5: Commit**
```bash
git add src/agent/travel-graph/state.ts src/agent/travel-graph/types.ts src/lib/types.ts tests/agent/state.test.ts
git commit -m "feat: define langgraph state contracts for travel agent"
```

### Task 3: Add graph-safe LLM adapter and prompt contracts

**Files:**
- Modify: `src/server/llm/travel-model.ts`
- Modify: `src/server/llm/prompts.ts`
- Create: `src/server/llm/create-chat-model.ts`
- Test: `tests/agent/llm-adapter.test.ts`

**Step 1: Write the failing test**
Add tests asserting:
- the adapter can summarize missing fields
- the adapter can produce recommendation reasoning
- the adapter can polish itinerary text
- the adapter is mockable and does not leak provider-specific fields

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/agent/llm-adapter.test.ts
```
Expected: FAIL because the new adapter contract is incomplete

**Step 3: Write minimal implementation**
- keep a small interface around chat-completion calls
- add prompt helpers for:
  - missing-info follow-up
  - recommendation rationale
  - itinerary polish
- make the adapter injectable for tests

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test -- tests/agent/llm-adapter.test.ts
```
Expected: PASS

**Step 5: Commit**
```bash
git add src/server/llm/travel-model.ts src/server/llm/prompts.ts src/server/llm/create-chat-model.ts tests/agent/llm-adapter.test.ts
git commit -m "feat: add graph-ready llm adapter contracts"
```

### Task 4: Wrap deterministic recommendation and itinerary logic as graph tools

**Files:**
- Create: `src/agent/travel-graph/tools/recommendation-tool.ts`
- Create: `src/agent/travel-graph/tools/itinerary-tool.ts`
- Test: `tests/agent/tools.test.ts`

**Step 1: Write the failing test**
Add tests asserting:
- recommendation tool returns the same ranked shape as the existing recommendation module
- itinerary tool returns the same itinerary structure as the existing generator

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/agent/tools.test.ts
```
Expected: FAIL because the graph tools do not exist yet

**Step 3: Write minimal implementation**
- wrap `recommendDestinations()`
- wrap `generateItinerary()`
- keep them thin and deterministic

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test -- tests/agent/tools.test.ts
```
Expected: PASS

**Step 5: Commit**
```bash
git add src/agent/travel-graph/tools/recommendation-tool.ts src/agent/travel-graph/tools/itinerary-tool.ts tests/agent/tools.test.ts
git commit -m "feat: expose deterministic planner logic as graph tools"
```

### Task 5: Implement preference-ingest and validation nodes

**Files:**
- Create: `src/agent/travel-graph/nodes/ingest-preferences.ts`
- Create: `src/agent/travel-graph/nodes/validate-preferences.ts`
- Test: `tests/agent/validate-preferences-node.test.ts`

**Step 1: Write the failing test**
Add tests asserting:
- valid structured preferences move the graph toward recommendation phase
- missing fields are detected and recorded in `missingFields`
- invalid payloads move the graph into an error or clarification state

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/agent/validate-preferences-node.test.ts
```
Expected: FAIL because the nodes do not exist yet

**Step 3: Write minimal implementation**
- map UI input into graph state
- validate with existing zod schema
- produce a normalized set of missing fields for the LLM clarification node

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test -- tests/agent/validate-preferences-node.test.ts
```
Expected: PASS

**Step 5: Commit**
```bash
git add src/agent/travel-graph/nodes/ingest-preferences.ts src/agent/travel-graph/nodes/validate-preferences.ts tests/agent/validate-preferences-node.test.ts
git commit -m "feat: add travel graph preference ingestion and validation nodes"
```

### Task 6: Implement missing-info clarification node with LLM output

**Files:**
- Create: `src/agent/travel-graph/nodes/clarify-missing-info.ts`
- Test: `tests/agent/clarify-missing-info-node.test.ts`

**Step 1: Write the failing test**
Add tests asserting:
- when fields are missing, the node writes an assistant clarification message
- the message references the missing fields in a usable way
- no clarification message is emitted when nothing is missing

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/agent/clarify-missing-info-node.test.ts
```
Expected: FAIL because the clarification node does not exist yet

**Step 3: Write minimal implementation**
- call the LLM adapter with `missingFields`
- append the generated clarification prompt to graph messages
- set phase to `collecting_preferences`

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test -- tests/agent/clarify-missing-info-node.test.ts
```
Expected: PASS

**Step 5: Commit**
```bash
git add src/agent/travel-graph/nodes/clarify-missing-info.ts tests/agent/clarify-missing-info-node.test.ts
git commit -m "feat: add llm clarification node for missing preferences"
```

### Task 7: Implement recommendation node with LLM rationale enrichment

**Files:**
- Create: `src/agent/travel-graph/nodes/recommend-destinations.ts`
- Test: `tests/agent/recommend-destinations-node.test.ts`

**Step 1: Write the failing test**
Add tests asserting:
- the node calls the recommendation tool
- the node enriches recommendation reasons using the LLM adapter
- the node sets phase to `recommendation_ready`

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/agent/recommend-destinations-node.test.ts
```
Expected: FAIL because the recommendation node does not exist yet

**Step 3: Write minimal implementation**
- call the deterministic recommendation tool
- call the LLM adapter to rewrite or enrich recommendation reasoning
- write recommendations to graph state

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test -- tests/agent/recommend-destinations-node.test.ts
```
Expected: PASS

**Step 5: Commit**
```bash
git add src/agent/travel-graph/nodes/recommend-destinations.ts tests/agent/recommend-destinations-node.test.ts
git commit -m "feat: add llm-enriched recommendation node"
```

### Task 8: Implement confirmation interrupt and resume contracts

**Files:**
- Create: `src/agent/travel-graph/nodes/await-confirmation.ts`
- Create: `src/agent/travel-graph/nodes/apply-confirmation.ts`
- Test: `tests/agent/confirmation-flow.test.ts`

**Step 1: Write the failing test**
Add tests asserting:
- recommendation-ready state interrupts for human confirmation
- resume input with a valid destination id moves the graph forward
- invalid destination ids return a safe error path

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/agent/confirmation-flow.test.ts
```
Expected: FAIL because the confirmation nodes do not exist yet

**Step 3: Write minimal implementation**
- model the interrupt point explicitly
- validate the selected destination against current graph recommendations
- store the selected destination in state on resume

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test -- tests/agent/confirmation-flow.test.ts
```
Expected: PASS

**Step 5: Commit**
```bash
git add src/agent/travel-graph/nodes/await-confirmation.ts src/agent/travel-graph/nodes/apply-confirmation.ts tests/agent/confirmation-flow.test.ts
git commit -m "feat: add human-in-the-loop confirmation flow"
```

### Task 9: Implement itinerary node with LLM polishing

**Files:**
- Create: `src/agent/travel-graph/nodes/generate-itinerary.ts`
- Test: `tests/agent/generate-itinerary-node.test.ts`

**Step 1: Write the failing test**
Add tests asserting:
- the itinerary tool is called with confirmed destination and preferences
- itinerary text is polished by the LLM adapter
- phase becomes `completed`

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/agent/generate-itinerary-node.test.ts
```
Expected: FAIL because the itinerary node does not exist yet

**Step 3: Write minimal implementation**
- call the deterministic itinerary tool
- run each itinerary day through the LLM adapter or a batched polish step
- persist the polished itinerary in state

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test -- tests/agent/generate-itinerary-node.test.ts
```
Expected: PASS

**Step 5: Commit**
```bash
git add src/agent/travel-graph/nodes/generate-itinerary.ts tests/agent/generate-itinerary-node.test.ts
git commit -m "feat: add itinerary generation node with llm polish"
```

### Task 10: Compose the LangGraph graph and in-memory checkpointer

**Files:**
- Create: `src/agent/travel-graph/checkpointer.ts`
- Create: `src/agent/travel-graph/graph.ts`
- Test: `tests/agent/graph.test.ts`

**Step 1: Write the failing test**
Add tests asserting:
- a graph instance can be created
- initial invoke can reach recommendation-ready for valid preferences
- interrupted runs can be resumed with thread id

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/agent/graph.test.ts
```
Expected: FAIL because the graph composition does not exist yet

**Step 3: Write minimal implementation**
- wire node transitions in one graph
- add an in-memory checkpointer for development
- expose helpers such as `createTravelGraph()` and `getTravelCheckpointer()`

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test -- tests/agent/graph.test.ts
```
Expected: PASS

**Step 5: Commit**
```bash
git add src/agent/travel-graph/checkpointer.ts src/agent/travel-graph/graph.ts tests/agent/graph.test.ts
git commit -m "feat: compose langgraph workflow for travel agent"
```

### Task 11: Replace direct server actions with graph-backed actions

**Files:**
- Modify: `src/app/actions.ts`
- Create: `src/agent/travel-graph/action-mappers.ts`
- Test: `tests/integration/actions.test.ts`

**Step 1: Write the failing test**
Extend integration tests to assert:
- start action returns graph phase and thread id
- confirmation action resumes a thread instead of recomputing outside the graph
- itinerary action reads from graph state or resumes the graph

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/integration/actions.test.ts
```
Expected: FAIL because existing actions still bypass the graph

**Step 3: Write minimal implementation**
- replace direct recommendation/generation calls with graph invoke/resume
- add stable response mappers for the current UI
- keep error normalization behavior

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test -- tests/integration/actions.test.ts
```
Expected: PASS

**Step 5: Commit**
```bash
git add src/app/actions.ts src/agent/travel-graph/action-mappers.ts tests/integration/actions.test.ts
git commit -m "feat: route travel planner actions through langgraph"
```

### Task 12: Adapt the step shell to graph phase and thread identifiers

**Files:**
- Modify: `src/components/step-shell.tsx`
- Modify: `src/lib/types.ts`
- Test: `tests/component/page-flow.test.tsx`

**Step 1: Write the failing test**
Extend the page-flow test to assert:
- thread id is retained after recommendation step
- current step is derived from graph phase
- confirmation resumes the existing thread rather than starting over

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- tests/component/page-flow.test.tsx
```
Expected: FAIL because the UI still assumes local step derivation from raw payloads only

**Step 3: Write minimal implementation**
- store `threadId` in client state
- drive current step from server-provided phase
- keep existing layout and visual design intact

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test -- tests/component/page-flow.test.tsx
```
Expected: PASS

**Step 5: Commit**
```bash
git add src/components/step-shell.tsx src/lib/types.ts tests/component/page-flow.test.tsx
git commit -m "feat: connect planner shell to langgraph phase state"
```

### Task 13: Update component-level UI contracts for agent responses

**Files:**
- Modify: `src/components/preferences-form.tsx`
- Modify: `src/components/recommendation-list.tsx`
- Modify: `src/components/confirmation-panel.tsx`
- Modify: `src/components/itinerary-view.tsx`
- Test: `tests/component/preferences-form.test.tsx`
- Test: `tests/component/recommendation-list.test.tsx`
- Test: `tests/component/confirmation-and-itinerary.test.tsx`

**Step 1: Write the failing tests**
Update component tests to assert:
- clarification messages can be shown when the graph asks for missing info
- confirmation flow keeps the same thread across requests
- itinerary view can show agent-polished copy

**Step 2: Run test to verify they fail**
Run:
```bash
npm run test -- tests/component/preferences-form.test.tsx tests/component/recommendation-list.test.tsx tests/component/confirmation-and-itinerary.test.tsx
```
Expected: FAIL because components do not yet understand the richer agent contract

**Step 3: Write minimal implementation**
- surface clarification/error messages from the graph
- keep existing busy-state protections
- display polished itinerary copy without redesigning the layout

**Step 4: Run test to verify they pass**
Run:
```bash
npm run test -- tests/component/preferences-form.test.tsx tests/component/recommendation-list.test.tsx tests/component/confirmation-and-itinerary.test.tsx
```
Expected: PASS

**Step 5: Commit**
```bash
git add src/components/preferences-form.tsx src/components/recommendation-list.tsx src/components/confirmation-panel.tsx src/components/itinerary-view.tsx tests/component/preferences-form.test.tsx tests/component/recommendation-list.test.tsx tests/component/confirmation-and-itinerary.test.tsx
git commit -m "feat: adapt planner ui to graph-driven agent responses"
```

### Task 14: Add end-to-end coverage for graph-driven interrupt/resume

**Files:**
- Modify: `tests/e2e/mvp-happy-path.spec.ts`
- Modify: `tests/e2e/mvp-validation.spec.ts`
- Create: `tests/e2e/mvp-clarification.spec.ts`

**Step 1: Write the failing test**
Add E2E coverage for:
- current happy path using graph-backed actions
- missing-field clarification path
- recommendation confirmation resume path

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test:e2e
```
Expected: FAIL because the browser flow is not yet aligned to the graph-backed contracts

**Step 3: Adjust implementation only as needed**
- fix state persistence bugs
- fix thread-id handoff bugs
- fix missing clarification rendering

**Step 4: Run test to verify it passes**
Run:
```bash
npm run test:e2e
```
Expected: PASS

**Step 5: Commit**
```bash
git add tests/e2e/mvp-happy-path.spec.ts tests/e2e/mvp-validation.spec.ts tests/e2e/mvp-clarification.spec.ts
git commit -m "test: add e2e coverage for langgraph travel flow"
```

### Task 15: Final verification and migration cleanup

**Files:**
- Modify: `README.md`
- Modify: `src/app/actions.ts`
- Modify: `src/agent/travel-graph/**/*`

**Step 1: Verify lint**
Run:
```bash
npm run lint
```
Expected: PASS

**Step 2: Verify typecheck**
Run:
```bash
npx tsc --noEmit
```
Expected: PASS

**Step 3: Verify tests**
Run:
```bash
npm run test
```
Expected: PASS

**Step 4: Verify build**
Run:
```bash
npm run build
```
Expected: PASS

**Step 5: Verify E2E**
Run:
```bash
npm run test:e2e
```
Expected: PASS

**Step 6: Update README**
- document required env vars for the chat model
- document that confirmation is a graph interrupt/resume boundary
- document that the current checkpointer is in-memory only

**Step 7: Commit**
```bash
git add README.md src/app/actions.ts src/agent/travel-graph tests
git commit -m "chore: verify and document langgraph travel agent migration"
```

## Recommended State Shape

```ts
type TravelAgentPhase =
  | "collecting_preferences"
  | "clarifying_preferences"
  | "recommendation_ready"
  | "awaiting_confirmation"
  | "generating_itinerary"
  | "completed"
  | "error";

type TravelAgentMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type TravelAgentState = {
  threadId: string;
  phase: TravelAgentPhase;
  messages: TravelAgentMessage[];
  preferences?: PreferenceInput;
  missingFields?: string[];
  recommendations?: DestinationRecommendation[];
  selectedDestination?: ConfirmedDestination;
  itinerary?: GeneratedItinerary;
  lastError?: string;
};
```

## Notes for the Implementer

- Keep the current UI structure. This migration is about orchestration, not redesign.
- Use the existing deterministic recommendation and itinerary logic as graph tools first.
- Add LLM behavior only in the approved places: clarification, recommendation rationale, itinerary polish.
- Keep the first checkpointer in-memory; do not add Redis or a database in this migration.
- Avoid coupling React components directly to LangGraph internals; keep the contract inside `src/app/actions.ts` and graph mappers.
- Prefer stable, typed action responses with `phase`, `threadId`, and user-facing payloads.
