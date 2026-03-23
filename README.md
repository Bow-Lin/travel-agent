# Travel Agent

A Next.js travel planning app that is being migrated from deterministic server functions to a LangGraph-driven agent flow. The current UI remains step-based: submit travel preferences, review recommendations, confirm a destination, and generate an itinerary.

## Current agent architecture

- `src/components/step-shell.tsx` keeps the existing browser flow and stores the active `threadId`.
- `src/app/actions.ts` is the server boundary between the UI and the graph runtime.
- `src/agent/travel-graph/` contains the agent state, nodes, tools, graph runtime, and in-memory checkpointer.
- `src/server/recommendations/` and `src/server/itinerary/` still provide deterministic tools used by the graph.
- `src/server/llm/` exposes the LLM adapter used for clarification, recommendation reasoning, and itinerary polishing.

## Human-in-the-loop confirmation

The destination confirmation step is a graph interrupt/resume boundary.

- The first graph run starts with preferences and returns a `threadId`, a graph `phase`, and either recommendations or a clarification message.
- The confirmation action resumes the existing thread with a selected destination id.
- The itinerary action resumes the same thread again to complete the itinerary step.

## Checkpointing

The current checkpointer is in-memory only.

- It is intended for local development and test runs.
- It does not survive server restarts.
- A database or Redis-backed checkpointer has not been added yet.

## Environment variables

The app can run without an LLM API key because the adapter includes development fallbacks. To enable real LLM responses, set:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
```

## Development

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm run dev
```

Open `http://localhost:3000` in the browser.

## Verification

Run the full quality gate with:

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
npm run test:e2e
```
