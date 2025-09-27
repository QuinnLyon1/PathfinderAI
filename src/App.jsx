import { useState } from "react";

function App() {
  const [userInput, setUserInput] = useState("");
  const [responses, setResponses] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
  
    // Show user input immediately
    setResponses((prev) => [...prev, { question: userInput, answer: "Thinking..." }]);
  
    const currentQuestion = userInput;
    setUserInput("");
  
    try {
      const res = await fetch("http://localhost:8000/gpt", {  // Your backend URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: currentQuestion }),
      });
  
      const data = await res.json();
      const gptAnswer = data.answer;
  
      // Update the last response with GPT answer
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
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="text-3xl font-bold mb-6 text-center">
        ASU Safe Transport
      </header>

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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
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
      </div>
    </div>
  );
}

export default App;
