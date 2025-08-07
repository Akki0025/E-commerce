"use client";

import { useState } from "react";
import ProfileSettings from "../../components/settings/ProfileSettings";
import AccountSecurity from "../../components/settings/AccountSecurity";
import AddressShipping from "../../components/settings/AddressShipping";
import NotificationsPreferences from "../../components/settings/NotificationsPreferences";
import OrdersPayments from "../../components/settings/OrdersPayments";
import PrivacyData from "../../components/settings/PrivacyData";
import { IoIosArrowForward, IoMdArrowDropdown } from "react-icons/io";

const settingsSections = [
  { title: "Profile Settings", component: <ProfileSettings /> },
  { title: "Account & Security", component: <AccountSecurity /> },
  { title: "Address & Shipping", component: <AddressShipping /> },
  { title: "Notifications & Preferences", component: <NotificationsPreferences /> },
  { title: "Orders & Payment Methods", component: <OrdersPayments /> },
  { title: "Privacy & Data", component: <PrivacyData /> },
];

export default function SettingsPage() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  return (
    <div style={styles.settingsPage}>
      {/* Left Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Settings</h2>
        <ul style={styles.menu}>
          {settingsSections.map(({ title }) => (
            <li
              key={title}
              style={{
                ...styles.menuItem,
                ...(openSection === title ? styles.activeMenuItem : {}),
              }}
              onClick={() => toggleSection(title)}
            >
              {title}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Content Area */}
      <div style={styles.contentArea}>
        {settingsSections.map(({ title, component }) => (
          <div key={title} style={styles.section}>
            <button style={styles.header} onClick={() => toggleSection(title)}>
              <span>{title}</span>
              {openSection === title ? <IoMdArrowDropdown /> : <IoIosArrowForward />}
            </button>
            {openSection === title && <div style={styles.content}>{component}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// Internal CSS Styles
const styles: { [key: string]: React.CSSProperties } = {
  settingsPage: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  sidebar: {
    width: "280px",
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRight: "1px solid #ddd",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
  },
  sidebarTitle: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  menu: {
    listStyle: "none",
    padding: 0,
  },
  menuItem: {
    padding: "12px 15px",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "background 0.2s ease-in-out",
    color: "#555",
  },
  activeMenuItem: {
    backgroundColor: "#e0e0e0",
  },
  contentArea: {
    flexGrow: 1,
    padding: "20px",
    backgroundColor: "#ffffff",
    overflowY: "auto",
  },
  section: {
    marginBottom: "15px",
    borderBottom: "1px solid #ddd",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "15px",
    background: "none",
    border: "none",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#333",
  },
  content: {
    padding: "15px",
    backgroundColor: "#f5f5f5",
    borderRadius: "5px",
    marginTop: "5px",
  },
};

