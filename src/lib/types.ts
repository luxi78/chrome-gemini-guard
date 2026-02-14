export type GuardianStatus = "idle" | "running" | "error";

export interface GuardianSnapshot {
  status: GuardianStatus;
  strictMode: boolean;
  autostartEnabled: boolean;
  networkHint: string | null;
}

export interface DriftItem {
  jsonPath: string;
  expected: string;
  actual: string;
  kind: "country" | "glic";
}

export interface EventItem {
  at: string;
  level: "info" | "warn" | "error";
  message: string;
}
