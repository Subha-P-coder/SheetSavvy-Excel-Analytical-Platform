import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import DashNavbar from "../../components/DashNavbar.jsx";
import "../../styles/Settings.css";
import { toast } from "react-toastify";

const Settings = () => {
  const { userData, setUserData, backendUrl } = useContext(AppContext);
  const [name, setName] = useState(userData?.name || "");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdateProfile = async () => {
    try {
      const res = await axios.put(`${backendUrl}/api/user/update-profile`, {
        name,
      });
      setUserData(res.data.user);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
  };

  const handleChangePassword = async () => {
    try {
      await axios.put(`${backendUrl}/api/user/change-password`, {
        newPassword,
      });
      toast.success("Password changed successfully!");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to change password.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;
    try {
      await axios.delete(`${backendUrl}/api/user/delete-account`);
      toast.success("Account deleted.");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete account.");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="main-content">
        <DashNavbar />
        <div className="settings-page-wrapper">
          <div className="settings-container">
            <h2 className="settings-title">Settings</h2>

            {/* Profile Info */}
            <div className="settings-section">
              <h3>Profile</h3>
              <input
                type="text"
                className="settings-input"
                placeholder="Your name"
                value={name}
                maxLength={25}
                onChange={(e) => setName(e.target.value)}
              />
              <button
                className="settings-button blue-button"
                onClick={handleUpdateProfile}
              >
                Update Profile
              </button>
            </div>

            {/* Change Password */}
            <div className="settings-section">
              <h3>Change Password</h3>
              <input
                type="password"
                className="settings-input"
                placeholder="New password"
                value={newPassword}
                maxLength={25}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                className="settings-button green-button"
                onClick={handleChangePassword}
              >
                Change Password
              </button>
            </div>

            {/* Delete Account */}
            <div className="settings-section danger-section">
              <h3>Danger Zone</h3>
              <button
                className="settings-button red-button"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
