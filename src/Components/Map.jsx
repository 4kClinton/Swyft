import { useState, useEffect } from 'react';
import {
  GoogleMap,
  useLoadScript,
  DirectionsRenderer,
} from '@react-google-maps/api';
import CircularProgress from '@mui/material/CircularProgress'; // For loader
import '../Styles/Map.css';
import SearchBar from './SearchBar';
import Dash from './Dash'; // Import the Dash component

const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Load API key from .env
    libraries: ['places'],
  });

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState(0); // Initial state for distance

  //eslint-disable-next-line
  const [duration, setDuration] = useState('');
  const [destination, setDestination] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log('User location', position);

        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(userLocation);
        setDestination(userLocation); // Optional: set as initial destination
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if (isLoaded && currentLocation && destination) {
      calculateRoute();
    }

    //eslint-disable-next-line
  }, [isLoaded, currentLocation, destination]);

  const calculateRoute = async () => {
    if (!window.google || !currentLocation || !destination) return;

    const directionsService = new window.google.maps.DirectionsService();
    const distanceMatrixService =
      new window.google.maps.DistanceMatrixService();

    try {
      const directionsResult = await directionsService.route({
        origin: currentLocation,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      setDirectionsResponse(directionsResult);

      const distanceMatrixResult =
        await distanceMatrixService.getDistanceMatrix({
          origins: [currentLocation],
          destinations: [destination],
          travelMode: window.google.maps.TravelMode.DRIVING,
        });

      const distanceElement = distanceMatrixResult.rows[0].elements[0];

      if (distanceElement && distanceElement.status === 'OK') {
        const calculatedDistance = distanceElement.distance.value / 1000; // Convert to kilometers
        setDistance(calculatedDistance); // Set the distance

        setDuration(distanceElement.duration.text);
      } else {
        console.error('Distance calculation failed:', distanceElement);
      }
    } catch (error) {
      console.error('Error fetching directions or distance matrix:', error);
    }
  };

  if (!isLoaded)
    return (
      <div>
        <CircularProgress size={40} />
      </div>
    );

  return (
    <div className="map-container">
      <SearchBar setDestination={setDestination} />

      <GoogleMap
        mapContainerClassName="google-map"
        center={
          destination || currentLocation || { lat: -1.286389, lng: 36.817223 }
        }
        zoom={12}
      >
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>

      {/* Display distance */}
      <div className="distance-info">{distance.toFixed(2)} km</div>

      {/* Pass distance, userLocation, and destination as props to the Dash component */}
      <Dash
        distance={Number(distance)}
        userLocation={currentLocation}
        destination={destination}
      />
    </div>
  );
};

export default Map;
