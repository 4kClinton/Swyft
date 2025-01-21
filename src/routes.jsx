import App from './App';
import Map from './Components/Map';
import Login from './Components/Login';
import Signup from './Components/SignUp';

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
      { path: '/', element: <Map /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/scheduled-rides', element: <ScheduledRides /> },
      { path: '/acc', element: <Account /> },
      { path: '/ridesHistory', element: <RidesHistory /> },
      { path: '/settings', element: <Settings /> },
      { path: '/driverDetails', element: <DriverDetails /> },
      { path: '/track', element: <TripTracker /> },
      { path: '/findhouse', element: <FindHouse /> },
      { path: '/rate-driver', element: <OrderCompletion /> },
    ],
  },
];

export { routes };
