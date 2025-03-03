import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../Styles/orderLoader.css';

const SuccessPopup = ({ onClose, closePopup }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const delay = setTimeout(() => {
      setIsLoading(false);
      // Simulate driver finding process (replace with actual API call)
    }, 2000); // Adjust the delay as needed

    return () => clearTimeout(delay);
  }, []);

  return ReactDOM.createPortal(
    <div className="popup-overlay" style={styles.overlay}>
      <div
        className="popup"
        style={styles.popup}
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <>
            <h2>Finding You A Driver</h2>
            <div>
              {/* Add your preferred spinner component or library here */}
              {/* Example using a simple CSS spinner: */}
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <h2 style={styles.heading}>Success</h2>
            <p style={styles.text}>Finding driver ...</p>
            <button style={styles.button} onClick={closePopup || onClose}>
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

const styles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
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
  button: {
    width: '100%',
    padding: '12px',
    marginTop: '15px',
    fontSize: '1em',
    color: '#fff',
    backgroundColor: '#00D46A', // Green for success
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

// Add the keyframes outside the object
const slideIn = `
  @keyframes slideIn {
    from {
      transform: translateY(-30%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;
//eslint-disable-next-line
export { styles, slideIn };
