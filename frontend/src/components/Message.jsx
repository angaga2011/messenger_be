import React from "react";
import "../css/Message.css";

const Message = ({ text, sender, timestamp }) => {
    return (
        <div className={`message ${sender === "You" ? "sent" : "received"}`}>
            <p className="message-sender">{sender}</p>
            <p className="message-text">{text}</p>
            <p className="message-timestamp">{timestamp}</p>
        </div>
    );
};

export default Message;
