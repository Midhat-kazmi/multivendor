// main.jsx or index.jsx

import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { Provider } from 'react-redux';
import Store from './redux/store';
import axios from 'axios';

// Allow sending cookies with every request
axios.defaults.withCredentials = true;

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={Store}>
    <App />
  </Provider>
);
