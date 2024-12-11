import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/LogIn.css";

const LogIn = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate(); // To navigate to the next page

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send POST request with email and password
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                email: formData.email,
                password: formData.password,
            });
            
            console.log("Server Response:", res.data);

            // Save the token and email in localStorage
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userEmail", formData.email);

            // Navigate to the chat screen
            navigate("/chat");
            
        } catch (err) {
            // Display error message from server or fallback to "Login failed"
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Log In</h2>
                {error && <p className="login-error">{error}</p>}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
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
                <a href="/signup" className="login-link">Don't have an account? Sign Up</a>
            </form>
        </div>
    );
};

export default LogIn;
