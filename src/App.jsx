import { useState, useRef, useEffect } from "react";

function App() {
  const [userInput, setUserInput] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [responses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || loading) return;

    setLoading(true);
    const currentQuestion = userInput;
    setResponses((prev) => [...prev, { question: currentQuestion, answer: "Thinking..." }]);
    setUserInput("");

    try {
      const res = await fetch("http://localhost:8000/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQuestion }),
      });
      const data = await res.json();
      const gptAnswer = data.answer;

      setResponses((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { question: currentQuestion, answer: gptAnswer };
        return updated;
      });
    } catch (err) {
      console.error(err);
      setResponses((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { question: currentQuestion, answer: "Error contacting GPT" };
        return updated;
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="text-3xl font-bold mb-6 text-center">ASU Safe Transport</header>

      <form onSubmit={handleSubmit} className="mb-4 flex justify-center gap-2">
        <input
          type="text"
          placeholder="Ask about safe routes..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-96"
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Thinking..." : "Submit"}
        </button>
      </form>

      <div className="max-w-xl mx-auto">
        {responses.map((r, index) => (
          <div key={index} className="mb-4 p-3 bg-white rounded shadow">
            <p className="font-semibold">You:</p>
            <p>{r.question}</p>
            <p className="mt-2 font-semibold">GPT:</p>
            <p>{r.answer}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default App;
