import { spawn as nodeSpawn } from "node:child_process";

import { getTravelMcpConfig, type TravelMcpConfig } from "@/server/mcp/config";

type SpawnResult = {
  pid?: number;
  killed?: boolean;
  kill(signal?: NodeJS.Signals | number): void;
};

type SpawnLike = (
  command: string,
  args: string[],
  options: { env: NodeJS.ProcessEnv; stdio: "pipe" },
) => SpawnResult;

type TravelMcpClientStatus = "disabled" | "idle" | "running";

type CreateTravelMcpClientOptions = {
  config?: TravelMcpConfig;
  spawn?: SpawnLike;
};

export function createTravelMcpClient(options: CreateTravelMcpClientOptions = {}) {
  const config = options.config ?? getTravelMcpConfig();
  const spawn = options.spawn ?? nodeSpawn;

  let processHandle: SpawnResult | null = null;

  return {
    isEnabled() {
      return config.enabled;
    },
    getStatus(): TravelMcpClientStatus {
      if (!config.enabled) {
        return "disabled";
      }

      return processHandle ? "running" : "idle";
    },
    async connect() {
      if (!config.enabled) {
        return false;
      }

      if (!processHandle) {
        processHandle = spawn(config.command, config.args, {
          env: process.env,
          stdio: "pipe",
        });
      }

      return true;
    },
    async disconnect() {
      if (processHandle && !processHandle.killed) {
        processHandle.kill();
      }

      processHandle = null;
    },
    getConfig() {
      return config;
    },
  };
}
