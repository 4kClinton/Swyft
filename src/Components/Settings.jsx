import React, { useState, useEffect } from "react";
import "../Styles/Settings.css"; // Import the custom CSS file for switch styles

function Settings() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [privacyLevel, setPrivacyLevel] = useState("Public");
  const [language, setLanguage] = useState("English");
  const [paymentMethod, setPaymentMethod] = useState("Visa **** 1234");
  const [username, setUsername] = useState("JohnDoe");
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state

  const toggleNotifications = () =>
    setIsNotificationsEnabled(!isNotificationsEnabled);
  const handlePrivacyChange = (e) => setPrivacyLevel(e.target.value);
  const handleLanguageChange = (e) => setLanguage(e.target.value);
  const handlePaymentMethodChange = (e) => setPaymentMethod(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode); // Toggle dark mode

  useEffect(() => {
    // Apply the appropriate theme when the isDarkMode state changes
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Settings</h2>

      {/* Notifications */}
      <div style={styles.section}>
        <h3 style={styles.sectionHeading}>Notifications</h3>
        <div style={styles.settingItem}>
          <label style={styles.label}>Enable Notifications</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={isNotificationsEnabled}
              onChange={toggleNotifications}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* Payment Methods */}
      <div style={styles.section}>
        <h3 style={styles.sectionHeading}>Payment</h3>
        <div style={styles.settingItem}>
          <label style={styles.label}>Default Payment Method</label>
          <select
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
            style={styles.select}
          >
            <option value="Visa **** 1234">Visa **** 1234</option>
            <option value="M-Pesa">PayPal</option>
          </select>
        </div>
      </div>

      {/* Dark Mode Switch */}
      <div style={styles.section}>
        <h3 style={styles.sectionHeading}>Theme</h3>
        <div style={styles.settingItem}>
          <label style={styles.label}>Dark Mode</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleDarkMode}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default Settings;

const styles = {
  container: {
    padding: "20px",
    fontFamily: "var(--font-family)",
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "var(--primary-color)", // Dynamic based on dark/light mode
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    color: "var(--text-color)", // Dynamic text color
  },
  heading: {
    fontSize: "1.8em",
    color: "var(--highlight-color)", // Accent color for heading
    marginBottom: "20px",
    textAlign: "center",
  },
  section: {
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: `1px solid var(--border-color)`,
  },
  sectionHeading: {
    fontSize: "1.2em",
    color: "var(--highlight-color)", // Accent for section headings
    marginBottom: "10px",
  },
  settingItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
    padding: "10px 0",
  },
  label: {
    fontSize: "1em",
    color: "var(--text-color)", // Consistent text color
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "var(--input-background)",
    color: "var(--text-color)", // Input text color
    border: "1px solid var(--border-color)",
    width: "60%",
    outline: "none",
  },
  select: {
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "var(--input-background)",
    color: "var(--text-color)",
    border: "1px solid var(--border-color)",
    width: "60%",
  },
};
