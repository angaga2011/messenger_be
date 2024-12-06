import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "../css/ChatScreen.css";

const ChatScreen = () => {
  const [contacts, setContacts] = useState([
    { id: 1, name: "Donald Trump", isOnline: true },
    { id: 2, name: "Obama", isOnline: false },
    { id: 3, name: "Dolor Sit Amet", isOnline: true },
  ]);

  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello Joe Biden!", sender: "Donald Trump", timestamp: "3:50 AM" },
    { id: 2, text: "Wanna play some Minecraft?", sender: "Donald Trump", timestamp: "3:51 AM" },
    { id: 3, text: "Sure, but I forgot the server's IP address.", sender: "You", timestamp: "3:52 AM" },
  ]);
  const [input, setInput] = useState("");

  const navigate = useNavigate(); // Initialize navigation hook

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    const newMessage = {
      id: Date.now(),
      text: input,
      sender: "You",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([...messages, newMessage]);
    setInput("");
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setMessages([]); // Clear messages for simplicity
  };

  const handleAddContact = () => {
    const newContactName = prompt("Enter the name of the new contact:");
    if (newContactName) {
      const newContact = {
        id: Date.now(),
        name: newContactName,
        isOnline: false, // New contacts are offline by default
      };
      setContacts([...contacts, newContact]);
    }
  };

  return (
    <div className="chat-screen">
      {/* Contact List Section */}
      <div className="contacts-section">
        <div className="contact-list">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`contact-item ${selectedContact.id === contact.id ? "selected" : ""}`}
              onClick={() => handleSelectContact(contact)}
            >
              <div className="contact-info">
                <p className="contact-name">{contact.name}</p>
                <p className={`contact-status ${contact.isOnline ? "online" : "offline"}`}>
                  {contact.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          ))}
          {/* Plus Button to Add Contact */}
          <button className="add-contact-button" onClick={handleAddContact}>
            ➕ Add Contact
          </button>
        </div>
        {/* Profile Section */}
        <div className="profile-section">
          <div className="profile">
            <img
              src="https://via.placeholder.com/40"
              alt="Your Profile"
              className="profile-picture"
            />
            <p className="profile-name">Joe Biden</p>
          </div>
          <button className="settings-button" onClick={() => navigate("/settings")}>
            ⚙️
          </button>
        </div>
      </div>

      {/* Chat Section */}
      <div className="chat-section">
        <div className="chat-header">
          <p className="chat-contact-name">{selectedContact.name}</p>
          <p
            className={`chat-contact-status ${selectedContact.isOnline ? "online" : "offline"}`}
          >
            {selectedContact.isOnline ? "Online" : "Offline"}
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
    </div>
  );
};

export default ChatScreen;
