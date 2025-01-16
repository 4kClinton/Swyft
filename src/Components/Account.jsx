import '../Styles/Account.css';
import { useSelector } from 'react-redux';
import userPic from '../assets/profile.jpeg';
import CircularProgress from '@mui/material/CircularProgress';
// Function to fetch user details using axios

const Account = () => {
  const theUser = useSelector((state) => state.user.value);

  if (!theUser?.name) {
    return <CircularProgress />;
  }

  return (
    <div className="account-container">
      <div className="user-card">
        <img
          src={userPic}
          alt={`${theUser.name}'s avatar`}
          className="user-avatar"
        />

        <h2>{theUser.name}</h2>
        <p>
          <strong>Email:</strong> {theUser.email}
        </p>
        <p>
          <strong>Phone:</strong> {theUser.phone}
        </p>
      </div>
    </div>
  );
};

export default Account;
