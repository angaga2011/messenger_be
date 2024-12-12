import React from "react";

const ContactItem = ({ email, isSelected, onSelect }) => (
  <div className={`contact-item ${isSelected ? "selected" : ""}`} onClick={onSelect}>
    <div className="contact-email">{email}</div>
  </div>
);

export default ContactItem;
