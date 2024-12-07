import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../css/ChatScreen.css";

const ChatScreen = ({ userEmail }) => {
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

  // Fetch messages from the backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          "https://my-messenger-backend.onrender.com/api/messages/get-user-messages",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwt}`
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched messages:", data.messages); // Debug log

        // Set messages directly as an array of messages
        setMessages(data.messages);
      } else {
        const error = await response.json();
        console.error("Failed to fetch messages:", error.message);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [jwt]);

  const handleAddContact = async () => {
    const newContactEmail = prompt("Enter the email of the new contact:");
    if (!newContactEmail) return;
  
    // Check if the contact is already in the list before making the API call
    const isContactAlreadyAdded = contacts.includes(newContactEmail);
    if (isContactAlreadyAdded) {
      alert("Contact already added.");
      return;
    }

    try {

      if (!jwt) {
        alert("You are not logged in. Please log in first.");
        return;
      }
  
      const response = await fetch(
        "https://my-messenger-backend.onrender.com/api/contacts/addContact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Ensure JSON content is specified
            Authorization: `Bearer ${jwconstt}`, // Include the JWT
          },
          body: JSON.stringify({
            contacts: [newContactEmail], // Send the new contact as an array
          }),
        }
      );
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("Response from server:", responseData);
  
        // Update the state with the new contact
        setContacts((prevContacts) => [...prevContacts, newContactEmail]);
          
        alert("Contact added successfully!");
      } else {
        // Handle response errors
        const error = await response.json();
        alert(`Failed to add contact: ${error.message}`);
      }
    } catch (err) {
      console.error("Error adding contact:", err);
      alert("An error occurred while adding the contact.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signup");
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
          <button onClick={handleLogout} className="logout-button">
          Logout 🔐 
        </button>
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
