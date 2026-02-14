import type { EventItem } from "../lib/types";

type EventListProps = {
  events: EventItem[];
};

function toLocalTimeLabel(raw: string): string {
  const numeric = Number(raw);
  const date = Number.isFinite(numeric) ? new Date(numeric) : new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return raw;
  }
  return date.toLocaleString("zh-CN", { hour12: false });
}

export function EventList({ events }: EventListProps) {
  return (
    <section className="card">
      <h2 className="card-title">最近事件</h2>
      <ul data-testid="event-list" className="event-list">
        {events.length === 0 ? (
          <li className="event-item">
            <p className="event-message">暂无事件</p>
          </li>
        ) : (
          events.map((item) => (
            <li key={`${item.at}-${item.message}`} className="event-item">
              <p className="event-message">{item.message}</p>
              <p className="event-meta">{toLocalTimeLabel(item.at)}</p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
