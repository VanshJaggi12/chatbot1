import { useState, useRef, useEffect } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";

function App() {

  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const chatContainerRef = useRef(null);

  const API_KEY = "AIzaSyDvlNZVcjbxdYMKGoc7SxGGGwAO579BGdY";

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  async function generateAnswer(e) {

    e.preventDefault();

    if (!question.trim()) return;

    const currentQuestion = question;

    setQuestion("");

    setGeneratingAnswer(true);

    setChatHistory(prev => [
      ...prev,
      { type: "user", content: currentQuestion }
    ]);

    try {

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: currentQuestion }]
              }
            ]
          })
        }
      );

      const data = await response.json();

      const aiResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from Gemini.";

      setChatHistory(prev => [
        ...prev,
        { type: "bot", content: aiResponse }
      ]);

    } catch (error) {

      console.error("Gemini Error:", error);

      setChatHistory(prev => [
        ...prev,
        { type: "bot", content: "Error contacting Gemini API." }
      ]);

    }

    setGeneratingAnswer(false);
  }

  return (

    <div className="app-wrapper">

      <div className="chat-container">

        <div className="header">
          <h1>Vansh Chatbot</h1>
        </div>

        <div ref={chatContainerRef} className="chat-window">

          {chatHistory.map((chat, index) => (

            <div
              key={index}
              className={`message-row ${chat.type === "user" ? "user" : "bot"}`}
            >

              <div className={`bubble ${chat.type === "user" ? "user" : "bot"}`}>

                <ReactMarkdown>
                  {chat.content}
                </ReactMarkdown>

              </div>

            </div>

          ))}

          {generatingAnswer && (

            <div className="message-row bot">

              <div className="typing">
                Gemini is thinking...
              </div>

            </div>

          )}

        </div>

        <form onSubmit={generateAnswer} className="input-container">

          <textarea
            rows="2"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask Gemini something..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                generateAnswer(e);
              }
            }}
          />

          <button type="submit" disabled={generatingAnswer}>
            Send
          </button>

        </form>

      </div>

    </div>

  );

}

export default App;