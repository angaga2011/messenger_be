// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContactList from '../components/ContactList';
import Chat from '../components/Chat';

function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/contacts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(response.data);
    };
    fetchContacts();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <ContactList contacts={contacts} setSelectedContact={setSelectedContact} />
      {selectedContact && <Chat recipient={selectedContact} />}
    </div>
  );
}

export default Dashboard;
