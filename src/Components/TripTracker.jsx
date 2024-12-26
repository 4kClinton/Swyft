// import React, { useState, useEffect } from "react";
// import {
//   GoogleMap,
//   Marker,
//   Polyline,
//   useJsApiLoader,
// } from "@react-google-maps/api";
// import CircularProgress from "@mui/material/CircularProgress";
// import io from "socket.io-client";
// import Feedback from "./Feedback";

// const TripTracker = ({ destination, rideId }) => {
//   const [currentLocation, setCurrentLocation] = useState({
//     lat: -1.286389,
//     lng: 36.817223,
//   }); // Nairobi default
//   const [routePath, setRoutePath] = useState([]);
//   const [tripCompleted, setTripCompleted] = useState(false);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Replace with your API Key
//   });

//   useEffect(() => {
//     const socket = io("http://localhost:5000"); // Backend connection

//     // Join ride room
//     socket.emit("join_ride", { rideId });

//     // Listen for location updates
//     socket.on("location_update", (location) => {
//       setCurrentLocation(location);
//       setRoutePath((prevPath) => [...prevPath, location]);
//     });

//     // Simulate arrival after some time (for demo)
//     setTimeout(() => setTripCompleted(true), 15000);

//     return () => socket.disconnect();
//   }, [rideId]);

//   const shareLink = () => {
//     const link = `${window.location.origin}/track?rideId=${rideId}`;
//     navigator.clipboard.writeText(link);
//     alert("Trip details link copied!");
//   };

//   if (!isLoaded) return (
//     <div>
//       <CircularProgress size={34} color="inherit" />
//     </div>
//   );

//   return (
//     <div
//       style={{
//         width: "100%",
//         height: "100vh",
//         backgroundColor: "#fff",
//         display: "flex",
//         flexDirection: "column",
//         fontFamily: "Arial, sans-serif",
//       }}
//     >
//       {!tripCompleted ? (
//         <div
//           style={{
//             padding: "1rem",
//             flexGrow: 1,
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           <h2
//             style={{
//               color: "#333",
//               fontWeight: "600",
//               fontSize: "1.5rem",
//               textAlign: "center",
//             }}
//           >
//             Trip in Progress
//           </h2>
//           <GoogleMap
//             center={currentLocation}
//             zoom={15}
//             mapContainerStyle={{
//               height: "60vh",
//               width: "100%",
//               borderRadius: "10px",
//               boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
//               marginTop: "1rem",
//             }}
//           >
//             <Marker position={currentLocation} label="You" />
//             <Marker position={destination} label="Destination" />
//             {routePath.length > 1 && (
//               <Polyline
//                 path={routePath}
//                 options={{ strokeColor: "#2191FB", strokeWeight: 4 }}
//               />
//             )}
//           </GoogleMap>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               marginTop: "1.5rem",
//               gap: "1rem",
//             }}
//           >
//             <button
//               onClick={shareLink}
//               style={{
//                 flex: 1,
//                 backgroundColor: "#18b700",
//                 color: "white",
//                 padding: "0.75rem",
//                 border: "none",
//                 borderRadius: "8px",
//                 fontSize: "1rem",
//                 fontWeight: "500",
//                 boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
//                 cursor: "pointer",
//               }}
//             >
//               Share Trip Details
//             </button>
//             <button
//               style={{
//                 flex: 1,
//                 backgroundColor: "#FF3B30",
//                 color: "white",
//                 padding: "0.75rem",
//                 border: "none",
//                 borderRadius: "8px",
//                 fontSize: "1rem",
//                 fontWeight: "500",
//                 boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
//                 cursor: "pointer",
//               }}
//             >
//               Cancel Trip
//             </button>
//           </div>
//         </div>
//       ) : (
//         <Feedback />
//       )}
//     </div>
//   );
// };

// export default TripTracker;



import React from "react";
import logo from "../assets/loader-logo.png"; // Adjust the path based on your file structure

const TripTracker = () => {
  return (
    <section style={{ textAlign: "center", marginTop: "50px" }}>
      <img
        src={logo}
        alt="Company Logo"
        style={{ width: "150px", marginBottom: "20px" }}
      />
      <h2 style={{ color: "#00D46A", fontSize: "2rem" }}>COMING SOON!</h2>
    </section>
  );
};

export default TripTracker;
