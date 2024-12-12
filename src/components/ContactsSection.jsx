import React from "react";
import { useNavigate } from "react-router-dom";
import ContactItem from "./ContactItem";
import "../styles/ContactsSection.css";

const ContactsSection = ({ contacts, selectedContact, onSelectContact, onAddContact, onDeleteContact, handleLogout, handleNavigateToSettings }) => (
  <div className="contacts-section">
    <div className="contact-list">
      {contacts.map((contact, index) => (
        <ContactItem
          key={index}
          email={contact.email}
          username={contact.username}
          isSelected={selectedContact === contact.email}
          onSelect={() => onSelectContact(contact.email)}
        />
      ))}
    </div>
    <div className="settings-logout-div">
      <button className="add-contact-button" onClick={onAddContact}>
        ➕
      </button>
      <button className="delete-contact-button" onClick={() => onDeleteContact(selectedContact)}>
        🗑️
      </button>
    </div>
    <div className="settings-logout-div">
      <button className="settings-button" onClick={handleNavigateToSettings}>
        ⚙️
      </button>
    </div>
  </div>
);

export default ContactsSection;
