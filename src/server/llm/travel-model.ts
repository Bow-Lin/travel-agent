import { createChatModel } from "@/server/llm/create-chat-model";
import { clarificationPrompt, itineraryPrompt, recommendationPrompt } from "@/server/llm/prompts";

type ClarificationInput = {
  missingFields: string[];
  knownContext: string;
};

type RecommendationEnhancementInput = {
  destinationName: string;
  summary: string;
  travelerContext?: string;
};

type ItineraryEnhancementInput = {
  destinationName: string;
  dayTheme: string;
  content: string;
};

export type TravelModelAdapter = {
  clarifyMissingInformation(input: ClarificationInput): Promise<string>;
  enhanceRecommendationSummary(input: RecommendationEnhancementInput): Promise<string>;
  enhanceItineraryDay(input: ItineraryEnhancementInput): Promise<string>;
};

export type TravelModel = TravelModelAdapter;

async function maybeInvokeModel(prompt: string) {
  const client = createChatModel();
  const model = process.env.IFLOW_MODEL ?? "qwen3-max";

  if (!client) {
    return null;
  }

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;

    if (typeof content === "string") {
      return content;
    }

    return null;
  } catch {
    return null;
  }
}

export function createTravelModel(): TravelModelAdapter {
  return {
    async clarifyMissingInformation({ missingFields, knownContext }) {
      const fallback = `Please share ${missingFields.join(", ")} so I can refine the travel recommendation. ${knownContext}`;
      return (await maybeInvokeModel(clarificationPrompt(missingFields, knownContext))) ?? fallback;
    },
    async enhanceRecommendationSummary({ destinationName, summary, travelerContext }) {
      const normalizedContext = travelerContext ?? "the stated travel preferences align well with this destination";
      const fallback = `${destinationName} is a strong fit for this trip because ${normalizedContext.toLowerCase()}. ${summary}`;
      return (
        (await maybeInvokeModel(recommendationPrompt(destinationName, summary, normalizedContext))) ??
        fallback
      );
    },
    async enhanceItineraryDay({ destinationName, dayTheme, content }) {
      const fallback = `${destinationName}: ${dayTheme}. ${content}`;
      return (await maybeInvokeModel(itineraryPrompt(destinationName, dayTheme, content))) ?? fallback;
    },
  };
}
