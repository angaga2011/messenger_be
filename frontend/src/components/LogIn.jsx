import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/LogIn.css";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Save the token in localStorage
        localStorage.setItem("token", data.token);

        // Redirect to the ChatScreen
        navigate("/");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to log in.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred while trying to log in.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Log In</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Log In
        </button>
      </form>
    </div>
  );
};

export default LogIn;
