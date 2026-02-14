type SettingsPanelProps = {
  autostartEnabled: boolean;
};

export function SettingsPanel({ autostartEnabled }: SettingsPanelProps) {
  return (
    <section className="card">
      <h2 className="card-title">设置</h2>
      <div className="row-list">
        <div className="row">
          <span className="row-label">开机自启动</span>
          <span data-testid="autostart-value" className={autostartEnabled ? "badge badge-running" : "badge badge-idle"}>
            {String(autostartEnabled)}
          </span>
        </div>
      </div>
    </section>
  );
}
