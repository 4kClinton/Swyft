import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("accessToken");
    return storedUser ? { accessToken: storedUser } : null;
  });

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "accessToken") {
        const updatedToken = event.newValue;
        setUser(updatedToken ? { accessToken: updatedToken } : null);
        
      }
    };

    // Add listener for sessionStorage changes
    window.addEventListener("storage", handleStorageChange);

    return () => {
      // Cleanup listener
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const logIn = (accessToken) => {
    sessionStorage.setItem("accessToken", accessToken);
    setUser({ accessToken });
  
  };

  const logOut = () => {
    sessionStorage.removeItem("accessToken");
    setUser(null);
  
  };

  return (
    <UserContext.Provider value={{ user, setUser, logIn, logOut }}>
      {children}
    </UserContext.Provider>
  );
};
