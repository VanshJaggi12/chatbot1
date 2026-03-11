import { useState, useRef, useEffect } from "react";
import "./App.css";
import axios from "axios";
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

    setChatHistory((prev) => [
      ...prev,
      { type: "question", content: currentQuestion }
    ]);

    try {

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                { text: currentQuestion }
              ]
            }
          ]
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Gemini Response:", response.data);

      const aiResponse =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from Gemini.";

      setChatHistory((prev) => [
        ...prev,
        { type: "answer", content: aiResponse }
      ]);

    } catch (error) {

      console.error("Full Gemini Error:", error);

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      }

      setChatHistory((prev) => [
        ...prev,
        { type: "answer", content: "Error contacting Gemini API." }
      ]);

    }

    setGeneratingAnswer(false);
  }

  return (

    <div className="fixed inset-0 bg-gradient-to-r from-blue-50 to-blue-100">

      <div className="h-full max-w-4xl mx-auto flex flex-col p-3">

        <header className="text-center py-4">
          <h1 className="text-4xl font-bold text-blue-500">
            Gemini Chat
          </h1>
        </header>

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto mb-4 rounded-lg bg-white shadow-lg p-4"
        >

          {chatHistory.map((chat, index) => (

            <div
              key={index}
              className={`mb-4 ${
                chat.type === "question"
                  ? "text-right"
                  : "text-left"
              }`}
            >

              <div
                className={`inline-block max-w-[80%] p-3 rounded-lg ${
                  chat.type === "question"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >

                <ReactMarkdown>
                  {chat.content}
                </ReactMarkdown>

              </div>

            </div>

          ))}

          {generatingAnswer && (

            <div className="text-left">

              <div className="inline-block bg-gray-100 p-3 rounded-lg animate-pulse">
                Gemini is thinking...
              </div>

            </div>

          )}

        </div>

        <form
          onSubmit={generateAnswer}
          className="bg-white rounded-lg shadow-lg p-4"
        >

          <div className="flex gap-2">

            <textarea
              required
              className="flex-1 border border-gray-300 rounded p-3"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask Gemini something..."
              rows="2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  generateAnswer(e);
                }
              }}
            />

            <button
              type="submit"
              disabled={generatingAnswer}
              className={`px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
                generatingAnswer
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Send
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

export default App;