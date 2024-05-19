import React from 'react'
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client'
import App from './App.jsx';
import { store, persistor } from './store/index.jsx';
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} >
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
