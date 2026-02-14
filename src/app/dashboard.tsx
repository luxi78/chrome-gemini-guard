import { EventList } from "../components/event-list";
import { RulesPreview } from "../components/rules-preview";
import { SettingsPanel } from "../components/settings-panel";
import { StatusCards } from "../components/status-cards";
import type { EventItem, GuardianSnapshot } from "../lib/types";

type DashboardProps = {
  snapshot: GuardianSnapshot;
  events: EventItem[];
};

export function Dashboard({ snapshot, events }: DashboardProps) {
  // TODO(step3:dashboard-wireup;tests:ui-contract):
  // What: connect command-driven data fetching and action handlers.
  // I/O: currently receives snapshot/events props from caller; in Step 3 this may come from hooks/store.
  // Constraints:
  //   - Show network hint as advisory only.
  //   - Keep close behavior delegated to tray policy.
  // Error semantics: render non-blocking fallback UI on API failures.
  // Mapping: `ui-contract` validates section presence and baseline values.
  return (
    <main className="content-wrap">
      <header className="card">
        <h1 style={{ margin: 0, fontSize: "34px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>Chrome Gemini Guard</h1>
        <p className="card-subtitle">监控并修复 Chrome Local State 关键字段，减少手动回填成本。</p>
      </header>
      <StatusCards snapshot={snapshot} />
      <RulesPreview strictMode={snapshot.strictMode} />
      <EventList events={events} />
      <SettingsPanel autostartEnabled={snapshot.autostartEnabled} />
    </main>
  );
}
