import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import "../css/Settings.css";

const Settings = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [preferences, setPreferences] = useState([
    { id: 1, text: "Lorem ipsum odor amet, consectetur adipiscing elit.", checked: true },
    { id: 2, text: "Lorem ipsum odor amet, consectetur adipiscing elit.", checked: false },
    { id: 3, text: "Lorem ipsum odor amet, consectetur adipiscing elit.", checked: true },
    { id: 4, text: "Lorem ipsum odor amet, consectetur adipiscing elit.", checked: true },
    { id: 5, text: "Lorem ipsum odor amet, consectetur adipiscing elit.", checked: false },
  ]);

  const navigate = useNavigate(); // Navigation hook

  const handlePreferenceChange = (id) => {
    setPreferences((prev) =>
      prev.map((pref) =>
        pref.id === id ? { ...pref, checked: !pref.checked } : pref
      )
    );
  };

  return (
    <div className="settings-container">
      {/* Back Arrow */}
      <div className="back-arrow-container" onClick={() => navigate("/")}>
        <span className="back-arrow">←</span>
      </div>

      {/* Profile Section */}
      <div className="profile-section">
        <img
          className="profile-picture"
          src="https://via.placeholder.com/150"
          alt="User"
        />
        <h2 className="profile-name">
          Joe Biden <span className="edit-icon">✏️</span>
        </h2>
        <label className="online-toggle">
          <input
            type="checkbox"
            checked={isOnline}
            onChange={() => setIsOnline(!isOnline)}
          />
          Online
        </label>
        <button className="apply-button">Apply</button>
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
