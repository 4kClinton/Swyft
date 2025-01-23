import { useState, useEffect } from 'react';
import '../Styles/SearchBar.css';
import CircularProgress from '@mui/material/CircularProgress'; // For loader

//eslint-disable-next-line
const SearchBar = ({ setDestination, setCurrentLocation }) => {
  const [userInput, setUserInput] = useState(''); // State for user's input (initial location)
  const [searchInput, setSearchInput] = useState(''); // State for search input (location search)
  const [userSuggestions, setUserSuggestions] = useState([]); // State for user location suggestions
  const [searchSuggestions, setSearchSuggestions] = useState([]); // State for search location suggestions
  const [isLocationLoading, setIsLocationLoading] = useState(false); // Track location loading state
  const [isSuggestionClicked, setIsSuggestionClicked] = useState(false); // Track if a suggestion was clicked
  const [isUserLocationSuggestionClicked, setIsUserLocationSuggestionClicked] =
    useState(false); // Track if a suggestion was clicked

  useEffect(() => {}, [userInput, userSuggestions]);

  // Fetch location suggestions based on searchInput (Search input)
  useEffect(() => {
    if (isSuggestionClicked) return; // Skip fetching if suggestion is clicked

    const fetchSearchSuggestions = async () => {
      if (searchInput === '') {
        setSearchSuggestions([]);
        return;
      }

      if (!window.google) return;

      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: searchInput,
          componentRestrictions: { country: 'KE' }, // Restrict suggestions to Kenya
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
  }, [searchInput, isSuggestionClicked]);

  // Fetch location suggestions for user's location input (userInput)
  useEffect(() => {
    if (isUserLocationSuggestionClicked) return; // Skip fetching if suggestion is clicked
    const fetchUserSuggestions = async () => {
      if (userInput === '') {
        setUserSuggestions([]);
        return;
      }

      if (!window.google) return;

      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: userInput,
          componentRestrictions: { country: 'KE' }, // Restrict suggestions to Kenya
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
  }, [userInput, isUserLocationSuggestionClicked]);

  // Fetch current location when the component mounts
  useEffect(() => {
    handleGetCurrentLocation();
  }, []);

  // Update the userInput (User's location) when the user types in the first input
  const handleUserInputChange = (e) => {
    setUserInput(e.target.value);
    setIsUserLocationSuggestionClicked(false);
  };

  // Update the searchInput (Search location) when the user types in the second input
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    setIsSuggestionClicked(false);
  };

  const handleSuggestionClick = (place) => {
    setIsSuggestionClicked(true); // Mark that a suggestion was clicked
    setSearchInput(place.description); // Set the input field to the selected suggestion
    setSearchSuggestions([]); // Clear the suggestions list

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ placeId: place.place_id }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
        const location = results[0].geometry.location;
        const newDestination = { lat: location.lat(), lng: location.lng() };
        setDestination(newDestination); // Set the destination
      } else {
        console.error('Geocoding failed with status:', status);
      }
    });
  };

  const handleUserLocationSuggestionClick = (place) => {
    setIsUserLocationSuggestionClicked(true); // Mark that a suggestion was clicked
    setUserInput(place.description); // Set the input field to the selected suggestion
    setUserSuggestions([]); // Clear the suggestions list

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ placeId: place.place_id }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
        const location = results[0].geometry.location;
        const newLocation = { lat: location.lat(), lng: location.lng() };
        setCurrentLocation(newLocation);
      } else {
        console.error('Geocoding failed with status:', status);
      }
    });
  };

  // Handle fetching the current location
  const handleGetCurrentLocation = () => {
    setIsLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const geocoder = new window.google.maps.Geocoder();
          const latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
              setUserInput(results[0].formatted_address); // Set the user's location in the input field
            } else {
              console.error('Error retrieving address:', status);
            }
            setIsLocationLoading(false); // Stop loading state after geocoding
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert(`Error: ${error.message}`);
          setIsLocationLoading(false); // Stop loading state if there's an error
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
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
            <CircularProgress size={20} style={{ marginLeft: '1vh' }} />
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
