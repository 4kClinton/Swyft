import { Bus } from 'lucide-react';
import styles from '../Styles/Rides.module.css';
import { useEffect, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { CircularProgress } from '@mui/material';
import RideDetailsModal from './RideDetailsModal';
import { useSelector } from 'react-redux';
export default function RidesHistory() {
  const [loading, setLoading] = useState(true);

  const [rides, setRides] = useState([]);
  const [addressesLoaded, setAddressesLoaded] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const ordersHistory = useSelector((state) => state.ordersHistory.value);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Load API key from .env
    libraries: ['places'],
  });

  // Group rides by month
  const groupedRides = rides.reduce((acc, ride) => {
    const date = new Date(ride.created_at);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(ride);
    return acc;
  }, {});

  useEffect(() => {
    if (ordersHistory.length > 0) {
      const fetchAddresses = async () => {
        const geocoder = new window.google.maps.Geocoder();
        const ridesWithAddresses = await Promise.all(
          ordersHistory.map(async (ride) => {
            const userLatLng = { lat: ride.user_lat, lng: ride.user_lng };
            const destLatLng = { lat: ride.dest_lat, lng: ride.dest_lng };

            const userAddress = await geocodeLatLng(geocoder, userLatLng);
            const destAddress = await geocodeLatLng(geocoder, destLatLng);

            return {
              ...ride,
              userAddress,
              destAddress,
            };
          })
        );
        // Sort rides by created_at in descending order (latest first)
        ridesWithAddresses.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setRides(ridesWithAddresses);
        setAddressesLoaded(true);
        setLoading(false);
      };

      if (isLoaded) {
        fetchAddresses();
      } else {
        // Sort ordersHistory directly if addresses are not loaded
        const sortedRides = [...ordersHistory].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setRides(sortedRides);
        setLoading(false);
      }
    }
  }, [isLoaded, ordersHistory]);

  const geocodeLatLng = (geocoder, latlng) => {
    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject('Error retrieving address');
        }
      });
    });
  };

  const formatMonth = (month) => {
    const [year, monthIndex] = month.split('-');
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(year, monthIndex - 1));
  };

  if ((loading || !addressesLoaded) && rides.length !== 0)
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <CircularProgress className="login-loader" size={34} color="#0000" />
        <span>Loading rides history...</span>
      </div>
    );

  if (rides.length === 0) {
    return <div>No rides found</div>;
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.h1}>Rides</h1>
      </header>

      <main>
        {Object.keys(groupedRides).map((month) => (
          <section key={month} className={styles.day_section}>
            <h2 className={styles.h2}>{formatMonth(month)}</h2>

            {groupedRides[month].map((ride, index) => (
              <div
                key={index}
                className={styles.ride_entry}
                onClick={() => setSelectedRide(ride)}
                style={{ cursor: 'pointer' }}
              >
                <Bus className={styles.ride_icon} />
                <div className={styles.ride_details}>
                  <div className={styles.ride_time}>
                    {new Date(ride.created_at).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                    })}{' '}
                    {new Date(ride.created_at).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </div>

                  <div className={styles.ride_location}>
                    {ride.userAddress} to {ride.destAddress}
                  </div>
                  <div className={styles.ride_price}>
                    {ride.total_cost ? `Ksh ${ride.total_cost}` : 'Ksh 0.00'}
                  </div>
                </div>
                <hr />
              </div>
            ))}
            <br />
          </section>
        ))}
      </main>
      {selectedRide && (
        <RideDetailsModal
          ride={selectedRide}
          onClose={() => setSelectedRide(null)}
        />
      )}
    </div>
  );
}
