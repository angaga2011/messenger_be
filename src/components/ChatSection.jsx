import React from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import "../styles/ChatSection.css";

const ChatSection = ({ selectedContact, messages, input, setInput, onSendMessage }) => (
  <div className="chat-section">
    {selectedContact ? (
      <>
        <ChatMessages messages={messages} />
        <ChatInput input={input} setInput={setInput} onSendMessage={onSendMessage} />
      </>
    ) : (
      <div className="no-contact-selected">No contact selected</div>
    )}
  </div>
);

export default ChatSection;
