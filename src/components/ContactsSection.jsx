import React from "react";
import ContactItem from "./ContactItem";
import "../styles/ContactsSection.css";

const ContactsSection = ({ contacts, selectedContact, onSelectContact, onAddContact }) => (
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
    <div classname="separator">
    <button className="settings-button" onClick={() => navigate("/settings")}>
      ⚙️
    </button>
    <button className="logout-button" onClick={handleLogout}>
      🔐
    </button>
</div>
  </div>
);

export default ContactsSection;
