import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthContextProvider } from "./contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";



ReactDOM.render(
  <React.StrictMode>
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


