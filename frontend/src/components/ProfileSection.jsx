import React from "react";
import "../css/ProfileSection.css";

const ProfileSection = ({ handleLogout, navigate }) => {
    return (
        <div className="profile-section">
            <div className="profile">
                <img
                    src="https://via.placeholder.com/40"
                    alt="Your Profile"
                    className="profile-picture"
                />
                <p className="profile-name">Joe Biden</p>
            </div>
            <button onClick={handleLogout} className="logout-button">
                Logout 🔐 
            </button>
            <button className="settings-button" onClick={() => navigate("/settings")}>
                ⚙️
            </button>
        </div>
    );
};

export default ProfileSection;