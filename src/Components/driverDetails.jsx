import '../Styles/DriverDetails.css'; // Import the CSS file
import profilePic from '../assets/profilePic.jpeg';
import pickup from '../assets/pickup.png';
import miniTruck from '../assets/miniTruck.png';
import flatbed from '../assets/flatbed.png';
import Van from '../assets/van.jpg';
import { FaPhoneAlt } from 'react-icons/fa'; // Importing the phone icon
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation
import { useDispatch, useSelector } from 'react-redux';
import { saveDriver } from '../Redux/Reducers/DriverDetailsSlice';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import CircularProgress from '@mui/material/CircularProgress'; // Import MUI Circular Progress
import Box from '@mui/material/Box'; // Import Box for centering

const DriverDetails = () => {
  const navigate = useNavigate(); // Hook to navigate
  //const driver = useSelector((state) => state.driverDetails.value);
  //const order = useSelector((state) => state.currentOrder.value);
  const dispatch = useDispatch();
  const nearest_driver = localStorage.getItem('driver_id');
  const orders = localStorage.getItem('order_id');
  const car = localStorage.getItem('car');
  const name = localStorage.getItem('name');
  const phone = localStorage.getItem('phone');
  const status = localStorage.getItem('status');
  const license = localStorage.getItem('license');

  console.log(nearest_driver, orders, car, name, phone, status, license); 
  

  useEffect(() => {
    if (status === 'Accepted' && !nearest_driver) {
      const token = Cookies.get('authTokencl1');
      fetch(
        `https://swyft-backend-client-nine.vercel.app/driver/${nearest_driver}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch driver data');
          }
          return response.json();
        })
        .then((driverData) => {
          dispatch(saveDriver(driverData));
          Cookies.set('driverData', JSON.stringify(driverData));
        })
        .catch((error) => {
          console.error('Error fetching driver data:', error);
        });
    }
  }, [orders, dispatch, nearest_driver]);

  const handleGoHome = () => {
    navigate('/dash'); // Navigate to the home page
  };

  if (!nearest_driver) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Determine the car image based on car type
  const getCarImage = () => {
    switch (car) {
      case 'pickup':
        return pickup;
      case 'miniTruck':
        return miniTruck;
      case 'flatbed':
        return flatbed;
      case 'van':
        return Van;
      default:
        return null; // Or return a default image
    }
  };

  return (
    <div className="containerDriverDetails">
      <div className="driverInfo">
        <img
          src={nearest_driver.profilePicture || profilePic}
          alt="Driver"
          className="driverImage"
        />
        <div className="textContainer">
          <h2 className="name">Name: {name}</h2>
          <p className="numberPlate">
            {' '}
            License plate:{' '}
            <span style={{ fontWeight: 'bold' }}>
              {license}{' '}
            </span>{' '}
          </p>
          <p className="carType">
            Car Type:{' '}
            <span style={{ fontWeight: 'bold' }}>{car}</span>
          </p>
        </div>
      </div>

      <div className="carImageContainer">
        <img src={getCarImage()} alt="Car" className="carImage" />
      </div>

      <div className="phoneContainer">
        <a
          href={`tel:${phone}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          <FaPhoneAlt
            className="phoneIcon"
            style={{ marginRight: '20px', color: '#ffff' }}
          />
          <h2 className="phoneNumber" style={{ color: '#ffff' }}>
            Call Driver
          </h2>
        </a>
      </div>

      {/* Go back home button */}
      <button className="goHomeButton" onClick={handleGoHome}>
        Go Back Home
      </button>
    </div>
  );
};

export default DriverDetails;
