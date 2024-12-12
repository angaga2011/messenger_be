import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Settings.css";

const Settings = () => {
  const [userEmail, setUserEmail] = useState('');
  const [username, setUsername] = useState('');
  const [preferences, setPreferences] = useState([
    { id: 1, text: "Lorem ipsum odor amet, consectetur adipiscing elit.", checked: true },
    { id: 2, text: "Lorem ipsum odor amet, consectetur adipiscing elit.", checked: false },
    { id: 3, text: "Lorem ipsum odor amet, consectetur adipiscing elit.", checked: true },
    { id: 4, text: "Lorem ipsum odor amet, consectetur adipiscing elit.", checked: true },
    { id: 5, text: "Lorem ipsum odor amet, consectetur adipiscing elit.", checked: false },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedUsername = localStorage.getItem('username');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handlePreferenceChange = (id) => {
    setPreferences((prev) =>
      prev.map((pref) =>
        pref.id === id ? { ...pref, checked: !pref.checked } : pref
      )
    );
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/delete-account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("username");
        navigate("/signup");
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const error = await response.json();
          alert(`Failed to delete account: ${error.message}`);
        } else {
          const errorText = await response.text();
          alert(`Failed to delete account: ${errorText}`);
        }
      }
    } catch (err) {
      console.error("Error deleting account:", err);
      alert("An error occurred while deleting the account.");
    }
  };

  const userDetails = [
    { label: "Email", value: userEmail },
    { label: "Username", value: username },
  ];

  return (
    <div className="settings-container">
      {/* Back Arrow */}
      <div className="back-arrow-container" onClick={() => navigate("/chat")}>
        <span className="back-arrow">←</span>
      </div>

      {/* Profile Section */}
      <div className="profile-section">
        <img
          className="profile-picture"
          src="https://via.placeholder.com/150"
          alt="User"
        />
        {userDetails.map((detail, index) => (
          <h2 key={index} className="profile-detail">
            {detail.label}: {detail.value} <span className="edit-icon">✏️</span>
          </h2>
        ))}
        
        <button className="apply-button">Apply</button>
        <button className="delete-account-button" onClick={handleDeleteAccount}>Delete Account</button>
      </div>

      {/* General Section */}
      <div className="general-section">
        <h2 className="section-title">General</h2>
        {preferences.map((pref) => (
          <div key={pref.id} className="preference-item">
            <input
              type="checkbox"
              checked={pref.checked}
              onChange={() => handlePreferenceChange(pref.id)}
            />
            <span
              className={`preference-text ${
                pref.checked ? "text-checked" : "text-unchecked"
              }`}
            >
              {pref.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
