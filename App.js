import React, { useState } from 'react';
import './styles/App.css';

function App() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // State to toggle between sign-up and login

  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here (usually involves API call to verify credentials)
    console.log("Logged in with", username, email, password);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    // Handle sign-up logic here (usually involves API call to create a new user)
    console.log("Signed up with", username, email, password);
  };

  return (
    <div className="App">
      <div className="login-container">
        <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
        <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
          {isSignUp && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
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
          {isSignUp && (
            <input
              type="password"
              placeholder="Confirm Password"
              required
            />
          )}
          <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
        </form>
        <a href="#" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'}
        </a>
      </div>
    </div>
  );
}

export default App;
