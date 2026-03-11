import React, { useState } from "react";

import Sidebar from "./components/Sidebar";
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";
import TypingIndicator from "./components/TypingIndicator";

import { sendToGemini } from "./services/geminiService";

import "./styles/App.css";
import "./styles/Sidebar.css";
import "./styles/Chat.css";

function App(){

  const [chats,setChats] = useState([
    { id:1, messages:[] }
  ]);

  const [activeChat,setActiveChat] = useState(1);

  const [loading,setLoading] = useState(false);

  const sendMessage = async(text)=>{

    const updatedChats=[...chats];

    const chat=updatedChats.find(c=>c.id===activeChat);

    chat.messages.push({
      role:"user",
      content:text
    });

    setChats(updatedChats);

    setLoading(true);

    const reply=await sendToGemini(text);

    chat.messages.push({
      role:"bot",
      content:reply
    });

    setChats([...updatedChats]);

    setLoading(false);

  };

  const activeMessages=
    chats.find(c=>c.id===activeChat)?.messages || [];

  return(

    <div className="app">

      <Sidebar
        chats={chats}
        setChats={setChats}
        setActiveChat={setActiveChat}
      />

      <div className="chat-area">

        <div className="messages">

          {activeMessages.map((msg,index)=>(
            <ChatMessage
              key={index}
              message={msg}
            />
          ))}

          {loading && <TypingIndicator/>}

        </div>

        <ChatInput onSend={sendMessage}/>

      </div>

    </div>

  );

}

export default App;