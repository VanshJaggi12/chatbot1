import React from "react";

function Sidebar({ chats, setChats, setActiveChat }) {

  const createChat = () => {

    const newChat = {
      id: Date.now(),
      messages:[]
    };

    setChats([...chats,newChat]);
    setActiveChat(newChat.id);

  };

  return (

    <div className="sidebar">

      <div className="sidebar-title">
        🤖 AI Chat
      </div>

      <button
        className="new-chat-btn"
        onClick={createChat}
      >
        + New Chat
      </button>

      <div className="chat-list">

        {chats.map(chat => (

          <div
            key={chat.id}
            className="chat-item"
            onClick={()=>setActiveChat(chat.id)}
          >
            Chat {chat.id}
          </div>

        ))}

      </div>

    </div>

  );
}

export default Sidebar;