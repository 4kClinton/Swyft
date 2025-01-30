import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../Styles/orderLoader.css';
import { useNavigate } from 'react-router-dom';

const SuccessPopup = ({ onClose, closePopup }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const delay = setTimeout(() => {
      setIsLoading(false);
      // Simulate driver finding process (replace with actual API call)
      navigate('/driverDetails');
    }, 2000); // Adjust the delay as needed

    return () => clearTimeout(delay);
  }, []);

  return ReactDOM.createPortal(
    <div className="popup-overlay" >
      <div className="popup"  onClick={(e) => e.stopPropagation()}>
        {isLoading ? (
          <>
            <h2 >Finding You A Driver</h2>
            <div >
              {/* Add your preferred spinner component or library here */}
              {/* Example using a simple CSS spinner: */}
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <h2 >Success</h2>
            <p >Your order has been placed successfully!</p>
            <button onClick={closePopup || onClose}>
              OK
            </button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default SuccessPopup;

