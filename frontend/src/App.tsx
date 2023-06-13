import React, { useState } from 'react';
import './App.css';
import Booking from './components/Booking/Booking';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import AddService from './components/AddService/AddService';
import Visits from './components/Visits/Visits';
import Hero from './components/Hero/Hero';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const [userId, setUserId] = useState(localStorage.getItem('userId'))

  return (
    <BrowserRouter>
      <Navbar userId={userId} setUserId={setUserId}></Navbar>
      <Hero></Hero>
      <Routes>
        <Route path="/" element={<Booking />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login setUserId={setUserId} />} />
        <Route path="addservice" element={<AddService />} />
        <Route path="visits" element={<Visits />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
