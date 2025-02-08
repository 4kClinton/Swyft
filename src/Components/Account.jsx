import { useEffect, useState } from 'react';
import { Typography, CircularProgress } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../Redux/Reducers/UserSlice';
import Cookies from 'js-cookie';
import '../Styles/Account.css';

const Profile = () => {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({}); // Profile data
  const [error, setError] = useState(null); // Error state
  const [isEditing, setIsEditing] = useState(false); // Editing state
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' }); // Form data for editing
  console.log(user);

  useEffect(() => {
    setProfile(user);
    if (user.id) {
      setLoading(false);
    }
  }, [user]);

  function handleLogout() {
    Cookies.remove('authTokencl1');
    window.location.href = '/';
  }

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
    });
  };

  const handleSave = async () => {
    const token = Cookies.get('authTokencl1');
    try {
      const response = await fetch('http://127.0.0.1:5000/customer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      dispatch(addUser(updatedProfile));
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="account-container">
      <div className="user-card">
        <div className="UserDetails">
          <div className="avatar">
            <PersonIcon className="avatar-icon" />
          </div>
          <h5 className="username">
            {isEditing ? (
              <input
                className="username-input"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            ) : (
              profile.name
            )}
          </h5>
          <div className="email-container">
            {isEditing ? (
              <input
                className="email-input"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            ) : (
              <p>Email: {profile.email}</p>
            )}
          </div>

          <p className="phone-container">
            {isEditing ? (
              <input
                className="phone-input"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            ) : (
              `Phone: ${profile.phone}`
            )}
          </p>
          <p className="join-date">
            Joined: {new Date(profile.joinDate).toLocaleDateString()}
          </p>
          {isEditing ? (
            <button className="save-button" onClick={handleSave}>
              Save Changes
            </button>
          ) : (
            <button className="editProfile" onClick={handleEdit}>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <button className="logoutButton" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
