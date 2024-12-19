import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import profile from "../assets/profile.jpeg";
import "../Styles/Navbar.css";
import { useUser } from "../contexts/UserContext.jsx"; // Import the useUser hook

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const { user, setUser } = useUser(); // Access the user and setUser from context
  const navigate = useNavigate();

  useEffect(() => {
    const loginStatus = sessionStorage.getItem("authToken");
    console.log("Login status on mount:", loginStatus); // Debugging line
    if (loginStatus) {
      setIsLoggedIn(true); // User is logged in
    }
  }, []);

  const notify = () => {
    toast.info("This Feature is coming soon!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);

    // Check session storage and log the login status
    const loginStatus = sessionStorage.getItem("Login successful");
    console.log("Login status on menu click:", loginStatus); // Log the login status
    if (loginStatus) {
      setIsLoggedIn(true); // User is logged in
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("Login successful"); // Correct storage removal
    setUser(null); // Clear the user in the context
    setIsLoggedIn(false); // Update the login status in state
    navigate("/login"); // Redirect to the login page
    toast.success("Logged out successfully!");
  };

  return (
    <div>
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="toast-container"
      />

      {/* Sidebar toggle button */}
      <div className="icon-button" onClick={toggleSidebar}>
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "show-sidebar" : ""}`}>
        <div className="cards">
          <div className="card">
            <Link
              onClick={toggleSidebar}
              to={"/"}
              style={{
                backgroundColor: "var(--primary-color)",
                padding: "1vh",
                width: "50%",
                borderRadius: "10px",
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2vh",
              }}
            >
              <HomeIcon style={{ color: "#18b700", marginRight: "8px" }} />
              Dashboard
            </Link>
          </div>
          {/* Account Info */}
          <div className="card">
            <Link
              onClick={toggleSidebar}
              to={"/acc"}
              style={{
                backgroundColor: "var(--primary-color)",
                padding: "1vh",
                width: "50%",
                borderRadius: "10px",
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
                marginBottom: "2vh",
              }}
            >
              <img
                src={profile}
                alt="Profile"
                style={{
                  width: "5vh",
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
              />
              <h3>{isLoggedIn ? `Hi There` : "Account"}</h3>
            </Link>

            {/* Log In / Log Out Button */}
            {isLoggedIn ? (
              <button className="login-button" onClick={handleLogout}>
                Log Out
              </button>
            ) : (
              <Link onClick={toggleSidebar} to="/login">
                <button className="login-button">Log In</button>
              </Link>
            )}
          </div>

          {/* Account Options */}
          {isLoggedIn && (
            <div className="card">
              <h3>Account Options</h3>
              <ul className="menu-options">
                {/* Ride History */}
                <Link
                  onClick={toggleSidebar}
                  to="/ridesHistory"
                  style={{
                    backgroundColor: "var(--primary-color)",
                    padding: "10px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <HistoryIcon
                    style={{ color: "#18b700", marginRight: "8px" }}
                  />
                  Ride History
                </Link>

                {/* Scheduled Rides */}
                <Link
                  onClick={toggleSidebar}
                  to="/scheduled-rides"
                  style={{
                    backgroundColor: "var(--primary-color)",
                    padding: "10px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <HistoryIcon
                    style={{ color: "#18b700", marginRight: "8px" }}
                  />
                  Scheduled Rides
                </Link>

                {/* Settings */}
                <Link
                  onClick={toggleSidebar}
                  to="/settings"
                  style={{
                    backgroundColor: "var(--primary-color)",
                    padding: "10px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <SettingsIcon
                    style={{ color: "#18b700", marginRight: "8px" }}
                  />
                  Settings
                </Link>
              </ul>
            </div>
          )}

          {/* Additional Services */}
          <div className="card">
            <h3>Additional Services</h3>
            <ul>
              <li onClick={notify}>
                <i
                  className="fas fa-clipboard-check"
                  style={{ color: "#18b700", marginRight: "8px" }}
                ></i>
                Event Setup Package
              </li>
              <li onClick={notify}>
                <i
                  className="fas fa-utensils"
                  style={{
                    color: "#18b700",
                    marginRight: "8px",
                    marginBottom: "8px",
                  }}
                ></i>
                Catering Services
              </li>
              <li onClick={notify}>
                <i
                  className="fas fa-building"
                  style={{
                    color: "#18b700",
                    marginRight: "8px",
                    marginBottom: "8px",
                  }}
                ></i>
                Find a House
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
