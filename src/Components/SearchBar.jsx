import React, { useState, useEffect } from "react";
import "../Styles/SearchBar.css";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ setDestination }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]); // State for suggestions
  const [selectedPlace, setSelectedPlace] = useState(null); // State for selected place

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.trim() === "") {
        setSuggestions([]);
        return;
      }

      if (!window.google) return;

      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions({ input }, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      });
    };

    fetchSuggestions();
  }, [input]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSuggestionClick = (place) => {
    setInput(place.description); // Set input to the selected suggestion
    setSelectedPlace(place); // Store the selected place

    // Get the place details using Geocoder
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ placeId: place.place_id }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
        const location = results[0].geometry.location;
        const newDestination = { lat: location.lat(), lng: location.lng() };
        setDestination(newDestination); // Set destination to the selected location
      }
    });

    setSuggestions([]); // Clear suggestions after selection
  };

  const handleSearch = () => {
    if (selectedPlace) {
      // Logic for when the search button is clicked (if needed)
      console.log("Searching for:", selectedPlace.description);
    }
  };

  return (
    <div className="Search-container">
      <input
        className="Search"
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Enter destination..."
      />
      <button className="search-Button" onClick={handleSearch}>
        <SearchIcon />
      </button>
      {suggestions.length > 0 && (
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
