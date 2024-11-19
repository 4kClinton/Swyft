// AccountComponent.jsx
import React, { useEffect, useState } from "react";
import $ from "jquery";

const Account = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    $.ajax({
      url: "https://randomuser.me/api/",
      dataType: "json",
      success: function (data) {
        // Log to console
        console.log(data);
        // Set the user state with API data
        setUser(data.results[0]);
      },
      error: function (error) {
        console.error("Error fetching user data:", error);
      },
    });
  }, []);

  if (!user) {
    return <p>Loading user details...</p>;
  }

  return (
    <div className="account-details">
      <h2>User Account Details</h2>
      <img src={user.picture.large} alt="User Avatar" />
      <p>
        <strong>Name:</strong> {`${user.name.first} ${user.name.last}`}
      </p>
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
  );
};

export default Account;
