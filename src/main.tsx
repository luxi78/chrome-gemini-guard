import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { Dashboard } from "./app/dashboard";
import { LogsPage } from "./app/logs";
import { SettingsPage } from "./app/settings";
import { Layout, type NavPath } from "./layout";
import "./app/globals.css";
import "./i18n";
import {
  fetchAutostartStatus,
  fetchRecentEvents,
  fetchSnapshot,
  reconcileNow,
  setAutostart,
  setStrictMode,
  toggleGuardian
} from "./lib/api";
import type { EventItem, GuardianSnapshot } from "./lib/types";

function App () {
  const [snapshot, setSnapshot] = useState<GuardianSnapshot>({
    status: "idle",
    strictMode: false,
    autostartEnabled: false,
    networkHint: null
  });
  const [events, setEvents] = useState<EventItem[]>([]);
  const [page, setPage] = useState<NavPath>("dashboard");

  const reload = async () => {
    try {
      const [next, autostartEnabled, recentEvents] = await Promise.all([
        fetchSnapshot(),
        fetchAutostartStatus(),
        fetchRecentEvents(120)
      ]);
      setSnapshot({ ...next, autostartEnabled });
      setEvents(recentEvents);
    } catch (e) {
      console.error("Failed to load data", e);
    }
  };

  useEffect(() => {
    void reload();
    const timer = window.setInterval(() => {
      void reload();
    }, 2000);
    return () => window.clearInterval(timer);
  }, []);

  const handleReconcile = async () => {
    await reconcileNow();
    await reload();
  };

  const handleToggleGuardian = async () => {
    await toggleGuardian(snapshot.status !== "running");
    await reload();
  };

  return (
    <Layout currentPath={page} onNavigate={setPage} strictMode={snapshot.strictMode}>
      {page === "dashboard" && (
        <Dashboard snapshot={snapshot} events={events} />
      )}
      {page === "logs" && (
        <LogsPage events={events} />
      )}
      {page === "settings" && (
        <SettingsPage
          snapshot={snapshot}
          onToggleAutostart={async () => {
            await setAutostart(!snapshot.autostartEnabled);
            await reload();
          }}
          onToggleStrictMode={async () => {
            await setStrictMode(!snapshot.strictMode);
            await reload();
          }}
          onReconcile={handleReconcile}
          onToggleGuardian={handleToggleGuardian}
        />
      )}
    </Layout>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
