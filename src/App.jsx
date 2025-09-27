import "./App.css";
import { useState, useRef, useEffect } from "react";
import Header from "./components/Header.jsx";
import QueryForm from "./components/QueryForm.jsx";
import ResultCard from "./components/ResultCard.jsx";

export default function App() {
  const [userInput, setUserInput] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Example: your handleAsk logic merged with theirs
  async function handleAsk(e) {
    e.preventDefault();
    if (!userInput.trim()) return;

    setResponses((prev) => [...prev, { question: userInput, answer: "Thinking..." }]);
    setUserInput("");

    try {
      const res = await fetch("http://localhost:8000/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userInput }),
      });
      const data = await res.json();

      setResponses((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].answer = data.answer;
        return updated;
      });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [responses]);

  return (
    <div className="pf-app">
      <Header />
      <QueryForm onAsk={handleAsk} />
      <div>
        {responses.map((r, i) => (
          <ResultCard key={i} title={r.question} subtitle="" body={r.answer} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
