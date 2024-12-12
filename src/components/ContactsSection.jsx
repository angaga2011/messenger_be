import React from "react";
import { useNavigate } from "react-router-dom";
import ContactItem from "./ContactItem";
import "../styles/ContactsSection.css";

const ContactsSection = ({ contacts, selectedContact, onSelectContact, onAddContact, onDeleteContact, handleLogout, handleNavigateToSettings }) => {
  const handleAddContact = async () => {
    const isGroup = window.confirm("Do you want to create a group?");
    let newContacts = [];

    if (isGroup) {
      const groupEmails = prompt("Enter the emails of the contacts separated by a comma:");
      if (groupEmails) {
        newContacts = groupEmails.split(",").map(email => email.trim());
      }
    } else {
      const newContactEmail = prompt("Enter the email of the new contact:");
      if (newContactEmail) {
        newContacts = [newContactEmail.trim()];
      }
    }

    if (newContacts.length > 0) {
      onAddContact(newContacts);
    }
  };

  return (
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
      <div className="settings-logout-div">
        <button className="add-contact-button" onClick={handleAddContact}>
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
        <button className="logout-button" onClick={handleLogout}>
          🔐
        </button>
      </div>
    </div>
  );
};

export default ContactsSection;
