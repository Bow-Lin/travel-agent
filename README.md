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

The app can run without an LLM API key because the adapter includes development fallbacks. To enable real LLM responses through iFlow, create a local env file at `travel_agent/.env.local`.

Example:

```bash
# travel_agent/.env.local
IFLOW_API_KEY=your_key_here
IFLOW_BASE_URL=https://apis.iflow.cn/v1
IFLOW_MODEL=qwen3-max
TAVILY_API_KEY=your_tavily_key_here
```

Notes:

- `.env.local` is already ignored by git through `.gitignore`, so it stays local.
- `IFLOW_BASE_URL` should stay `https://apis.iflow.cn/v1` unless your provider gives you a different endpoint.
- `IFLOW_MODEL` is currently set up for `qwen3-max` by default, so you can omit it if you want to use that model.

## Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in the browser.

## Quick start

From the project root:

```bash
cat > .env.local <<'EOF'
IFLOW_API_KEY=your_key_here
IFLOW_BASE_URL=https://apis.iflow.cn/v1
IFLOW_MODEL=qwen3-max
EOF
```

Then run:

```bash
npm install
npm run dev
```

If the env vars are loaded correctly, the LangGraph flow will use iFlow for:

- missing-field clarification
- recommendation reasoning
- itinerary polishing

Planning-stage destination research can also use Tavily when `TAVILY_API_KEY` is configured. If Tavily is missing or unavailable, the planner falls back to the local destination catalog only.

If the env vars are missing, the app still runs, but those steps fall back to local deterministic text.

## Test behavior

Automated tests do not call the real LLM.

- Vitest runs with the LLM client disabled by default.
- Playwright starts the app with `MOCK_LLM_RESPONSES=true`.
- That means tests only verify app behavior and graph flow, not live iFlow responses.

## Verification

Run the full quality gate with:

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
npm run test:e2e
```
