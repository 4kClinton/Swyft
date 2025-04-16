import { Bus } from 'lucide-react';
import styles from '../Styles/Rides.module.css';
import { useEffect, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import RideDetailsModal from './RideDetailsModal';
import { useSelector } from 'react-redux';

export default function RidesHistory() {
  const [loading, setLoading] = useState(true);
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);

  // Redux state with your ride/orders data
  const ordersHistory = useSelector((state) => state.ordersHistory.value);

  // Load the Google Maps script (Geocoder is inside 'places' library)
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // from .env
    libraries: ['places'],
  });

  // Helper to group rides by month
  const groupedRides = rides.reduce((acc, ride) => {
    const date = new Date(ride.created_at);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(ride);
    return acc;
  }, {});

  // Fetch addresses (with caching) once ordersHistory is available
  useEffect(() => {
    if (ordersHistory.length > 0 && isLoaded) {
      (async () => {
        const geocoder = new window.google.maps.Geocoder();

        const ridesWithAddresses = await Promise.all(
          ordersHistory.map(async (ride) => {
            const userLatLng = { lat: ride.user_lat, lng: ride.user_lng };
            const destLatLng = { lat: ride.dest_lat, lng: ride.dest_lng };

            const userAddress = await getCachedOrGeocode(geocoder, userLatLng);
            const destAddress = await getCachedOrGeocode(geocoder, destLatLng);

            return {
              ...ride,
              userAddress,
              destAddress,
            };
          })
        );

        // Sort by created_at descending
        ridesWithAddresses.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setRides(ridesWithAddresses);
        setLoading(false);
      })();
    } else if (ordersHistory.length === 0) {
      // If there’s literally no orders, we can stop loading immediately
      setRides([]);
      setLoading(false);
    }
  }, [ordersHistory, isLoaded]);

  /**
   * Attempts to retrieve a cached address from localStorage;
   * if it doesn't exist, calls geocodeLatLng, then caches it.
   */
  const getCachedOrGeocode = async (geocoder, latlng) => {
    const cacheKey = `${latlng.lat},${latlng.lng}`;
    const cachedAddress = localStorage.getItem(cacheKey);
    if (cachedAddress) {
      return cachedAddress;
    }
    try {
      const address = await geocodeLatLng(geocoder, latlng);
      localStorage.setItem(cacheKey, address);
      return address;
    } catch (error) {
      console.error(error);
      return 'Address not found';
    }
  };

  /**
   * Wraps the Geocoder call in a Promise-based function
   */
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

  // Helper to format the month-year heading
  const formatMonth = (month) => {
    const [year, monthIndex] = month.split('-');
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(year, monthIndex - 1));
  };

  // 1) Show loader if data is still fetching or script not yet loaded
  if (loading || !isLoaded) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          width: '100%',
        }}
      >
        {/* Inline the CSS for the loading dots */}
        <style>{`
          .dots-container {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 100%;
          }
          .dot {
            height: 20px;
            width: 20px;
            margin-right: 10px;
            border-radius: 10px;
            background-color: #00c763;
            animation: pulse 1.5s infinite ease-in-out;
          }
          .dot:last-child {
            margin-right: 0;
          }
          .dot:nth-child(1) {
            animation-delay: -0.3s;
          }
          .dot:nth-child(2) {
            animation-delay: -0.1s;
          }
          .dot:nth-child(3) {
            animation-delay: 0.1s;
          }
          @keyframes pulse {
            0% {
              transform: scale(0.8);
              background-color: #00c763;
              box-shadow: 0 0 0 0 rgba(0, 212, 106, 0.7);
            }
            50% {
              transform: scale(1.2);
              background-color: #00c763;
              box-shadow: 0 0 0 10px rgba(0, 212, 106, 0);
            }
            100% {
              transform: scale(0.8);
              background-color: #00c763;
              box-shadow: 0 0 0 0 rgba(0, 212, 106, 0.7);
            }
          }
        `}</style>
        <section className="dots-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </section>
      </div>
    );
  }

  // 2) If we’re done loading but have no rides, show "No rides found"
  if (!loading && rides.length === 0) {
    return <div>No rides found</div>;
  }

  // 3) Otherwise, display the ride history
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
