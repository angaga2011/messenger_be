import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LogIn from "./components/Log_In";
import SignUp from "./components/SignUp";
import ChatScreen from "./components/ChatScreen";
import Settings from "./components/Settings";
import "./styles/GeneralStyles.css"; // Import the general styles

// import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // State to manage loading while checking authentication

    // Function to validate the token by calling the backend's authenticate function
    const authenticate = async () => {
        const token = localStorage.getItem("token");
        if (!token) return false;

        try {
            const response = await fetch("https://my-messenger-backend.onrender.com/api/auth/authenticate", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`, // Include the JWT in the Authorization header
                },
            });

            const data = await response.json();
            return data.valid; // Expecting `true` or `false` from the backend
        } catch (err) {
            console.error("Error validating token:", err);
            return false;
        }
    };

    // useEffect to check authentication when the app loads
    useEffect(() => {
        const checkAuthentication = async () => {
            const valid = await authenticate();
            setIsAuthenticated(valid);
            setLoading(false); // Set loading to false once authentication is complete
        };

        checkAuthentication();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Show a loading screen while checking authentication
    }

    return (
        <div className="App">
        <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/chat" element={<ChatScreen />} />
            <Route path="/settings" element={<Settings />} />

            {/* Redirect based on authentication */}
            <Route
                path="*"
                element={
                    isAuthenticated ? (
                        <Navigate to="/chat" replace />
                    ) : (
                        <Navigate to="/signup" replace />
                    )
                }
            />
        </Routes>
        </div>
    );
};

export default App;
