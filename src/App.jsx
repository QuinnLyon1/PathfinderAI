import "./App.css";
import { useState } from "react";
import Header from "./components/Header.jsx";
import QueryForm from "./components/QueryForm.jsx";
import ResultCard from "./components/ResultCard.jsx";

export default function App() {
  const [results, setResults] = useState([]);

  function handleAsk(q) {
    // Temporary mock results so the UI looks real
    setResults([
      { title: "Safest Route", subtitle: "Low flood risk", body: "Avoid underpasses near Rio Salado. ETA ~15 min walking." },
      { title: "Fastest Route", subtitle: "Quick", body: "Direct via University Dr. ETA ~12 min walking." },
      { title: "Greenest Option", subtitle: "Zero CO₂", body: "Campus paths w/ covered walkways. ETA ~18 min." },
    ]);
  }

  return (
    <div className="pf-app">
      <Header />
      <main className="pf-main">
        <section className="pf-hero">
          <h1>ASU Safe Transport</h1>
          <p className="pf-subtitle">Smart, safe, and sustainable routing for dust storms & flooding.</p>
        </section>

        <QueryForm onSubmit={handleAsk} />

        <div className="pf-grid">
          {results.map((r, i) => (
            <ResultCard key={i} title={r.title} subtitle={r.subtitle}>
              <p>{r.body}</p>
              <div className="pf-actions">
                <button className="pf-button pf-secondary">Show on map</button>
                <button className="pf-button pf-tertiary">Details</button>
              </div>
            </ResultCard>
          ))}
        </div>
      </main>

      <footer className="pf-footer">
        <small>© {new Date().getFullYear()} PathfinderAI · Tempe, AZ</small>
      </footer>
    </div>
  );
}
