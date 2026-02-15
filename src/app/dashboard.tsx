import { EventList } from "../components/event-list";
import { RulesPreview } from "../components/rules-preview";
import { SettingsPanel } from "../components/settings-panel";
import { StatusCards } from "../components/status-cards";
import type { EventItem, GuardianSnapshot } from "../lib/types";

type DashboardProps = {
  snapshot: GuardianSnapshot;
  events: EventItem[];
};

export function Dashboard ({ snapshot, events }: DashboardProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            一切正常。Chrome Local State 处于受控状态。
          </p>
        </div>
      </div>

      <StatusCards snapshot={snapshot} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6">
        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <EventList events={events} />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col gap-6">
          <RulesPreview strictMode={snapshot.strictMode} />
          <SettingsPanel autostartEnabled={snapshot.autostartEnabled} />
        </div>
      </div>
    </div>
  );
}
