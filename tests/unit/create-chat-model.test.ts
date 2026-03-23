import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const openAIMock = vi.fn(
  class OpenAIMock {
    config;

    constructor(config: unknown) {
      this.config = config;
    }
  },
);

vi.mock("openai", () => ({
  default: openAIMock,
}));

describe("createChatModel", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    openAIMock.mockReset();
    process.env = { ...originalEnv };
    delete process.env.MOCK_LLM_RESPONSES;
    delete process.env.IFLOW_API_KEY;
    delete process.env.IFLOW_BASE_URL;
    delete process.env.IFLOW_MODEL;
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_MODEL;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns null when no iFlow key is available", async () => {
    const { createChatModel } = await import("@/server/llm/create-chat-model");

    expect(createChatModel()).toBeNull();
  });

  it("returns null when llm mocking is enabled", async () => {
    process.env.MOCK_LLM_RESPONSES = "true";
    process.env.IFLOW_API_KEY = "iflow-test-key";

    const { createChatModel } = await import("@/server/llm/create-chat-model");

    expect(createChatModel()).toBeNull();
    expect(openAIMock).not.toHaveBeenCalled();
  });

  it("builds an OpenAI client from iFlow env vars", async () => {
    process.env.IFLOW_API_KEY = "iflow-test-key";
    process.env.IFLOW_BASE_URL = "https://apis.iflow.cn/v1";
    process.env.IFLOW_MODEL = "qwen3-max";

    const { createChatModel } = await import("@/server/llm/create-chat-model");
    const result = createChatModel();

    expect(openAIMock).toHaveBeenCalledWith({
      apiKey: "iflow-test-key",
      baseURL: "https://apis.iflow.cn/v1",
      dangerouslyAllowBrowser: true,
    });
    expect(result).toHaveProperty("config.baseURL", "https://apis.iflow.cn/v1");
  });
});
