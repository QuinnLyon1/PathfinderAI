import { useState } from "react";
import Header from "./components/Header.jsx";
import QueryForm from "./components/QueryForm.jsx";
import ResultCard from "./components/ResultCard.jsx";

export default function App() {
  const [results, setResults] = useState([]);
  const [weather, setWeather] = useState(null); // store current weather

  // ← This is handleAsk
  async function handleAsk(question) {
    if (!question.trim()) return;
  
    setResults([{ title: "Thinking...", subtitle: "", body: "Fetching AI response..." }]);
    setWeather(null); // reset weather while loading
  
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

         {/* Weather display */}
         {weather && (
          <div className="pf-weather">
            <h3>Current Weather at ASU:</h3>
            <p>{weather.description}</p>
            <p>Temp: {weather.temp}°F</p>
            <p>Wind: {weather.wind_speed} mph</p>
            {weather.dust_alert && <p>⚠️ Dust alert active</p>}
            {weather.rain_alert && <p>🌧 Rain alert active</p>}
          </div>
        )}
        {weather && weather.error && (
         <div className="pf-weather-error">
           <p>Could not fetch weather: {weather.error}</p>
        </div>
        )}
        

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
