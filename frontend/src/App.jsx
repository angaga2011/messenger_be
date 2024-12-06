import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LogIn from "./components/Log_In";
import SignUp from "./components/SignUp";
import ChatScreen from "./components/ChatScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import Settings from "./components/Settings";


const App = () => {
    // const isAuthenticated = () => {
    //     return !!localStorage.getItem("token"); // Check if the user is logged in

    return (
            <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<LogIn /> } />
                <Route path="/chat" element={<ChatScreen /> } />
                <Route path="/settings" element={<Settings />} />

                {/* <Route path="/chat" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <ChatScreen />
                        </ProtectedRoute> } />
                <Route path="/public-chat" element={<ChatScreen />} /> */}
                <Route path="*" element={<Navigate to="/signup" />} />
            </Routes>
    );
};

export default App;
