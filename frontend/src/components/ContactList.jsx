import React, { useEffect, useState } from "react";
import axios from 'axios';
import "../css/ContactList.css";

const ContactList = ({ onSelectContact, selectedContact, handleAddContact }) => {
    const [contacts, setContacts] = useState([]); // Contacts state

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

    return (
        <div className="contact-list">
            {contacts.map((email, index) => (
                <div
                    key={index}
                    className={`contact-item ${selectedContact === email ? "selected" : ""}`}
                    onClick={() => onSelectContact(email)}
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
    );
};

export default ContactList;
