import { useTranslation } from "react-i18next";
import { EventList } from "../components/event-list";
import { StatusCards } from "../components/status-cards";
import type { EventItem, GuardianSnapshot } from "../lib/types";

type DashboardProps = {
  snapshot: GuardianSnapshot;
  events: EventItem[];
};

export function Dashboard ({ snapshot, events }: DashboardProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            {t("dashboard.subtitle")}
          </p>
        </div>
      </div>

      <StatusCards snapshot={snapshot} />

      <EventList events={events} />
    </div>
  );
}
