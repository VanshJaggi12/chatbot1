// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  // State to store conversation history
  const [messages, setMessages] = useState([
    { text: "Hello! I am your AI assistant. How can I help you?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Auto-scroll to the newest message
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle submitting a new message
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return; // Don't send empty messages

    // Add user message to UI
    const userMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput(""); // Clear input field

    // Simulate Bot Response (Replace this setTimeout with your actual API fetch call later)
    setTimeout(() => {
      const botMsg = { 
        text: "This is a placeholder response. Connect your backend API here!", 
        sender: "bot" 
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div className="app-container">
      <header className="chat-header">
        <h1>AI Assistant</h1>
      </header>
      
      <div className="chat-window">
        {/* Render all messages dynamically */}
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {/* Empty div used as a target for auto-scrolling */}
        <div ref={chatEndRef} />
      </div>

      <form className="input-form" onSubmit={handleSend}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..." 
          autoComplete="off"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;