import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import "../css/ChatScreen.css";
import axios from 'axios';
import ContactList from './ContactList'; // Import the ContactList component
import ChatSection from './ChatSection'; // Import the ChatSection component
import ProfileSection from './ProfileSection'; // Import the ProfileSection component

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
          { withCredentials: true }
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

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    // Fetch messages for the selected contact
    fetchMessages(contact);
  };

  const fetchMessages = async (contact) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/messages/get-messages`,
        { params: { contact }, withCredentials: true }
      );

      if (response.status === 200) {
        const data = response.data;
        console.log("Fetched messages:", data.messages); // Debug log

        // Set messages state
        setMessages(data.messages);
      } else {
        console.error("Failed to fetch messages:", response.data.message);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleAddContact = () => {
    const newContact = prompt("Enter the email of the new contact:");
    if (newContact) {
      // Assuming you have an API endpoint to add a new contact
      axios.post(`${import.meta.env.VITE_API_URL}/api/contacts/add`, { email: newContact }, { withCredentials: true })
        .then(response => {
          if (response.status === 200) {
            // Update the contacts state with the new contact
            setContacts(prevContacts => [...prevContacts, newContact]);
            console.log("Contact added successfully:", newContact);
          } else {
            console.error("Failed to add contact:", response.data.message);
          }
        })
        .catch(err => {
          console.error("Error adding contact:", err);
        });
    }
  };

  const handleLogout = () => {
    axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {}, { withCredentials: true })
      .then(response => {
        if (response.status === 200) {
          navigate("/login");
        } else {
          console.error("Failed to logout:", response.data.message);
        }
      })
      .catch(err => {
        console.error("Error logging out:", err);
      });
  };

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    const newMessage = {
      text: input,
      sender: "You",
      timestamp: new Date().toLocaleTimeString(),
    };

    // Assuming you have an API endpoint to send a message
    axios.post(`${import.meta.env.VITE_API_URL}/api/messages/send`, { message: newMessage, contact: selectedContact }, { withCredentials: true })
      .then(response => {
        if (response.status === 200) {
          setMessages(prevMessages => [...prevMessages, newMessage]);
          setInput("");
        } else {
          console.error("Failed to send message:", response.data.message);
        }
      })
      .catch(err => {
        console.error("Error sending message:", err);
      });
  };

  return (
    <div className="chat-screen">
      <ContactList
        contacts={contacts}
        onSelectContact={handleSelectContact}
        selectedContact={selectedContact}
        handleAddContact={handleAddContact}
      />
      <ProfileSection
        handleLogout={handleLogout}
        navigate={navigate}
      />
      <ChatSection
        selectedContact={selectedContact}
        messages={messages}
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatScreen;
