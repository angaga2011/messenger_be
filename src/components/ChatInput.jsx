import React from "react";
import "../styles/ChatInput.css";

const ChatInput = ({ input, setInput, onSendMessage }) => (
  <div className="chat-input-container">
    <input
      type="text"
      placeholder="Type a message..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
      className="chat-input"
    />
    <button onClick={onSendMessage} className="send-button">
      ➤
    </button>
  </div>
);

export default ChatInput;
