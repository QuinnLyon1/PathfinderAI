export default function ResultCard({ title, subtitle, children }) {
  return (
    <section className="pf-card">
      <div className="pf-card-head">
        <h3>{title}</h3>
        {subtitle && <span className="pf-chip">{subtitle}</span>}
      </div>
      <div className="pf-card-body">{children}</div>
    </section>
  );
}
