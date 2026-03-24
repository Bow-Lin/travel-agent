import { describe, expect, it, vi } from "vitest";

import { createTravelMcpClient } from "@/server/mcp/travel-mcp-client";

describe("createTravelMcpClient", () => {
  it("stays disabled by default", () => {
    const client = createTravelMcpClient({
      config: {
        enabled: false,
        command: "npx",
        args: ["travel-mcp-server"],
      },
    });

    expect(client.isEnabled()).toBe(false);
    expect(client.getStatus()).toBe("disabled");
  });

  it("spawns the configured MCP process when enabled", async () => {
    const kill = vi.fn();
    const spawn = vi.fn().mockReturnValue({
      pid: 123,
      killed: false,
      kill,
    });

    const client = createTravelMcpClient({
      config: {
        enabled: true,
        command: "npx",
        args: ["travel-mcp-server"],
      },
      spawn,
    });

    const result = await client.connect();

    expect(result).toBe(true);
    expect(spawn).toHaveBeenCalledWith("npx", ["travel-mcp-server"], {
      env: process.env,
      stdio: "pipe",
    });
    expect(client.getStatus()).toBe("running");

    await client.disconnect();
    expect(kill).toHaveBeenCalled();
    expect(client.getStatus()).toBe("idle");
  });
});
