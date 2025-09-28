import { useState } from "react";

export default function QueryForm({ onSubmit }) {
  const [q, setQ] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!q.trim()) return;
    onSubmit(q);   // ← this calls handleAsk in App.jsx
    setQ("");      // clear input
  }

  return (
    <form className="pf-form" onSubmit={handleSubmit}>
      <label htmlFor="query" className="pf-label">Ask about safe routes</label>
      <div className="pf-input-row">
        <input
          id="query"
          className="pf-input"
          placeholder="e.g., Best walking route from Tooker to SDFC during rain"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="pf-button" type="submit">Submit</button>
      </div>
      <p className="pf-hint">Dust storm? Flooding? Ask for safe & greener options.</p>
    </form>
  );
}
