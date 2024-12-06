import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ChatScreen.css";

const ChatScreen = () => {
  const [contacts, setContacts] = useState([]); // Contacts state
  const [selectedContact, setSelectedContact] = useState(null); // Selected contact
  const [messages, setMessages] = useState([]); // Messages state
  const [input, setInput] = useState(""); // Chat input state
  const navigate = useNavigate();
  const userToken = "YOUR_JWT_TOKEN"; // Replace with the actual token from authentication

  // Fetch contacts from the backend
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        // Retrieve token from localStorage and assign it to YOUR_JWT_TOKEN
        const YOUR_JWT_TOKEN = localStorage.getItem("token");
  
        const response = await fetch("https://my-messenger-backend.onrender.com/api/contacts/get-user-contacts", {
                                      
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${YOUR_JWT_TOKEN}`, // Use the token from localStorage
          },
        });
  
        if (response.ok) {
          const data = await response.json();
  
          // Map the fetched data to the desired format for setContacts()
          const formattedContacts = data.contacts.map((contact) => ({
            id: contact.id, // Assuming contacts have an `id` field
            name: contact.name, // Assuming contacts have a `name` field
            email: contact.email, // Assuming contacts have an `email` field
          }));
  
          setContacts(formattedContacts); // Set the formatted contacts
        } else {
          const error = await response.json();
          console.error("Failed to fetch contacts:", error.message);
        }
      } catch (err) {
        console.error("Error fetching contacts:", err);
      }
    };
  
    fetchContacts();

  
  }, [userToken]);

  const handleAddContact = async () => {
    const newContactEmail = prompt("Enter the email of the new contact:");
    if (!newContactEmail) return;

    try {
      const response = await fetch("https://my-messenger-backend.onrender.com/api/contacts/addContact", {
        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`, // Attach the JWT token
        },
        body: JSON.stringify({
          email: "user@example.com", // Replace with the authenticated user's email
          contacts: [newContactEmail],
        }),
      });

      if (response.ok) {
        const updatedContacts = await response.json();
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
          {contacts.map((contact, index) => (
            <div
              key={index}
              className={`contact-item ${selectedContact === contact ? "selected" : ""}`}
              onClick={() => handleSelectContact(contact)}
            >
              <div className="contact-info">
                <p className="contact-name">{contact}</p>
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
          <p className="chat-contact-name">{selectedContact || "Select a contact"}</p>
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
