import { useState } from 'react';
import ReactDOM from 'react-dom';
import '../Styles/orderLoader.css';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOrder } from '../Redux/Reducers/CurrentOrderSlice';
import { removeDriver } from '../Redux/Reducers/DriverDetailsSlice';
import Cookies from 'js-cookie';

const CancelOrderPopup = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const order = useSelector((state) => state.currentOrder.value);
  const dispatch = useDispatch();
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const reasonOptions = [
    'Changed my mind',
    'Found a better option',
    'Delivery delay',
    'Order incorrect',
    'Other',
  ];

  const handleReasonChange = (e) => {
    setSelectedReason(e.target.value);
    if (e.target.value !== 'Other') {
      setOtherReason('');
    }
  };

  const handleCancelOrder = () => {
    const token = Cookies.get('authTokencl1');
    setIsLoading(true);
    fetch(`https://swyft-backend-client-nine.vercel.app/orders/${order.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: 'cancelled',
        cancellation_reason:
          selectedReason === 'Other' ? otherReason : selectedReason,
      }),
    })
      .then((response) => {
        if (response.ok) {
          dispatch(deleteOrder());
          dispatch(removeDriver());
          Cookies.remove('NavigateToDriverDetails');
          Cookies.remove('orderData');
          Cookies.remove('driverData');

          onClose();
        } else {
          alert('Failed to cancel order');
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error canceling order:', error);
        setIsLoading(false);
      });
  };

  return ReactDOM.createPortal(
    <div className="popup-overlay" style={styles.overlay}>
      <div
        className="popup"
        style={styles.popup}
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <>
            <h2>Canceling Your Order</h2>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </>
        ) : (
          <>
            <h2 style={styles.heading}>Cancel Order</h2>
            <p style={styles.text}>
              Please select a reason for canceling your order:
            </p>
            <select
              style={styles.select}
              value={selectedReason}
              onChange={handleReasonChange}
            >
              <option value="">Select a reason</option>
              {reasonOptions.map((reason, index) => (
                <option key={index} value={reason}>
                  {reason}
                </option>
              ))}
            </select>

            {selectedReason === 'Other' && (
              <div>
                <label htmlFor="other-reason" style={styles.label}>
                  Please specify:
                </label>
                <input
                  type="text"
                  id="other-reason"
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  style={styles.input}
                />
              </div>
            )}

            <button style={styles.button} onClick={handleCancelOrder}>
              Confirm Cancellation
            </button>
            <button style={styles.buttonSecondary} onClick={onClose}>
              Close
            </button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

const styles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999999,
  },
  popup: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    width: '60%',
    maxWidth: '400px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
  },
  heading: {
    fontSize: '1.5em',
    color: '#333',
    marginBottom: '20px',
  },
  text: {
    fontSize: '1em',
    color: '#666',
    margin: '10px 0',
  },
  select: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  label: {
    fontSize: '1em',
    color: '#666',
    margin: '10px 0',
  },
  input: {
    width: '90%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
    color: 'black',
  },
  button: {
    width: '100%',
    padding: '12px',
    marginTop: '15px',
    fontSize: '1em',
    color: '#fff',
    backgroundColor: '#f44336', // Red for cancellation
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  buttonSecondary: {
    width: '100%',
    padding: '12px',
    marginTop: '10px',
    fontSize: '1em',
    color: '#fff',
    backgroundColor: '#00D46A', // Green for close
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default CancelOrderPopup;
