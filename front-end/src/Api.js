// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Adjust to your back-end URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
