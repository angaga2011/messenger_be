// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Chat({ recipient }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/messages?sender=${recipient}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data);
    };
    fetchMessages();
  }, [recipient]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.post(
      '/api/messages',
      { sender: 'your-user-id', recipient, content: message },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setMessages([...messages, { content: message, sender: 'your-user-id' }]);
    setMessage('');
  };

  return (
    <div>
      <h2>Chat with {recipient}</h2>
      <div>
        {messages.map((msg, idx) => (
          <div key={idx}>{msg.content}</div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Type a message" 
          required 
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
