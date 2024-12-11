import React from "react";
import { useNavigate } from "react-router-dom";
import ContactItem from "./ContactItem";
import "../styles/ContactsSection.css";

const ContactsSection = ({ contacts, selectedContact, onSelectContact, onAddContact, handleLogout, handleNavigateToSettings }) => (
  <div className="contacts-section">
    <div className="contact-list">
      {contacts.map((email, index) => (
        <ContactItem
          key={index}
          email={email}
          isSelected={selectedContact === email}
          onSelect={() => onSelectContact(email)}
        />
      ))}
    </div>
    <button className="add-contact-button" onClick={onAddContact}>
      ➕ Add Contact
    </button>
    <div classname="settings-logout-div">
    <button className="settings-button" onClick={handleNavigateToSettings}>
      ⚙️
    </button>
    <button className="logout-button" onClick={handleLogout}>
      🔐
    </button>
</div>
  </div>
);

export default ContactsSection;
