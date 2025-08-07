"use client";

import { useState, useEffect } from "react";
import "../../styles/settings/PrivacyData.css";

interface BlockedUser {
  id: string;
  username: string;
}

export default function PrivacyData() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
  });

  useEffect(() => {
    // Fetch blocked users (Mock API)
    const fetchBlockedUsers = async () => {
      const res = await fetch("/api/blocked-users");
      if (res.ok) {
        const data = await res.json();
        setBlockedUsers(data.blockedUsers);
      }
    };

    fetchBlockedUsers();
  }, []);

  // Unblock user
  const unblockUser = async (id: string) => {
    const res = await fetch(`/api/blocked-users/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBlockedUsers((prev) => prev.filter((user) => user.id !== id));
    }
  };

  // Download account data
  const downloadData = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch("/api/download-data");
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "account_data.json";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (error) {
      console.error("Error downloading data:", error);
    }
    setIsDownloading(false);
  };

  // Handle privacy setting change
  const handlePrivacyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrivacySettings({ profileVisibility: e.target.value });
    // TODO: Update backend with new privacy setting
  };

  return (
    <div className="settings-details">
      <h3>Download Account Data</h3>
      <button onClick={downloadData} disabled={isDownloading}>
        {isDownloading ? "Downloading..." : "Download My Data"}
      </button>

      <hr />

      <h3>Blocked Users</h3>
      {blockedUsers.length > 0 ? (
        <ul className="blocked-users-list">
          {blockedUsers.map((user) => (
            <li key={user.id}>
              <span>{user.username}</span>
              <button onClick={() => unblockUser(user.id)}>Unblock</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No blocked users.</p>
      )}

      <hr />

      <h3>Privacy Settings</h3>
      <label>Profile Visibility:</label>
      <select value={privacySettings.profileVisibility} onChange={handlePrivacyChange}>
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>
    </div>
  );
}
