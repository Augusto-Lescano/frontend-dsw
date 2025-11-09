import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/useAuth.js';
import { useNavigate } from 'react-router-dom';
import './IconoUsuario.css';

function IconoUsuario() {
  const { logout, usuario } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  const handleActualizar = () => {
    setOpen(false);
    navigate('/perfil'); // tu ruta de editar perfil
  };

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate('/login');
  };

  // Cerrar menú si clic fuera del contenedor
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="user-menu-container" ref={menuRef}>
      <div
        className="user-icon"
        onClick={() => setOpen(!open)}
        title={usuario ? usuario.nombre : 'Mi cuenta'}
      >
        👤
      </div>

      {open && (
        <div className="user-dropdown">
          <button onClick={handleActualizar}>Actualizar perfil</button>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}

export default IconoUsuario;
