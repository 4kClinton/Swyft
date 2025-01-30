import React from "react";
import "../Styles/findDriver.css"; // Assuming styles for your loader
import CircularProgress from "@mui/material/CircularProgress";


const FindDriver = () => {
  return (
    <div className="loading-container">
      {/* <div className="spinner">
        
      </div> */}
      <div className="popup-loading">
            <CircularProgress/>
            <h2 className="Title">Finding You a Driver ...</h2>
            <p className="description"> Please wait while we locate the best driver for your order. </p>
       </div>         

     </div>  
      
   
  );
};

export default FindDriver;
