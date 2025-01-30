import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import NearMeIcon from "@mui/icons-material/NearMe";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import ApartmentIcon from "@mui/icons-material/Apartment";
import SettingsIcon from "@mui/icons-material/Settings";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import profile from "../assets/profile.jpeg";
import "../Styles/Navbar.css";
import { useUser } from "../contexts/UserContext.jsx"; // Import the useUser hook
import { deleteUser } from "../Redux/Reducers/UserSlice.js";
import { useDispatch } from "react-redux";
// import FindDriver from "./FindDriver"; // Import the loading component
import LoaderPopup from "./LoaderPopup.jsx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const { user, setUser } = useUser(); // Access the user and setUser from context
  const navigate = useNavigate();
  const theUser=useSelector((state)=>state.user.value)
   const dispatch = useDispatch();

  // Check login status on mount
  useEffect(() => {
    const loginStatus = theUser.name;

    if (loginStatus) {
      setIsLoggedIn(true); // User is logged in
    }
    
  }, [theUser]);

  const notify = () => {
    toast.info("This Feature is coming soon!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);

 
  };

  const handleLogout = () => {
    sessionStorage.removeItem("authToken"); // Correct storage removal
    // setUser(null); // Clear the user in the context
    dispatch(deleteUser())
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
            {/* <FindDriver /> */}
            {/* <LoaderPopup /> */}
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
                marginLeft: "7vh",
              }}
            >
              <HomeIcon style={{ color: "#18b700", marginRight: "8px" }} />
              Dashboard
            </Link>
          </div>
          {/* Account Info */}
          <div className="card" id="Account-Card">
            <Link
              onClick={toggleSidebar}
              to={"/acc"}
              style={{
                width: "80%",
                fontSize: "20px",
                backgroundColor: "var(--primary-color)",
                padding: "1vh",
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
              <h3>{isLoggedIn ? `Hi  ${theUser?.name}` : "Account"}</h3>
            </Link>

            {/* Log In / Log Out Button */}
            {isLoggedIn ? (
              <button className="login-button" onClick={handleLogout}>
                Log Out
              </button>
            ) : (
              <Link onClick={toggleSidebar} to="/login">
                <button
                  className="login-button"
                  style={{ width: "120%", height: "unset", fontSize: "large" }}
                >
                  Log In
                </button>
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

                <Link
                  to="/track"
                  // onClick={notify}
                  onClick={toggleSidebar}
                  style={{
                    backgroundColor: "var(--primary-color)",
                    // padding: "10px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    marginLeft: "1vh",
                    alignItems: "center",
                  }}
                >
                  <NearMeIcon
                    style={{
                      color: "#18b700",
                      marginRight: "8px",
                    }}
                  />
                  Track Your Cargo
                </Link>
              </ul>
            </div>
          )}

          {/* Additional Services */}
          <div className="card">
            <h3>Additional Services</h3>

            <Link
              to="/findhouse"
              onClick={toggleSidebar}
              style={{
                backgroundColor: "var(--primary-color)",
                borderRadius: " 10px",
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                margin: "2vh",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "larger",
              }}
            >
              <ApartmentIcon
                style={{
                  color: "#18b700", // Custom icon color
                  marginRight: "8px",
                  // marginBottom: "8px",
                }}
              />
              Find a House
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
