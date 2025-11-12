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
import CrearTorneo from './pages/torneos/crearTorneo.jsx';
import ActualizarTorneo from './pages/torneos/actualizarTorneo.jsx';
import Equipos from './pages/equipos/Equipo.jsx';
import CrearEquipo from './pages/equipos/crearEquipo.jsx';
import ActualizarEquipo from './pages/equipos/actualizarEquipo.jsx';
import Faqs from './pages/FAQs/FAQs.jsx';
import Juegos from './pages/juegos/Juegos.jsx';
import CrearJuego from './pages/juegos/crearJuego.jsx';
import ActualizarJuego from './pages/juegos/actualizarJuego.jsx';
import InscripcionesAdmin from './pages/inscripciones/inscripcionesAdmin.jsx';
import UsuariosAdmin from './pages/usuariosAdmin/usuariosAdmin.jsx';
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
            <Route path="torneos/actualizar/:id" element={<ActualizarTorneo />} />
            <Route path="equipos" element={<Equipos />} />
            <Route path="equipos/crear" element={<CrearEquipo />} />
            <Route path="equipos/actualizar/:id" element={<ActualizarEquipo />} />
            <Route path="juegos" element={<Juegos />} />
            <Route path="juegos/crear" element={<CrearJuego />} />
            <Route path="juegos/actualizar/:id" element={<ActualizarJuego />} />
            <Route path="inscripciones" element={<InscripcionesAdmin />} />
            <Route path="admin/usuarios" element={<UsuariosAdmin />} />
            <Route path="FAQs" element={<Faqs />} />
          </Route>

          {/* Pantallas fuera del layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
