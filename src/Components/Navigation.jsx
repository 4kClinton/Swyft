import React, { useState } from "react";
import "../Styles/Navigation.css"; // Assuming your CSS is saved here
import HomeIcon from "@mui/icons-material/Home"; // Import MUI icons
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";

const Navigation = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNavigationClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="navigation">
      <ul>
        <li
          className={activeIndex === 0 ? "active" : ""}
          onClick={() => handleNavigationClick(0)}
        >
          <a href="#">
            <span className="icon">
              <HomeIcon /> {/* Use MUI icon */}
            </span>
            <span className="text">Home</span>
          </a>
        </li>
        <li
          className={activeIndex === 1 ? "active" : ""}
          onClick={() => handleNavigationClick(1)}
        >
          <a href="#">
            <span className="icon">
              <SearchIcon /> {/* Use MUI icon */}
            </span>
            <span className="text">Search</span>
          </a>
        </li>
        <li
          className={activeIndex === 2 ? "active" : ""}
          onClick={() => handleNavigationClick(2)}
        >
          <a href="#">
            <span className="icon">
              <PersonIcon /> {/* Use MUI icon */}
            </span>
            <span className="text">Profile</span>
          </a>
        </li>
        {/* <div className="indicator"></div> */}
      </ul>
    </div>
  );
};

export default Navigation;
