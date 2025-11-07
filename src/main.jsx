import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Torneos from './pages/Torneo.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/torneos" element={<Torneos />} />
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