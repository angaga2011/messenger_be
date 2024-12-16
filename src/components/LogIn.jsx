import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "../styles/LogIn.css";

const LogIn = () => {
    // State to manage form data and error messages
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate(); // To navigate to the next page

    // Handle input changes and update form data state
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send POST request with email and password to log in the user
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                email: formData.email,
                password: formData.password,
            });

            // Store the token and user details in local storage
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userName', res.data.username);
            localStorage.setItem('userEmail', formData.email);

            // Navigate to the chat screen on successful login
            navigate('/chat');
            window.location.reload(); // Temporary fix to reload the page
        } catch (err) {
            console.error('Error logging in:', err);
            setError('Invalid email or password');
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
                <Link to="/signup" className="login-link">Don't have an account? Sign Up</Link>
            </form>
        </div>
    );
};

export default LogIn;
