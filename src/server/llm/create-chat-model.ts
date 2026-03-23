import OpenAI from "openai";

export function createChatModel() {
  if (process.env.MOCK_LLM_RESPONSES === "true") {
    return null;
  }

  const apiKey = process.env.IFLOW_API_KEY;
  const baseURL = process.env.IFLOW_BASE_URL ?? "https://apis.iflow.cn/v1";

  if (!apiKey) {
    return null;
  }

  return new OpenAI({
    apiKey,
    baseURL,
    dangerouslyAllowBrowser: process.env.NODE_ENV === "test",
  });
}
