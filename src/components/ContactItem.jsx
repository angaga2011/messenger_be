import React from "react";

const ContactItem = ({ email, username, isSelected, onSelect }) => (
  <div className={`contact-item ${isSelected ? "selected" : ""}`} onClick={onSelect}>
    <div className="contact-email">{email}</div>
    <div className="contact-username">{username}</div>
  </div>
);

export default ContactItem;
