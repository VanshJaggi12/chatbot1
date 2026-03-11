import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CopyButton from "./CopyButton";

function ChatMessage({ message }) {

  return (

    <div className={`message ${message.role === "user" ? "user" : "bot"}`}>

      <div className="message-content">

        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content}
        </ReactMarkdown>

      </div>

      {message.role === "bot" && (
        <CopyButton text={message.content}/>
      )}

    </div>

  );

}

export default ChatMessage;