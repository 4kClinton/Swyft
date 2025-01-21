import styles from '../Styles/Rides.module.css';
import PropTypes from 'prop-types';

const RideDetailsModal = ({ ride, onClose }) => {
  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Ride Details</h2>
        <div className={styles.modalBody}>
          <p>
            <strong>Time:</strong> {new Date(ride.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Pickup:</strong> {ride.userAddress}
          </p>
          <p>
            <strong>Destination:</strong> {ride.destAddress}
          </p>
          <p>
            <strong>Status:</strong> {ride.status}
          </p>
          <p>
            <strong>Total Cost:</strong> Ksh {ride.total_cost}
          </p>

          <p>
            <strong>Loaders:</strong> {ride.loaders}{' '}
          </p>
        </div>
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
};

RideDetailsModal.propTypes = {
  ride: PropTypes.shape({
    created_at: PropTypes.string.isRequired,
    userAddress: PropTypes.string.isRequired,
    destAddress: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    total_cost: PropTypes.number.isRequired,
    commission: PropTypes.number,
    net_earnings: PropTypes.number,
    loaders: PropTypes.number.isRequired,
    loader_cost: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RideDetailsModal;
