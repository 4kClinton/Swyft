import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FindDriver from "./FindDriver"; // Import the loading component


const FindDriverComponent = ({ orderData }) => {
  const [loading, setLoading] = useState(false); // Loading state for showing the spinner
  const navigate = useNavigate(); // Navigate hook to navigate to another page upon success

  const sendOrderToDriver = async (orderData, setLoading, navigate) => {
    try {
      // Step 1: Show loading component
      setLoading(true);

      // Step 2: Fetch online drivers
      const onlineDriversResponse = await fetch(
        `${process.env.API_BASE_URL}/onlineDrivers`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!onlineDriversResponse.ok) {
        throw new Error("Failed to fetch online drivers");
      }

      const onlineDrivers = await onlineDriversResponse.json();

      // Step 3: Select a driver
      if (onlineDrivers.length === 0) {
        setLoading(false); // Stop loading if no drivers are found
        alert("No online drivers available");
        return;
      }

      const selectedDriver = onlineDrivers[0]; // Example: select the first online driver

      // Step 4: Send order to the selected driver
      const response = await fetch(
        `${process.env.API_BASE_URL}/drivers/${selectedDriver.id}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send order to driver");
      }

      const result = await response.json();
      console.log(
        `Order sent to driver ${selectedDriver.id} successfully:`,
        result
      );

      // Step 5: Navigate to /driverDetails with driver info
      navigate("/driverDetails", {
        state: { driver: selectedDriver, order: orderData },
      });
    } catch (error) {
      console.error("Error while sending order to driver:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Hide loading component
    }
  };

  // Call sendOrderToDriver when the component loads or when the user triggers the function
  React.useEffect(() => {
    sendOrderToDriver(orderData, setLoading, navigate);
  }, [orderData, navigate]);

  return (
    <div className="find-driver-container">
      {loading ? (
        // Show the loading spinner while fetching the driver
        <FindDriver />
      ) : (
        // You can place a fallback message or success UI here if necessary
        <p>Driver has been found, your order is on its way!</p>
      )}
    </div>
  );
};

export default FindDriverComponent;
