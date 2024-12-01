import React from "react";
import "../css/ContactList.css";

const ContactList = ({ contacts, onSelectContact, selectedContact }) => {
    return (
        <div className="contact-list">
            {contacts.map((contact) => (
                <div
                    key={contact.id}
                    className={`contact-item ${
                        selectedContact.id === contact.id ? "selected" : ""
                    }`}
                    onClick={() => onSelectContact(contact)}
                >
                    <p>{contact.name}</p>
                    <p className={`status ${contact.isOnline ? "online" : "offline"}`}>
                        {contact.isOnline ? "Online" : "Offline"}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default ContactList;
