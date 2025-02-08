import '../Styles/DriverDetails.css'; // Import the CSS file
import profilePic from '../assets/profilePic.jpeg';
import pickup from '../assets/pickup.png';
import miniTruck from '../assets/miniTruck.png';
import flatbed from '../assets/flatbed.png';
import lorry from '../assets/lorry.png';
import { FaPhoneAlt } from 'react-icons/fa'; // Importing the phone icon
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation
import { useDispatch, useSelector } from 'react-redux';
import { saveDriver } from '../Redux/Reducers/DriverDetailsSlice';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

// Sample data for the driver

const DriverDetails = () => {
  const navigate = useNavigate(); // Hook to navigate
  const driver = useSelector((state) => state.driverDetails.value);
  const order = useSelector((state) => state.currentOrder.value);
  const dispatch = useDispatch();

  useEffect(() => {
    if (order?.status === 'Accepted' && !driver?.id) {
      const token = Cookies.get('authTokencl1');
      fetch(`http://127.0.0.1:5000/driver/${order.driver_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch driver data');
          }
          return response.json();
        })
        .then((driverData) => {
          dispatch(saveDriver(driverData));
          Cookies.set('driverData', JSON.stringify(driverData), { expires: 7 });
        })
        .catch((error) => {
          console.error('Error fetching driver data:', error);
        });
    }
    //eslint-disable-next-line
  }, [order]);

  const handleGoHome = () => {
    navigate('/dash'); // Navigate to the home page
  };

  if (!driver?.id) {
    return null;
  }

  // Determine the car image based on car type
  const getCarImage = () => {
    switch (driver.car_type) {
      case 'pickup':
        return pickup;
      case 'miniTruck':
        return miniTruck;
      case 'flatbed':
        return flatbed;
      case 'lorry':
        return lorry;
      default:
        return null; // Or return a default image
    }
  };

  return (
    <div className="container">
      <div className="driverInfo">
        <img
          src={driver.profilePicture || profilePic}
          alt="Driver"
          className="driverImage"
        />
        <div className="textContainer">
          <h2 className="name">{driver.name}</h2>
          <p className="numberPlate">{driver.license_plate}</p>
          <p className="carType">{driver.car_type}</p>
        </div>
      </div>

      <div className="carImageContainer">
        <img src={getCarImage()} alt="Car" className="carImage" />
      </div>

      <div className="phoneContainer">
        <a
          href={`tel:${driver.phone}`}
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
            {driver.phone}
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
