"use client";

import { useState, useEffect } from "react";
import "../../styles/settings/NotificationsPreferences.css";

export default function NotificationsPreferences() {
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
  });

  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    // Load preferences from localStorage (simulate user settings)
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedLanguage = localStorage.getItem("language") || "en";

    setTheme(savedTheme);
    setLanguage(savedLanguage);
  }, []);

  // Toggle notifications
  const handleToggle = (name: string) => {
    setNotifications((prev) => {
      const updated = { ...prev, [name]: !prev[name as keyof typeof prev] };
      return updated;
    });
  };

  // Change theme
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Change language
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  return (
    <div className="settings-details">
      <h3>Notifications</h3>
      <div className="toggle-setting">
        <label>
          <input
            type="checkbox"
            checked={notifications.orderUpdates}
            onChange={() => handleToggle("orderUpdates")}
          />
          Order Updates (Email/SMS)
        </label>
      </div>
      <div className="toggle-setting">
        <label>
          <input
            type="checkbox"
            checked={notifications.promotions}
            onChange={() => handleToggle("promotions")}
          />
          Promotional Offers (Email/SMS)
        </label>
      </div>
      <div className="toggle-setting">
        <label>
          <input
            type="checkbox"
            checked={notifications.newsletter}
            onChange={() => handleToggle("newsletter")}
          />
          Newsletter Subscription
        </label>
      </div>

      <hr />

      <h3>Theme Preferences</h3>
      <div className="theme-selector">
        <button
          className={theme === "light" ? "active" : ""}
          onClick={() => handleThemeChange("light")}
        >
          Light Mode
        </button>
        <button
          className={theme === "dark" ? "active" : ""}
          onClick={() => handleThemeChange("dark")}
        >
          Dark Mode
        </button>
      </div>

      <hr />

      <h3>Language & Region</h3>
      <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
        <option value="en">English (US)</option>
        <option value="es">Español (Spanish)</option>
        <option value="fr">Français (French)</option>
        <option value="de">Deutsch (German)</option>
      </select>
    </div>
  );
}
