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
                {/* Sign Up Route, Redirect to LogIn after SignUp */}
                <Route path="/signup" element={ <SignUp onSignUpSuccess={() => { window.location.href = "/login"; }} /> } />

                {/* Log In Route, Redirect to ChatScreen after LogIn */}
                <Route path="/login" element={<LogIn onLogInSuccess={() => { window.location.href = "/chat"; }} /> } />

                {/* Protected Chat Route */}
                <Route path="/chat" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <ChatScreen />
                        </ProtectedRoute> } />

                {/* Public Chat Route (No Login Required) */}
                <Route path="/public-chat" element={<ChatScreen />} />

                {/* Default Route (Redirect to SignUp) */}
                <Route path="*" element={<Navigate to="/signup" />} />
            </Routes>
        </Router>
    );
};

export default App;
