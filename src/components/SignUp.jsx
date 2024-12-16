import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/SignUp.css";

const SignUp = () => {
    // State to manage form data and error messages
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate(); // To navigate after signup

    // Handle input changes and update form data state
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make the POST request to the backend to register the user
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });

            // Navigate to login page on successful registration
            navigate("/login");
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
                <button type="submit" className="signup-button">Sign Up</button>
                <Link to="/login" className="signup-link">Already have an account? Log In</Link>
            </form>
        </div>
    );
};

export default SignUp;
