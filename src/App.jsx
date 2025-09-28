import { useState } from "react";
import Header from "./components/Header.jsx";
import QueryForm from "./components/QueryForm.jsx";
import ResultCard from "./components/ResultCard.jsx";

export default function App() {
  const [results, setResults] = useState([]);

  // ← This is handleAsk
  async function handleAsk(question) {
    if (!question.trim()) return;
  
    setResults([{ title: "Thinking...", subtitle: "", body: "Fetching AI response..." }]);
  
    try {
      const res = await fetch("http://localhost:8000/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
  
      const data = await res.json();
  
      setResults([{ title: "GPT Answer", subtitle: "AI Suggestion", body: data.answer }]);
    } catch (err) {
      console.error(err);
      setResults([{ title: "Error", subtitle: "", body: "Could not contact GPT backend." }]);
    }
  }

  return (
    <div className="pf-app">
      <Header />
      <main className="pf-main">
        <section className="pf-hero">
          <h1>ASU Safe Transport</h1>
          <p className="pf-subtitle">Smart, safe, and sustainable routing for dust storms & flooding.</p>
        </section>

        {/* Pass handleAsk to QueryForm */}
        <QueryForm onSubmit={handleAsk} />

        <div className="pf-grid">
          {results.map((r, i) => (
            <ResultCard key={i} title={r.title} subtitle={r.subtitle}>
              <p>{r.body}</p>
            </ResultCard>
          ))}
        </div>
      </main>
    </div>
  );
}
