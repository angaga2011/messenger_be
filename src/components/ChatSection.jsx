import React from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import "../styles/ChatSection.css";

const ChatSection = ({ selectedContact, messages, input, setInput, onSendMessage, messagesEndRef }) => (
  <div className="chat-section">
    {selectedContact ? (
      <>
        <div className="selected-contact-email">{selectedContact}</div>
        {messages.length > 0 ? (
          <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
        ) : (
          <div className="no-messages">There Are No Messages Yet</div>
        )}
        <ChatInput input={input} setInput={setInput} onSendMessage={onSendMessage} />
      </>
    ) : (
      <div className="no-contact-selected">No contact selected</div>
    )}
  </div>
);

export default ChatSection;
