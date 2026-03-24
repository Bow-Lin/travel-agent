export type TravelMcpConfig = {
  enabled: boolean;
  command: string;
  args: string[];
};

function parseArgs(rawArgs: string | undefined) {
  if (!rawArgs || rawArgs.trim().length === 0) {
    return ["travel-mcp-server"];
  }

  return rawArgs
    .split(/\s+/)
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

export function getTravelMcpConfig(): TravelMcpConfig {
  return {
    enabled: process.env.TRAVEL_MCP_ENABLED === "true",
    command: process.env.TRAVEL_MCP_COMMAND ?? "npx",
    args: parseArgs(process.env.TRAVEL_MCP_ARGS),
  };
}
