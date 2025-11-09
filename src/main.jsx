import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authProvider.jsx';
import App from './App.jsx';
import PublicHome from './pages/home/publicHome.jsx';
import UserHome from './pages/home/userHome.jsx';
import AdminHome from './pages/home/adminHome.jsx';
import Login from './pages/login/loginForm.jsx';
import Register from './pages/register/registerForm.jsx';
import Torneos from './pages/torneos/Torneo.jsx';
import CrearTorneo from './pages/torneos/crear.jsx';
import './styles/main.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Layout principal */}
          <Route path="/" element={<App />}>
            <Route index element={<PublicHome />} />
            <Route path="home" element={<UserHome />} />
            <Route path="admin" element={<AdminHome />} />
            <Route path="torneos" element={<Torneos />} />
            <Route path="torneos/crear" element={<CrearTorneo />} />
          </Route>

          {/* Pantallas fuera del layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
