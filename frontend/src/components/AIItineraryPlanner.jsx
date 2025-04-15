import React, { useState } from "react";

const AIItineraryPlanner = () => {
  const [form, setForm] = useState({
    from: "",
    to: "",
    budget: "",
    days: "",
  });

  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    const { from, to, budget, days } = form;
    if (!from || !to || !budget || !days) {
      alert("Please fill all fields");
      return;
    }

    const userPrompt = `Generate a detailed ${days}-day itinerary for a trip from ${from} to ${to} with a budget of $${budget}. Include:
- Flights (departure and return)
- Hotel recommendation within budget
- Day-wise attractions or activities
- Local transport options`;

    setPrompt(userPrompt);
    setLoading(true);

    try {
      const res = await fetch("https://itenararyplanner.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      const data = await res.json();
      setResponse(data.response || "No response received.");
    } catch (err) {
      console.error(err);
      setResponse("Error generating itinerary.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">AI Travel Itinerary Planner 🧳</h2>

      <div className="grid grid-cols-2 gap-4">
        <input placeholder="From" className="p-2 border rounded" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
        <input placeholder="To" className="p-2 border rounded" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
       <input
          type="range"
          placeholder="Budget ($)"
          className="p-2 border rounded"
          value={form.budget}
          min="0"
          max="100000"
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
        />
        <input placeholder="Days" type="number" className="p-2 border rounded" value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} />
      </div>

      <button onClick={handleGenerate} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Generate Itinerary
      </button>

      {loading && <p className="text-gray-500">Generating with Gemini...</p>}

      {prompt && (
        <div className="bg-yellow-100 p-4 rounded border">
          <h3 className="font-bold mb-2">📝 Prompt Sent to Gemini:</h3>
          <pre className="whitespace-pre-wrap">{prompt}</pre>
        </div>
      )}

      {response && (
        <div className="bg-green-100 p-4 rounded border">
          <h3 className="font-bold mb-2">🤖 Gemini Response:</h3>
          <pre className="whitespace-pre-wrap">{response}</pre>
        </div>
      )}
    </div>
  );
};

export default AIItineraryPlanner;
