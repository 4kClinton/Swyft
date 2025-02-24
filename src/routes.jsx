import App from './App';
import Map from './Components/Map';
import Login from './Components/Login';
import Signup from './Components/SignUp';
import OrderConfirmation from './Components/OrderDetailsConfirmation.jsx';
import RidesHistory from './Components/MyRides';

import ScheduledRides from './Components/ScheduledRides';
import Account from './Components/Account';
import Settings from './Components/Settings';
import DriverDetails from './Components/driverDetails';
import TripTracker from './Components/TripTracker';
import FindHouse from './Components/FindHouse';
import OrderCompletion from './Components/OrderCompletion';

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Login /> },
      { path: '/dash', element: <Map /> },
      { path: '/signup', element: <Signup /> },
      { path: '/scheduled-rides', element: <ScheduledRides /> },
      { path: '/acc', element: <Account /> },
      { path: '/ridesHistory', element: <RidesHistory /> },
      { path: '/settings', element: <Settings /> },
      { path: '/driverDetails', element: <DriverDetails /> },
      { path: '/track', element: <TripTracker /> },
      { path: '/findhouse', element: <FindHouse /> },
      { path: '/rate-driver', element: <OrderCompletion /> },
      { path: '/confirmOrder', element: <OrderConfirmation /> },
    ],
  },
];

export { routes };
