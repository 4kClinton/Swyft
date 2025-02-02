import { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const UserContext = createContext();

//eslint-disable-next-line
export const useUser = () => useContext(UserContext);

//eslint-disable-next-line
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = Cookies.get('accessToken');
    return storedUser ? { accessToken: storedUser } : null;
  });

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'accessToken') {
        const updatedToken = event.newValue;
        setUser(updatedToken ? { accessToken: updatedToken } : null);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      // Cleanup listener
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logIn = (accessToken) => {
    Cookies.set('authTokencl1', accessToken, {
      expires: 7,
      secure: true,
      sameSite: 'Strict',
    });
    setUser({ accessToken });
  };

  const logOut = () => {
    Cookies.remove('accessToken');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logIn, logOut }}>
      {children}
    </UserContext.Provider>
  );
};
