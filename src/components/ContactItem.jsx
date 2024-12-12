import React from "react";

const ContactItem = ({ email, username, isSelected, onSelect, isGroup }) => (
  <div className={`contact-item ${isSelected ? "selected" : ""}`} onClick={onSelect}>
    <div className="contact-username">{isGroup ? `👥 ${email}` : username} &nbsp;</div>
    {!isGroup && <div className="contact-email">{email}</div>}
  </div>
);

export default ContactItem;
