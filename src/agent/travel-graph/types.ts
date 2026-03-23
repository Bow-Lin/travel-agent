import type {
  ConfirmedDestination,
  DestinationRecommendation,
  GeneratedItinerary,
  PreferenceInput,
  TravelAgentPhase,
} from "@/lib/types";

export type { TravelAgentPhase } from "@/lib/types";

export type TravelAgentMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type TravelAgentState = {
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
