import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import ChatScreen from "./components/ChatScreen";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
    const isAuthenticated = () => {
        return !!localStorage.getItem("token"); // Check if the user is logged in
    };

    return (
        <Router>
            <Routes>
                {/* Sign Up Route */}
                <Route
                    path="/signup"
                    element={
                        <SignUp
                            onSignUpSuccess={() => {
                                window.location.href = "/login"; // Redirect to LogIn after SignUp
                            }}
                        />
                    }
                />

                {/* Log In Route */}
                <Route
                    path="/login"
                    element={
                        <LogIn
                            onLogInSuccess={() => {
                                window.location.href = "/chat"; // Redirect to ChatScreen after LogIn
                            }}
                        />
                    }
                />

                {/* Chat Screen (Protected Route) */}
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <ChatScreen />
                        </ProtectedRoute>
                    }
                />

                {/* Default Route (Redirect to SignUp) */}
                <Route path="*" element={<Navigate to="/signup" />} />
            </Routes>
        </Router>
    );
};

export default App;
