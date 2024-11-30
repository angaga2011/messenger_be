// src/components/ContactList.js
import React from 'react';

function ContactList({ contacts, setSelectedContact }) {
  return (
    <div>
      <h2>Contacts</h2>
      <ul>
        {contacts.map((contact, idx) => (
          <li key={idx} onClick={() => setSelectedContact(contact)}>
            {contact}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContactList;
