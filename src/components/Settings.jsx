import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import "../styles/Settings.css";

const Settings = () => {
  const [user, setUser] = useState({ username: "", email: "" });
  const [preferences, setPreferences] = useState([]);
  const navigate = useNavigate(); // Navigation hook

  // Function to fetch logged-in user data
  const getUserData = async () => {
    try {
      const response = await fetch('/api/user'); // Example API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        return {
          username: data.username,
          email: data.email,
          preferences: data.preferences,
        };
      } else {
        const text = await response.text();
        console.error('Response was not JSON:', text);
        throw new Error('Response was not JSON');
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      return { username: '', email: '', preferences: [] };
    }
  };

  useEffect(() => {
    // Fetch user data and preferences from an API or context
    const fetchUserData = async () => {
      const userData = await getUserData(); // Replace with actual data fetching
      setUser({ username: userData.username, email: userData.email });
      setPreferences(userData.preferences);
    };

    fetchUserData();
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

  return (
    <div className="settings-container">
      {/* Back Arrow */}
      <div className="back-arrow-container" onClick={() => navigate("/chat")}>
        <span className="back-arrow">←</span>
      </div>

      {/* User Info Section */}
      <div className="user-info-section">
        <div className="user-info-item">
          <span className="user-info-label">Username:</span>
          <span className="user-info-value">{user.username}</span>
        </div>
        <div className="user-info-item">
          <span className="user-info-label">Email:</span>
          <span className="user-info-value">{user.email}</span>
        </div>
      </div>

      {/* Profile Section */}
      <div className="profile-section">
        <img
          className="profile-picture"
          src="https://via.placeholder.com/150"
          alt="User"
        />
        <h2 className="profile-name">
          {user.username} <span className="edit-icon">✏️</span>
        </h2>
        <p className="profile-email">{user.email}</p>
        
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
              {pref.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
