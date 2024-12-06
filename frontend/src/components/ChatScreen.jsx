import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ChatScreen.css";

const ChatScreen = () => {
  const navigate = useNavigate();

  // Declare JWT token at the top
  const jwt = localStorage.getItem("token");

  const [contacts, setContacts] = useState([]); // Contacts state
  const [selectedContact, setSelectedContact] = useState(null); // Selected contact
  const [messages, setMessages] = useState([]); // Messages state
  const [input, setInput] = useState(""); // Chat input state

  // Fetch contacts from the backend
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(
          "https://my-messenger-backend.onrender.com/api/contacts/get-user-contacts",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwt}`
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched contacts:", data.contacts); // Debug log

          // Set contacts directly as an array of emails
          setContacts(data.contacts);
        } else {
          const error = await response.json();
          console.error("Failed to fetch contacts:", error.message);
        }
      } catch (err) {
        console.error("Error fetching contacts:", err);
      }
    };

    fetchContacts();
  }, [jwt]);

  const handleAddContact = async () => {
    const newContactEmail = prompt("Enter the email of the new contact:");
    if (!newContactEmail) return;

    try {
      const response = await fetch(
        "https://my-messenger-backend.onrender.com/api/contacts/addContact",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`
          },
          body: JSON.stringify({
            contacts: [newContactEmail],
          }),
        }
      );

      if (response.ok) {
        setContacts((prevContacts) => [...prevContacts, newContactEmail]);
        alert("Contact added successfully!");
      } else {
        const error = await response.json();
        alert(`Failed to add contact: ${error.message}`);
      }
    } catch (err) {
      console.error("Error adding contact:", err);
      alert("An error occurred while adding the contact.");
    }
  };

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

  return (
    <div className="chat-screen">
      {/* Contact List Section */}
      <div className="contacts-section">
        <div className="contact-list">
          {contacts.map((email, index) => (
            <div
              key={index}
              className={`contact-item ${selectedContact === email ? "selected" : ""}`}
              onClick={() => handleSelectContact(email)}
            >
              <div className="contact-info">
                <p className="contact-name">{email}</p> {/* Render email directly */}
                <p className="contact-status">Offline</p>
              </div>
            </div>
          ))}
          {/* Add Contact Button */}
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
    </div>
  );
};

export default ChatScreen;
