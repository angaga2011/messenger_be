import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import "../styles/ChatScreen.css";
import ContactsSection from "./ContactsSection";
import ChatSection from "./ChatSection";

const ChatScreen = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const jwt = localStorage.getItem("token");

  const [contacts, setContacts] = useState([]); // Contacts state
  const [selectedContact, setSelectedContact] = useState(null); // Selected contact
  const [messages, setMessages] = useState([]); // Messages state
  const [input, setInput] = useState(""); // Chat input state
  const [socket, setSocket] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('isDarkMode') === 'true'); // Dark mode state

  // Create a ref for the chat messages container
  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to the bottom of the chat when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!jwt) {
      navigate("/login");
    }
  }, [jwt, navigate]);

  // Fetch contacts from the backend
  const fetchContacts = async () => {
    try {
      const [contactsResponse, groupsResponse] = await Promise.all([
        fetch("https://my-messenger-backend.onrender.com/api/contacts/get-user-contacts", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`
          },
        }),
        fetch("https://my-messenger-backend.onrender.com/api/groups/get-user-groups", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`
          },
        })
      ]);

      if (contactsResponse.ok && groupsResponse.ok) {
        const contactsData = await contactsResponse.json();
        const groupsData = await groupsResponse.json();

        const contactsWithGroups = [
          ...contactsData.contacts.map(contact => ({ ...contact, isGroup: false })),
          ...groupsData.groups.map(group => ({ email: group.groupName, username: null, isGroup: true }))
        ];

        setContacts(contactsWithGroups);
      } else {
        const contactsError = await contactsResponse.json();
        const groupsError = await groupsResponse.json();
        console.error("Failed to fetch contacts or groups:", contactsError.message, groupsError.message);
      }
    } catch (err) {
      console.error("Error fetching contacts or groups:", err);
    }
  };

  // Auto-update contacts at a regular interval
  useEffect(() => {
    fetchContacts();
    const intervalId = setInterval(fetchContacts, 1000);

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [jwt]);

  // Fetch messages from the backend
  const fetchMessages = useCallback(async (contactEmail) => {
    setMessages([]); // Clear messages before fetching new ones
    try {
      const response = await fetch(
        `https://my-messenger-backend.onrender.com/api/messages/get-user-messages?contactEmail=${contactEmail}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages.map(message => ({
          ...message,
          isGroup: message.isGroup !== undefined ? message.isGroup : false
        })));
      } else {
        const error = await response.json();
        console.error("Failed to fetch messages:", error.message);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  }, [jwt]);

  // Connect to the socket server
  useEffect(() => {
    const newSocket = io('https://my-messenger-backend.onrender.com');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('register_email', { email: userEmail });
    });

    newSocket.on('receive_message', (message) => {
      if ((message.isGroup && selectedContact === message.receiver) || (!message.isGroup && selectedContact === message.sender)) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userEmail, selectedContact]);

  // Scroll to the bottom of the chat when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to add a new contact or group of contacts
  const handleAddContact = async () => {
    const isGroup = window.confirm("Do you want to create a group?");
    if (isGroup) {
      const groupName = prompt("Enter the name of the group:");
      if (!groupName) return;

      const participantEmails = prompt("Enter the emails of the participants, separated by commas:");
      if (!participantEmails) return;

      const participants = participantEmails.split(",").map(email => email.trim());
      participants.push(userEmail); // Add the user who created the group

      try {
        if (!jwt) {
          alert("You are not logged in. Please log in first.");
          return;
        }

        const response = await fetch(
          "https://my-messenger-backend.onrender.com/api/groups/create-group",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({
              groupName,
              participants,
            }),
          }
        );

        if (response.ok) {
          setContacts((prevContacts) => [...prevContacts, { email: groupName, username: null, isGroup: true }]);
          alert("Group created successfully!");
        } else {
          const error = await response.json();
          alert(`Failed to create group: ${error.message}`);
        }
      } catch (err) {
        console.error("Error creating group:", err);
        alert("An error occurred while creating the group.");
      }
    } else {
      const newContactEmail = prompt("Enter the email of the new contact:");
      if (!newContactEmail) return;

      // Check if the contact is already in the list before making the API call
      const isContactAlreadyAdded = contacts.some(contact => contact.email === newContactEmail);
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
          "https://my-messenger-backend.onrender.com/api/contacts/add-contact",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({
              contacts: [newContactEmail],
            }),
          }
        );

        if (response.ok) {
          setContacts((prevContacts) => [...prevContacts, { email: newContactEmail, username: null, isGroup: false }]); //Be sure to update this in case of errors and bugs
          alert("Contact added successfully!");
        } else {
          const error = await response.json();
          alert(`Failed to add contact: ${error.message}`);
        }
      } catch (err) {
        console.error("Error adding contact:", err);
        alert("An error occurred while adding the contact.");
      }
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  // Function to navigate to settings
  const handleNavigateToSettings = () => {
    navigate("/settings");
  };

  // Function to delete a contact or group
  const onDeleteContact = async (email) => {
    if (!email) return;

    try {
      const isGroup = contacts.find(contact => contact.email === email)?.isGroup || false;
      const endpoint = isGroup ? "groups/delete-group" : "contacts/delete-contact";

      const response = await fetch(
        `https://my-messenger-backend.onrender.com/api/${endpoint}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({ contactEmail: email, groupName: email }),
        }
      );

      if (response.ok) {
        setContacts(contacts.filter(contact => contact.email !== email));
        setSelectedContact(null); // Clear the selected contact
        alert("Contact or group deleted successfully!");
      } else {
        const error = await response.json();
        alert(`Failed to delete contact or group: ${error.message}`);
      }
    } catch (err) {
      console.error("Error deleting contact or group:", err);
      alert("An error occurred while deleting the contact or group.");
    }
  };

  // Function to handle selecting a contact
  const handleSelectContact = useCallback((contactEmail) => {
    setSelectedContact(contactEmail);
    fetchMessages(contactEmail);
  }, [fetchMessages]);

  // Function to handle sending a message
  const handleSendMessage = useCallback(() => {
    if (!socket || input.trim() === "" || !selectedContact) return;

    const newMessage = {
      content: input,
      sender: userEmail,
      createdAt: new Date(),
      isGroup: contacts.find(contact => contact.email === selectedContact)?.isGroup || false,
    };

    const messageData = {
      sender: userEmail,
      receiver: selectedContact,
      content: input,
      isGroup: newMessage.isGroup,
    };

    socket.emit('send_message', messageData);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
  }, [socket, input, selectedContact, userEmail, jwt, contacts]);

  // Memoize the contacts and messages to prevent unnecessary re-renders
  const memoizedContacts = useMemo(() => contacts, [contacts]);
  const memoizedMessages = useMemo(() => messages, [messages]);
  
  return (
    <div className={`chat-screen ${isDarkMode ? 'dark-mode' : ''}`}>
      <ContactsSection
        contacts={memoizedContacts}
        selectedContact={selectedContact}
        onSelectContact={handleSelectContact}
        onAddContact={handleAddContact}
        handleLogout={handleLogout}
        handleNavigateToSettings={handleNavigateToSettings}
        onDeleteContact={onDeleteContact}
      />
      <ChatSection
        selectedContact={selectedContact}
        messages={memoizedMessages}
        input={input}
        setInput={setInput}
        onSendMessage={handleSendMessage}
        userEmail={userEmail}
        messagesEndRef={messagesEndRef}
      />
    </div>
  );
};

export default ChatScreen;
