import React from "react";

const ContactItem = ({ email, username, isSelected, onSelect }) => (
  <div className={`contact-item ${isSelected ? "selected" : ""}`} onClick={onSelect}>
    <div className="contact-username">{username} &nbsp;</div>
    <div className="contact-email">{email}</div>
  </div>
);

export default ContactItem;
