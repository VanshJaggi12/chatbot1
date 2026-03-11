import { useState } from "react";
import "./App.css";

function App() {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: input }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();

      console.log("Gemini response:", data);

      const botReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from Gemini.";

      const botMessage = {
        role: "bot",
        text: botReply
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {

      console.error("Gemini Error:", error);

      setMessages(prev => [
        ...prev,
        { role: "bot", text: "Error communicating with Gemini API." }
      ]);

    }

    setLoading(false);
  };

  return (
    <div className="app">

      <h1>Gemini AI Chatbot</h1>

      <div className="chat-box">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.role === "user" ? "user-msg" : "bot-msg"}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="bot-msg">Gemini is typing...</div>
        )}

      </div>

      <div className="input-area">

        <input
          type="text"
          placeholder="Ask Gemini something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button onClick={sendMessage}>
          Send
        </button>

      </div>

    </div>
  );
}

export default App;