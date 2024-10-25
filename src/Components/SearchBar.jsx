import React, { useState, useEffect } from "react";
import "../Styles/SearchBar.css";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress"; // For loader

const SearchBar = ({ setDestination }) => {
  const [userInput, setUserInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false); // Track location loading state

  // Fetch location suggestions based on searchInput
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchInput === "") {
        setSuggestions([]);
        return;
      }

      if (!window.google) return;

      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        { input: searchInput },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
          }
        }
      );
    };

    fetchSuggestions();
  }, [searchInput]);

  // Fetch current location when the component mounts
  useEffect(() => {
    handleGetCurrentLocation();
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSuggestionClick = (place) => {
    setSearchInput(place.description);
    setSelectedPlace(place);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ placeId: place.place_id }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
        const location = results[0].geometry.location;
        const newDestination = { lat: location.lat(), lng: location.lng() };
        setDestination(newDestination); // Update the destination using the selected suggestion
      } else {
        console.error("Geocoding failed with status:", status);
      }
    });

    setSuggestions([]); // Clear suggestions after selection
  };

  const handleSearch = () => {
    if (searchInput) {
      // Logic for using the search term from searchInput if needed
    }
  };

  // Function to get the user's current location
  const handleGetCurrentLocation = () => {
    setIsLocationLoading(true); // Start the loading state
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newDestination = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Reverse geocode to get the address of the current location
          const geocoder = new window.google.maps.Geocoder();
          const latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
              setUserInput(results[0].formatted_address); // Set the user's location in the input
              setDestination(newDestination); // Set the destination to the current location
            } else {
              console.error("Error retrieving address:", status);
            }
            // Ensure that the loading state is stopped after geocoding is done
            setIsLocationLoading(false); // Stop loading state after location is fetched
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(`Error: ${error.message}`);
          setIsLocationLoading(false); // Stop loading state if there's an error
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsLocationLoading(false); // Stop loading state if geolocation is not supported
    }
  };

  return (
    <div className="Search-container">
      {/* Input field with loader */}
      <div className="location-input-container">
        <input
          className="Search UserInput"
          type="text"
          value={userInput}
          readOnly // Prevents user from typing in this field
          placeholder="Your location"
          disabled={isLocationLoading} // Disable the input when location is loading
        />
        {/* Show loader only while loading location */}
        {isLocationLoading && (
          <div className="loader-overlay">
            <CircularProgress size={20} /> {/* Smaller size loader */}
          </div>
        )}
      </div>

      {/* Input for searching locations with suggestions */}
      <input
        className="Search SearchInput"
        type="text"
        value={searchInput}
        onChange={handleSearchInputChange}
        placeholder="Search for a location"
      />
      <button className="search-Button" onClick={handleSearch}>
        <SearchIcon />
      </button>

      {/* Show suggestions for search input */}
      {searchInput.length > 0 && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((place) => (
            <li
              key={place.place_id}
              onClick={() => handleSuggestionClick(place)}
            >
              {place.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
