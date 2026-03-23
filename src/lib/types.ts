import type {
  BUDGET_LEVELS,
  CLIMATE_PREFERENCES,
  DEFAULT_INTERESTS,
  PARTY_TYPES,
  TRAVEL_PACES,
} from "@/lib/constants";

export type BudgetLevel = (typeof BUDGET_LEVELS)[number];
export type ClimatePreference = (typeof CLIMATE_PREFERENCES)[number];
export type TravelPace = (typeof TRAVEL_PACES)[number];
export type PartyType = (typeof PARTY_TYPES)[number];
export type Interest = (typeof DEFAULT_INTERESTS)[number];

export type PreferenceInput = {
  originRegion: string;
  tripLengthDays: number;
  budgetLevel: BudgetLevel;
  interests: Interest[];
  climate: ClimatePreference;
  pace: TravelPace;
  travelMonth: string;
  partyType: PartyType;
};

export type DestinationCatalogEntry = {
  id: string;
  name: string;
  country: string;
  summary: string;
  budgetBand: BudgetLevel;
  climate: Exclude<ClimatePreference, "any">[];
  interests: Interest[];
  bestMonths: string[];
  tripStyles: PartyType[];
};

export type DestinationScore = {
  destination: DestinationCatalogEntry;
  score: number;
  reasons: string[];
};

export type DestinationRecommendation = {
  id: string;
  name: string;
  country: string;
  summary: string;
  matchReasons: string[];
  budgetBand: BudgetLevel;
  bestMonths: string[];
  score: number;
};

export type ConfirmedDestination = {
  destinationId: string;
  name: string;
  country: string;
};

export type ItineraryDay = {
  day: number;
  theme: string;
  morning: string;
  afternoon: string;
  evening: string;
};

export type GeneratedItinerary = {
  destination: ConfirmedDestination;
  days: ItineraryDay[];
};
