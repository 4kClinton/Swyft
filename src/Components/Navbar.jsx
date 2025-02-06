import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import NearMeIcon from '@mui/icons-material/NearMe';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SettingsIcon from '@mui/icons-material/Settings';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import profile from '../assets/profile.jpeg';
import '../Styles/Navbar.css';


import { deleteUser } from '../Redux/Reducers/UserSlice.js';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // const navigate = useNavigate();
  const theUser = useSelector((state) => state.user.value);
  // const dispatch = useDispatch();

  useEffect(() => {
    const loginStatus = theUser.name;
    if (loginStatus) {
      setIsLoggedIn(true);
    }
  }, [theUser]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };


  const handleLogout = () => {
    Cookies.remove('authToken'); // Correct storage removal
    // setUser(null); // Clear the user in the context
    dispatch(deleteUser());
    setIsLoggedIn(false); // Update the login status in state
    navigate('/login'); // Redirect to the login page
    toast.success('Logged out successfully!');
  };


  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="toast-container"
      />

      <div className="icon-button" onClick={toggleSidebar}>
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </div>

      <div className={`sidebar ${isOpen ? 'show-sidebar' : ''}`}>
        <div className="cards">
          <div className="card">
            <Link
              onClick={toggleSidebar}
              to={'/dash'}
              style={{
                backgroundColor: 'var(--primary-color)',
                padding: '1vh',
                width: '50%',
                borderRadius: '10px',
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2vh',
                marginLeft: '7vh',
              }}
            >
              <HomeIcon style={{ color: '#18b700', marginRight: '8px' }} />
              Dashboard
            </Link>
          </div>

          <div className="card" id="Account-Card">
            <Link
              onClick={toggleSidebar}
              to={'/acc'}
              style={{
                width: '80%',
                fontSize: '20px',
                backgroundColor: 'var(--primary-color)',
                padding: '1vh',
                borderRadius: '10px',
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                marginBottom: '2vh',
              }}
            >
              <img
                src={profile}
                alt="Profile"
                style={{
                  width: '5vh',
                  borderRadius: '50%',
                  marginRight: '8px',
                }}
              />
              <h3>{isLoggedIn ? `Hi  ${theUser?.name}` : 'Account'}</h3>
            </Link>
          </div>

          {isLoggedIn && (
            <div className="card">
              <h3>Account Options</h3>
              <ul className="menu-options">
                <Link
                  onClick={toggleSidebar}
                  to="/ridesHistory"
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    padding: '10px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <HistoryIcon
                    style={{ color: '#18b700', marginRight: '8px' }}
                  />
                  Ride History
                </Link>

                <Link
                  onClick={toggleSidebar}
                  to="/settings"
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    padding: '10px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <SettingsIcon
                    style={{ color: '#18b700', marginRight: '8px' }}
                  />
                  Settings
                </Link>

                <Link
                  to="/track"
                  onClick={toggleSidebar}
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    marginLeft: '1vh',
                    alignItems: 'center',
                  }}
                >
                  <NearMeIcon
                    style={{ color: '#18b700', marginRight: '8px' }}
                  />
                  Track Your Cargo
                </Link>
              </ul>
            </div>
          )}

          <div className="card">
            <h3>Additional Services</h3>
            <Link
              to="/findhouse"
              onClick={toggleSidebar}
              style={{
                backgroundColor: 'var(--primary-color)',
                borderRadius: ' 10px',
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                margin: '2vh',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'larger',
              }}
            >
              <ApartmentIcon style={{ color: '#18b700', marginRight: '8px' }} />
              Find a House
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
