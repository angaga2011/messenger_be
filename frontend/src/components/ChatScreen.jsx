import React, { useState } from "react";
import "../css/ChatScreen.css"; // Importing the CSS file

const ChatScreen = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello!", sender: "user" },
        { id: 2, text: "Hi there! How can I help you today?", sender: "bot" },
    ]);
    const [input, setInput] = useState("");

    const handleSendMessage = () => {
        if (input.trim() === "") return;

        const newMessage = { id: Date.now(), text: input, sender: "user" };
        setMessages([...messages, newMessage]);
        setInput("");

        // Simulate bot response
        setTimeout(() => {
            const botResponse = { id: Date.now(), text: "Thanks for your message!", sender: "bot" };
            setMessages((prevMessages) => [...prevMessages, botResponse]);
        }, 1000);
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSendMessage();
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h3>Chat</h3>
            </div>
            <div className="chat-messages">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`chat-message ${
                            message.sender === "user" ? "chat-user" : "chat-bot"
                        }`}
                    >
                        {message.text}
                    </div>
                ))}
            </div>
            <div className="chat-input-container">
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Type a message..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                />
                <button className="chat-send-button" onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatScreen;
