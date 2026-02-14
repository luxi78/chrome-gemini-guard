type RulesPreviewProps = {
  strictMode: boolean;
};

export function RulesPreview({ strictMode }: RulesPreviewProps) {
  return (
    <section className="card">
      <h2 className="card-title">规则</h2>
      <div className="row-list">
        <div className="row">
          <span className="row-label">Country</span>
          <span data-testid="rules-country" className="mono">
            {"country => us"}
          </span>
        </div>
        <div className="row">
          <span className="row-label">Eligibility</span>
          <span data-testid="rules-glic" className="mono">
            {"is_glic_eligible => true"}
          </span>
        </div>
        <div className="row">
          <span className="row-label">Strict mode</span>
          <span data-testid="rules-strict" className={strictMode ? "badge badge-running" : "badge badge-idle"}>
            {String(strictMode)}
          </span>
        </div>
      </div>
    </section>
  );
}
