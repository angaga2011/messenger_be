import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import ChatScreen from './components/ChatScreen';
import Settings from './components/Settings';
import "./styles/GeneralStyles.css"; // Import the general styles

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const authenticate = async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const response = await fetch('https://my-messenger-backend.onrender.com/api/auth/authenticate', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data.valid;
    } catch (err) {
      console.error('Error validating token:', err);
      return false;
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const valid = await authenticate();
      setIsAuthenticated(valid);
      setLoading(false);
    };

    checkAuthentication();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/chat" element={isAuthenticated ? <ChatScreen /> : <Navigate to="/login" replace />} />
          <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />} />
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to="/chat" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
    </div>
  );
};

export default App;
