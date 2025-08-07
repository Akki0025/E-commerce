"use client";

export default function ProfileSettings() {
  return (
    <div className="settings-details">
      <h3>Edit Profile</h3>
      <label>
        Profile Picture:
        <input type="file" />
      </label>
      <label>
        Name:
        <input type="text" placeholder="Enter your name" />
      </label>
      <label>
        Email:
        <input type="email" placeholder="Enter your email" />
      </label>
      <button>Save Changes</button>
    </div>
  );
}
