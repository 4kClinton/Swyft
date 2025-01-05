import React, { useState, useEffect } from "react";
import "../Styles/SearchBar.css";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress"; // For loader

const SearchBar = ({ setDestination }) => {
  const [userInput, setUserInput] = useState(""); // State for user's input (initial location)
  const [searchInput, setSearchInput] = useState(""); // State for search input (location search)
  const [userSuggestions, setUserSuggestions] = useState([]); // State for user location suggestions
  const [searchSuggestions, setSearchSuggestions] = useState([]); // State for search location suggestions
  const [selectedPlace, setSelectedPlace] = useState(null); // State for selected place
  const [isLocationLoading, setIsLocationLoading] = useState(false); // Track location loading state

  useEffect(() => {
    console.log(userInput);
    console.log(userSuggestions);
  }, [userInput, userSuggestions]);

  // Fetch location suggestions based on searchInput (Search input)
  useEffect(() => {
    const fetchSearchSuggestions = async () => {
      if (searchInput === "") {
        setSearchSuggestions([]);
        return;
      }

      if (!window.google) return;

      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: searchInput,
          componentRestrictions: { country: "KE" }, // Restrict suggestions to Kenya
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setSearchSuggestions(predictions);
          } else {
            setSearchSuggestions([]);
          }
        }
      );
    };

    fetchSearchSuggestions();
  }, [searchInput]);

  // Fetch location suggestions for user's location input (userInput)
  useEffect(() => {
    const fetchUserSuggestions = async () => {
      if (userInput === "") {
        setUserSuggestions([]);
        return;
      }

      if (!window.google) return;

      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: userInput,
          componentRestrictions: { country: "KE" }, // Restrict suggestions to Kenya
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setUserSuggestions(predictions);
          } else {
            setUserSuggestions([]);
          }
        }
      );
    };

    fetchUserSuggestions();
  }, [userInput]);

  // Fetch current location when the component mounts
  useEffect(() => {
    handleGetCurrentLocation();
  }, []);

  // Update the userInput (User's location) when the user types in the first input
  const handleUserInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // Update the searchInput (Search location) when the user types in the second input
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Handle clicking on a suggestion to select a location for search input
  const handleSuggestionClick = (place) => {
    setSearchSuggestions([]);
    setSelectedPlace(place);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ placeId: place.place_id }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
        const location = results[0].geometry.location;
        const newDestination = { lat: location.lat(), lng: location.lng() };
        setDestination(newDestination); // Set the destination based on the selected suggestion
      } else {
        console.error("Geocoding failed with status:", status);
      }
    });
  };

  // Handle selecting a suggestion for user location (first input)
  const handleUserLocationSuggestionClick = (place) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ placeId: place.place_id }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
        const location = results[0].geometry.location;
        const newDestination = { lat: location.lat(), lng: location.lng() };
        setDestination(newDestination); // Set the destination for user location
      } else {
        console.error("Geocoding failed with status:", status);
      }
    });

    setUserSuggestions([]); // Clear suggestions after selection
  };

  // Handle fetching the current location
  const handleGetCurrentLocation = () => {
    setIsLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newDestination = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const geocoder = new window.google.maps.Geocoder();
          const latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
              setUserInput(results[0].formatted_address); // Set the user's location in the input field
              setDestination(newDestination); // Set the destination to the user's location
            } else {
              console.error("Error retrieving address:", status);
            }
            setIsLocationLoading(false); // Stop loading state after geocoding
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
      <h2 className="whereTo">Where to?</h2>

      {/* User location input */}
      <div className="location-input-container">
        <input
          className="Search UserInput"
          type="text"
          value={userInput}
          onChange={handleUserInputChange}
          placeholder="Your location"
          disabled={isLocationLoading} // Disable when location is loading
        />
        {isLocationLoading && (
          <div className="loader-overlay">
            <CircularProgress size={20} style={{marginLeft:"1vh"}} />
          </div>
        )}
        {/* Suggestions list for userInput */}
        {userInput.length > 0 && userSuggestions.length > 0 && (
          <ul className="client-suggestions-list">
            {userSuggestions.map((place) => (
              <li
                key={place.place_id}
                onClick={() => handleUserLocationSuggestionClick(place)}
              >
                {place.description}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Search input for location search */}
      <input
        className="Search SearchInput"
        type="text"
        value={searchInput}
        onChange={handleSearchInputChange}
        placeholder="Search for a location"
      />

      {/* Suggestions list for searchInput */}
      {searchInput.length > 0 && searchSuggestions.length > 0 && (
        <ul className="suggestions-list">
          {searchSuggestions.map((place) => (
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
