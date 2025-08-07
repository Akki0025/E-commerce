"use client";

import { useState } from "react";
import "../../styles/settings/AccountSecurity.css";

export default function AccountSecurity() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Simulate updating password
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) throw new Error("Failed to update password");
      alert("Password changed successfully!");
    } catch (error) {
      console.error(error);
      alert("Error changing password.");
    }
  };

  // Simulate enabling/disabling 2FA
  const handleToggle2FA = async () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    alert(`Two-Factor Authentication ${!twoFactorEnabled ? "Enabled" : "Disabled"}`);
  };

  return (
    <div className="settings-details">
      <h3>Change Password</h3>
      <label>
        Current Password:
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </label>
      <label>
        New Password:
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </label>
      <label>
        Confirm New Password:
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </label>
      <button onClick={handleChangePassword}>Update Password</button>

      <hr />

      <h3>Two-Factor Authentication (2FA)</h3>
      <p>Enhance your account security by enabling 2FA.</p>
      <button onClick={handleToggle2FA}>
        {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
      </button>

      <hr />

      <h3>Manage Login Sessions</h3>
      <p>View and manage devices logged into your account.</p>
      <ul>
        <li>📱 iPhone 14 (Active Now) <button>Logout</button></li>
        <li>💻 MacBook Pro - Chrome <button>Logout</button></li>
      </ul>

      <hr />

      <h3>Delete Account</h3>
      <p>⚠️ This action is irreversible. Your data will be permanently deleted.</p>
      <button className="delete-btn">Delete Account</button>
    </div>
  );
}
