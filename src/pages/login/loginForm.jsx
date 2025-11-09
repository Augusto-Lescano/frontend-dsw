import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth.js';
import logo from '../../assets/images/logoPaginaPNG.png';
import './loginForm.css';

const Login = () => {
  const [identifier, setIdentifier] = useState(''); // usuario/email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth(); // Usar login del AuthContext
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!identifier || !password) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    try {
      const res = await login(identifier, password);

      // El backend devuelve { id, nombreUsuario, rol}
      const rol = res.data?.rol?.toLowerCase();

      // Navegación basada en rol
      if (rol === 'admin') {
        navigate('/admin'); // home admin
      } else {
        navigate('/home'); // home usuario
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al iniciar sesión.');
    }
  };

  return (
    <div className="login-container">

      {/* Logo arriba a la izquierda */}
      <img
        src={logo}
        alt="ClutchUp logo"
        className="logo-izquierda"
        onClick={() => navigate('/')}
      />

      {/* Formulario */}
      <form className="form-login" onSubmit={handleLogin}>
        
        {/* Logo dentro del formulario */}
        <img
          src={logo}
          alt="Logo ClutchUp"
          className="logo-form"
        />

        <h2>Inicio de Sesión</h2>

        {error && <div className="error">{error}</div>}

        <div className="campo">
          <label htmlFor="identifier">Usuario o Email</label>
          <input
            type="text"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Ingrese su usuario o correo"
          />
        </div>

        <div className="campo">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btnCrud">Aceptar</button>
      </form>
    </div>
  );
};

export default Login;
