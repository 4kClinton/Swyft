import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { store } from './Redux/Store';

import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';

const router = createBrowserRouter(routes);
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
