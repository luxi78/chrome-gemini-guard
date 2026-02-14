import type { EventItem, GuardianSnapshot } from "./types";
import { invoke } from "@tauri-apps/api/core";

type BackendSnapshot = {
  status: string;
  strict_mode: boolean;
  autostart_enabled: boolean;
  network_hint: string | null;
};

type AutostartStatus = {
  autostartEnabled: boolean;
};

type BackendEvent = {
  at: string;
  level: string;
  message: string;
};

export async function fetchSnapshot(): Promise<GuardianSnapshot> {
  try {
    const raw = await invoke<BackendSnapshot>("get_snapshot_cmd");
    return {
      status: raw.status === "running" ? "running" : raw.status === "error" ? "error" : "idle",
      strictMode: raw.strict_mode,
      autostartEnabled: raw.autostart_enabled,
      networkHint: raw.network_hint
    };
  } catch {
    return {
      status: "idle",
      strictMode: false,
      autostartEnabled: true,
      networkHint: "Unknown"
    };
  }
}

export async function toggleGuardian(enabled: boolean): Promise<void> {
  try {
    await invoke("toggle_guardian_cmd", { enabled });
  } catch {
    return;
  }
}

export async function reconcileNow(): Promise<void> {
  try {
    await invoke("reconcile_now_cmd");
  } catch {
    return;
  }
}

export async function setStrictMode(strictMode: boolean): Promise<void> {
  try {
    await invoke("set_strict_mode_cmd", { strictMode });
  } catch {
    return;
  }
}

export async function setAutostart(enabled: boolean): Promise<void> {
  try {
    await invoke<AutostartStatus>("set_autostart_cmd", { enabled });
  } catch {
    return;
  }
}

export async function fetchAutostartStatus(): Promise<boolean> {
  try {
    const res = await invoke<AutostartStatus>("get_autostart_status_cmd");
    return res.autostartEnabled;
  } catch {
    return false;
  }
}

export async function fetchRecentEvents(limit = 100): Promise<EventItem[]> {
  try {
    const res = await invoke<BackendEvent[]>("get_recent_events_cmd", { limit });
    return res.map((item) => ({
      at: item.at,
      level: item.level === "warn" ? "warn" : item.level === "error" ? "error" : "info",
      message: item.message
    }));
  } catch {
    return [];
  }
}
