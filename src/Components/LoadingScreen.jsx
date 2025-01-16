import '../Styles/LoadingScreen.css'; // Add styles here if needed
import logo from '../assets/loading-logo.png'; // Ensure the path to the logo is correct

const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="loader-wrapper">
      {/* Circular loader with the logo */}
      {/* <RiLoader5Line
        size={200}
        className="circular-loader"
        style={{ color: "#ffffff" }}
        thickness={3} // Adjust thickness as needed
      /> */}
      <img src={logo} alt="App Logo" className="loading-logo" />
    </div>
  </div>
);

export default LoadingScreen;
