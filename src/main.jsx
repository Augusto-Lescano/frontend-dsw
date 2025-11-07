import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Torneos from './pages/torneos/Torneo.jsx';
import './index.css';
import CrearTorneo from './pages/torneos/crear.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/torneos" element={<Torneos />} />
        <Route path="/torneos/crear" element={<CrearTorneo />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

/*
function Main(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/torneos" element={<Torneos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Main;*/