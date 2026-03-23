import type { TravelAgentState } from "@/agent/travel-graph/state";

type TravelCheckpointer = {
  get(threadId: string): TravelAgentState | undefined;
  set(state: TravelAgentState): void;
  clear(): void;
};

function createInMemoryCheckpointer(): TravelCheckpointer {
  const store = new Map<string, TravelAgentState>();

  return {
    get(threadId) {
      return store.get(threadId);
    },
    set(state) {
      store.set(state.threadId, state);
    },
    clear() {
      store.clear();
    },
  };
}

const checkpointer = createInMemoryCheckpointer();

export function getTravelCheckpointer() {
  return checkpointer;
}
