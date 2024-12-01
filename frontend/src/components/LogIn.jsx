import React, { useState } from "react";
import axios from "axios";
import "../css/LogIn.css";

const LogIn = ({ onLogInSuccess }) => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, formData);
            localStorage.setItem("token", res.data.token); // Store token in localStorage
            onLogInSuccess(); // Navigate to ChatScreen on success
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Log In</h2>
                {error && <p className="login-error">{error}</p>}
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="login-input"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="login-input"
                />
                <button type="submit" className="login-button">Log In</button>
                <a href="/signin" className="login-link">Don't have an account? Sign In</a>
            </form>
        </div>
    );
};

export default LogIn;
