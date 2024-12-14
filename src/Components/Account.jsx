import React, { useEffect, useState } from "react";
import $ from "jquery";
import "../Styles/Account.css";

const Account = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    $.ajax({
      url: "https://randomuser.me/api/",
      dataType: "json",
      success: function (data) {
        console.log(data); // Log to console
        setUser(data.results[0]); // Set user state
      },
      error: function (error) {
        console.error("Error fetching user data:", error);
      },
    });
  }, []);

  if (!user) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading user details...</p>
      </div>
    );
  }

  return (
    <div className="account-container">
      <div className="user-card">
        <div className="avatar">
          <img src={user.picture.large} alt="User Avatar" />
        </div>
        <h2>{`${user.name.first} ${user.name.last}`}</h2>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
        <p>
          <strong>Location:</strong>{" "}
          {`${user.location.city}, ${user.location.country}`}
        </p>
      </div>
    </div>
  );
};

export default Account;
