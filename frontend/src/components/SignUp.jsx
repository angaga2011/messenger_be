
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SignUp = ({ onSignUpSuccess }) => {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make the POST request to the backend
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                username: formData.username,
                email: formData.email, // Include email in the request
                password: formData.password,
            });

            // Call the success callback if registration succeeds
            onSignUpSuccess();
        } catch (err) {
            // Set error message if registration fails
            setError(err.response?.data?.message || "Sign Up failed");
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2 className="signup-title">Sign Up</h2>
                {error && <p className="signup-error">{error}</p>}
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="signup-input"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="signup-input"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="signup-input"
                />
                <Link to="/login">
                    <button type="submit" className="signup-button">Sign Up</button>
                </Link>
                <a href="/login" className="signup-link">Already have an account? Log In</a>
            </form>
        </div>
    );
};

export default SignUp;
