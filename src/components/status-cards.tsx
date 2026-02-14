import type { GuardianSnapshot } from "../lib/types";

type StatusCardsProps = {
  snapshot: GuardianSnapshot;
};

export function StatusCards({ snapshot }: StatusCardsProps) {
  const statusClass =
    snapshot.status === "running" ? "badge badge-running" : snapshot.status === "error" ? "badge badge-error" : "badge badge-idle";

  return (
    <section className="card">
      <h2 className="card-title">状态</h2>
      <div className="row-list">
        <div className="row">
          <span className="row-label">守护进程</span>
          <span data-testid="status-value" className={statusClass}>
            {snapshot.status}
          </span>
        </div>
        <div className="row">
          <span className="row-label">网络提示</span>
          <span className="mono">{snapshot.networkHint ?? "N/A"}</span>
        </div>
      </div>
    </section>
  );
}
