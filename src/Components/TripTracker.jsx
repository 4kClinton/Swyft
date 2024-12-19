import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import io from "socket.io-client";
import Feedback from "./Feedback";

const TripTracker = ({ destination, rideId }) => {
  const [currentLocation, setCurrentLocation] = useState({
    lat: -1.286389,
    lng: 36.817223,
  }); // Nairobi default
  const [routePath, setRoutePath] = useState([]);
  const [tripCompleted, setTripCompleted] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Replace with your API Key
  });

  useEffect(() => {
    const socket = io("http://localhost:5000"); // Backend connection

    // Join ride room
    socket.emit("join_ride", { rideId });

    // Listen for location updates
    socket.on("location_update", (location) => {
      setCurrentLocation(location);
      setRoutePath((prevPath) => [...prevPath, location]);
    });

    // Simulate arrival after some time (for demo)
    setTimeout(() => setTripCompleted(true), 15000);

    return () => socket.disconnect();
  }, [rideId]);

  const shareLink = () => {
    const link = `${window.location.origin}/track?rideId=${rideId}`;
    navigator.clipboard.writeText(link);
    alert("Trip details link copied!");
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div style={{ width: "100%", height: "100vh", backgroundColor: "#E8E8E8" }}>
      {!tripCompleted ? (
        <div style={{ padding: "1rem" }}>
          <h2 style={{ color: "#841C26" }}>Trip in Progress</h2>
          <GoogleMap
            center={currentLocation}
            zoom={15}
            mapContainerStyle={{ height: "60vh", width: "100%" }}
          >
            <Marker position={currentLocation} label="You" />
            <Marker position={destination} label="Destination" />
            {routePath.length > 1 && (
              <Polyline
                path={routePath}
                options={{ strokeColor: "#2191FB", strokeWeight: 4 }}
              />
            )}
          </GoogleMap>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            <button
              onClick={shareLink}
              style={{
                backgroundColor: "#BA274A",
                color: "white",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Share Trip Details
            </button>
            <button
              style={{
                backgroundColor: "#841C26",
                color: "white",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Cancel Trip
            </button>
          </div>
        </div>
      ) : (
        <Feedback />
      )}
    </div>
  );
};

export default TripTracker;
