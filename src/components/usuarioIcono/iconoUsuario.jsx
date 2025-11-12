import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/useAuth.js';
import { useNavigate } from 'react-router-dom';
import { logoutReq } from '../../services/authService.js';
import './IconoUsuario.css';

export default function IconoUsuario() {
  const { setUsuario, usuario } = useAuth();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef(null);

  const handlePerfil = () => {
    setMenuAbierto(false);
    navigate('/perfil');
  };

  // Cerrar sesión
  const handleLogout = async () => {
    try {
      await logoutReq(); // Llama a la función del contexto o servicio
      setUsuario(null);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setMenuAbierto(false);
    }
  };

  // Cierra el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="user-menu-container" ref={menuRef}>
      <div
        className="user-icon"
        onClick={() => setMenuAbierto((prev) => !prev)}
        title={usuario ? usuario.nombre : 'Mi cuenta'}
      >
        👤
      </div>

      {/* Menú desplegable */}
      <div className={`user-dropdown ${menuAbierto ? 'active' : ''}`}>
        <button onClick={handlePerfil}>Actualizar perfil</button>
        <hr />
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </div>
  );
}
