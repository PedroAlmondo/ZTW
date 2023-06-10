import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Booking from './components/Booking/Booking';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import AddService from './components/AddService/AddService';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Booking />
    <Register />
    <Login />
    <AddService />
  </React.StrictMode>
);


