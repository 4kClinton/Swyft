import { useState } from 'react';
import '../Styles/Settings.css'; // Import the custom CSS file for switch styles

function Settings() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  //eslint-disable-next-line
  const [privacyLevel, setPrivacyLevel] = useState('Public');
  //eslint-disable-next-line
  const [language, setLanguage] = useState('English');
  const [paymentMethod, setPaymentMethod] = useState('Visa **** 1234');
  //eslint-disable-next-line
  const [username, setUsername] = useState('JohnDoe');

  const toggleNotifications = () =>
    setIsNotificationsEnabled(!isNotificationsEnabled);

  //eslint-disable-next-line
  const handlePrivacyChange = (e) => setPrivacyLevel(e.target.value);
  //eslint-disable-next-line
  const handleLanguageChange = (e) => setLanguage(e.target.value);
  const handlePaymentMethodChange = (e) => setPaymentMethod(e.target.value);
  //eslint-disable-next-line
  const handleUsernameChange = (e) => setUsername(e.target.value);

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
            <option value="Cash">Cash</option>
            <option value="M-Pesa">M-Pesa</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Settings;

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'var(--font-family)',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'var(--primary-color)',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    color: 'var(--text-color)',
  },
  heading: {
    fontSize: '1.8em',
    color: 'var(--highlight-color)',
    marginBottom: '20px',
    textAlign: 'center',
  },
  section: {
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: `1px solid var(--border-color)`,
  },
  sectionHeading: {
    fontSize: '1.2em',
    color: 'var(--highlight-color)',
    marginBottom: '10px',
  },
  settingItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
    padding: '10px 0',
  },
  label: {
    fontSize: '1em',
    color: 'var(--text-color)',
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: 'var(--input-background)',
    color: 'var(--text-color)',
    border: '1px solid var(--border-color)',
    width: '60%',
    outline: 'none',
  },
  select: {
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: 'var(--input-background)',
    color: 'var(--text-color)',
    border: '1px solid var(--border-color)',
    width: '60%',
  },
};
