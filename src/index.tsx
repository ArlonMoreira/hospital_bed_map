import React from 'react';
import ReactDOM from 'react-dom/client';

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

//styles
import './index.css';
import 'react-tooltip/dist/react-tooltip.css';
//App
import App from './App';
//Redux
import { Provider } from 'react-redux';
import { store } from './store';
//Context
import { SectorProvider } from './components/Context/SectorContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  //<React.StrictMode>
  <SectorProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </SectorProvider>
  //</React.StrictMode>
);
