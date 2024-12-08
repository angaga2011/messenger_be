import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import "../css/ChatScreen.css";
import axios from 'axios';

const ChatScreen = () => {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]); // Contacts state
  const [selectedContact, setSelectedContact] = useState(null); // Selected contact
  const [messages, setMessages] = useState([]); // Messages state
  const [input, setInput] = useState(""); // Chat input state
  const [socket, setSocket] = useState(null);

  // Fetch contacts from the backend
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/contacts/get-user-contacts`,
          { withCredentials: true,
            cookie: document.cookie
           }
        );

        if (response.status === 200) {
          const data = response.data;
          console.log("Fetched contacts:", data.contacts); // Debug log

          // Set contacts directly as an array of emails
          setContacts(data.contacts);
        } else {
          console.error("Failed to fetch contacts:", response.data.message);
        }
      } catch (err) {
        console.error("Error fetching contacts:", err);
      }
    };

    fetchContacts();
  }, []);

  // Fetch messages from the backend
  const fetchMessages = async (contactEmail) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/messages/get-user-messages?contactEmail=${contactEmail}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const data = response.data;
        console.log("Fetched messages:", data.messages); // Debug log

        // Set messages directly as an array of messages
        setMessages(data.messages);
      } else {
        console.error("Failed to fetch messages:", response.data.message);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    const newSocket = io(`${import.meta.env.VITE_API_URL}`);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket server:', newSocket.id);
    });

    newSocket.on('receive_message', (message) => {
      console.log('Message received:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on('message_saved', (data) => {
      if (data.success) {
        console.log('Message saved successfully');
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

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
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/contacts/addContact`,
        { contacts: [newContactEmail] },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const responseData = response.data;
        console.log("Response from server:", responseData);

        // Update the state with the new contact
        setContacts((prevContacts) => [...prevContacts, newContactEmail]);
          
        alert("Contact added successfully!");
      } else {
        alert(`Failed to add contact: ${response.data.message}`);
      }
    } catch (err) {
      console.error("Error adding contact:", err);
      alert("An error occurred while adding the contact.");
    }
  };

  const handleLogout = () => {
    // Clear the cookie by setting it to expire immediately
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/signup");
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    fetchMessages(contact); // Fetch messages for the selected contact
  };

  const handleSendMessage = () => {
    if (!socket || input.trim() === "" || !selectedContact) return;

    const newMessage = {
      id: Date.now(),
      text: input,
      sender: "You",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const messageData = {
      receiver: selectedContact,
      content: input,
    };

    socket.emit('send_message', messageData);
    setMessages([...messages, newMessage]);
    setInput("");
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
