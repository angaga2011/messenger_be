import React from "react";
import Message from './Message'; // Import the Message component
import "../css/ChatSection.css";

const ChatSection = ({ selectedContact, messages, input, setInput, handleSendMessage }) => {
    return (
        <div className="chat-section">
            <div className="chat-header">
                <p className="chat-contact-name">
                    {selectedContact || "Select a contact"}
                </p>
            </div>
            <div className="chat-messages">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`chat-message ${message.sender === "You" ? "sent" : "received"}`}
                    >
                        <p className="message-text">{message.text}</p>
                        <p className="message-timestamp">{message.timestamp}</p>
                    </div>
                ))}
            </div>
            <div className="chat-input-container">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="chat-input"
                />
                <button onClick={handleSendMessage} className="send-button">
                    ➤
                </button>
            </div>
        </div>
    );
};

export default ChatSection;