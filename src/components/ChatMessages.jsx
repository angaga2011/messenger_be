import React from "react";

const ChatMessages = ({ messages }) => (
  <div className="chat-messages">
    {messages.map((message) => (
      <div
        key={message.id}
        className={`chat-message ${message.sender === "me" ? "sent" : "received"}`}
      >
        <p>{message.content}</p>
        <p className="message-timestamp">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    ))}
  </div>
);

export default ChatMessages;
