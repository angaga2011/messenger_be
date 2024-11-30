// src/components/LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginForm({ type }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = type === 'login' ? '/api/auth/login' : '/api/auth/register';
    try {
      const response = await axios.post(url, { email, password });
      if (type === 'login') {
        localStorage.setItem('token', response.data.token); // Store JWT in localStorage
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError('Something went wrong!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{type === 'login' ? 'Login' : 'Register'}</h2>
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
      {error && <p>{error}</p>}
      <button type="submit">{type === 'login' ? 'Login' : 'Register'}</button>
    </form>
  );
}

export default LoginForm;
