import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Booking from './components/Booking/Booking';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import AddService from './components/AddService/AddService';
import Visits from './components/Visits/Visits';
import Hero from './components/Hero/Hero';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Hero></Hero>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Booking />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="addservice" element={<AddService />} />
        <Route path="visits" element={<Visits />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


