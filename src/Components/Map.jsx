import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  DirectionsRenderer,
} from "@react-google-maps/api";
import "../Styles/Map.css";
import SearchBar from "./SearchBar";

const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Load API key from .env
    libraries: ["places"],
  });

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [destination, setDestination] = useState(null); // This state will store the destination

  useEffect(() => {
    if (isLoaded && destination) {
      calculateRoute();
    }
  }, [isLoaded, destination]);

  const calculateRoute = async () => {
    if (!window.google) return;

    const directionsService = new window.google.maps.DirectionsService();
    const distanceMatrixService =
      new window.google.maps.DistanceMatrixService();

    const origin = { lat: -1.286389, lng: 36.817223 }; // Nairobi

    try {
      // Directions API request
      const directionsResult = await directionsService.route({
        origin: origin,
        destination: destination, // Use destination from state
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      setDirectionsResponse(directionsResult);

      // Distance Matrix API request
      const distanceMatrixResult =
        await distanceMatrixService.getDistanceMatrix({
          origins: [origin],
          destinations: [destination],
          travelMode: window.google.maps.TravelMode.DRIVING,
        });

      const distanceElement = distanceMatrixResult.rows[0].elements[0];
      setDistance(distanceElement.distance.text);
      setDuration(distanceElement.duration.text);
    } catch (error) {
      console.error("Error fetching directions or distance matrix:", error);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="map-container">
      {/* Pass setDestination to SearchBar */}
      <SearchBar setDestination={setDestination} />

      <GoogleMap
        mapContainerClassName="google-map"
        center={{ lat: -1.286389, lng: 36.817223 }} // Nairobi, Kenya
        zoom={12}
      >
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;
