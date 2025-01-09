import { createContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

// Create a Context to store WebSocket connection
const SocketContext = createContext(null);

// SocketProvider component to wrap your app
export const SocketProvider = ({ children }) => {
  const user = useSelector((state) => state.user.value);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    
    
    // Establish the socket connection once when the app loads
    const socketConnection = io('https://swyft-backend-client-ac1s.onrender.com');
    socketConnection.on('connect', () => {
      console.log("connected to socket server");
      
      const userType = 'customer'; 
      const userId = user.id;    
      socketConnection.emit('register_user', { userType, userId });
      });
    setSocket(socketConnection);

    // Clean up on unmount
    return () => {
      socketConnection.disconnect();
    };
  }, [user.id]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
export {SocketContext}

// Custom hook to use socket in other components
