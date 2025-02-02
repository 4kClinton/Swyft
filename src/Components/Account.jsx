import { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  TextField,
  Button,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../Redux/Reducers/UserSlice';
import Cookies from 'js-cookie';

const Profile = () => {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({}); // Profile data
  const [error, setError] = useState(null); // Error state
  const [isEditing, setIsEditing] = useState(false); // Editing state
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' }); // Form data for editing

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
      const response = await fetch(
        'https://swyft-backend-client-nine.vercel.app/customer/profile',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

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
    <div
      style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '800px',
          padding: '16px',
          marginBottom: '16px',
        }}
      >
        <CardContent
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingBottom: '16px',
          }}
        >
          <Avatar
            style={{
              marginBottom: '16px',
              backgroundColor: '#FFA500',
              width: '80px',
              height: '80px',
            }}
          >
            <PersonIcon style={{ fontSize: '40px' }} />
          </Avatar>
          <Typography variant="h5" style={{ marginBottom: '16px' }}>
            {isEditing ? (
              <TextField
                fullWidth
                variant="outlined"
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                style={{ marginBottom: '16px' }}
              />
            ) : (
              profile.name
            )}
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            style={{ marginBottom: '8px' }}
          >
            {isEditing ? (
              <TextField
                fullWidth
                variant="outlined"
                label="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                style={{ marginBottom: '16px' }}
              />
            ) : (
              `Email: ${profile.email}`
            )}
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            style={{ marginBottom: '8px' }}
          >
            {isEditing ? (
              <TextField
                fullWidth
                variant="outlined"
                label="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                style={{ marginBottom: '16px' }}
              />
            ) : (
              `Phone: ${profile.phone}`
            )}
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            style={{ marginBottom: '16px' }}
          >
            Joined: {new Date(profile.joinDate).toLocaleDateString()}
          </Typography>
          {isEditing ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '12px',
                fontSize: '16px',
              }}
            >
              Save Changes
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleEdit}
              style={{
                marginTop: '16px',
                background: '#00d46a',
                width: '100%',
                padding: '12px',
                fontSize: '16px',
              }}
            >
              Edit Profile
            </Button>
          )}
        </CardContent>
      </Card>

      <Button
        variant="contained"
        color="error"
        onClick={handleLogout}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
        }}
      >
        Logout
      </Button>
    </div>
  );
};

export default Profile;
