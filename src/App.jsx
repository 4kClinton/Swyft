import { useState } from "react";
import SearchBar from "./Components/SearchBar.jsx";
import "./App.css";
import Map from "./Components/Map.jsx";
import Dash from "./Components/Dash.jsx";
import Navbar from "./Components/Navbar.jsx";
import Navigation from "./Components/Navigation.jsx";

function App() {
  const [isLightMode, setIsLightMode] = useState(true);

  const toggleTheme = () => {
    setIsLightMode((prevMode) => !prevMode);
    // Apply the theme class to the body element
    document.body.className = isLightMode ? "dark-mode" : "light-mode";
  };

  return (
    <>
      <div>
        <Navbar toggleTheme={toggleTheme} isLightMode={isLightMode} />
        <Map />
        <Dash />
        
      </div>
    </>
  );
}

export default App;
