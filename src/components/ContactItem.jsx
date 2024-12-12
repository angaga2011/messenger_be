import React from "react";

const ContactItem = ({ email, isSelected, onSelect }) => (
  <div
    className={`contact-item ${isSelected ? "selected" : ""}`}
    onClick={onSelect}
  >
    <p>{email}</p>
  </div>
);

export default ContactItem;
