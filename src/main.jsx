import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Torneos from './pages/torneos/Torneo.jsx';
import CrearTorneo from './pages/torneos/crear.jsx';
import Login from './pages/login/loginForm.jsx';
import Register from './pages/register/registerForm.jsx';
import './styles/main.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/torneos" element={<Torneos />} />
        <Route path="/torneos/crear" element={<CrearTorneo />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
