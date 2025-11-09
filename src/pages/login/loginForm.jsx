import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginForm.css';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!usuario || !password) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    if ((usuario === 'gianmarco' || usuario === 'gianmarco@torneos.com') && password === 'gianmarco123') {
      alert('Inicio de sesión exitoso ✅');
      setError('');
      navigate('/');
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="login-container">

      {/* Logo arriba a la izquierda */}
      <img
        src="../src/assets/images/logoPaginaPNG.png"
        alt="ClutchUp logo"
        className="logo-izquierda"
        onClick={() => navigate('/')}
      />

      <form className="form-login" onSubmit={handleLogin}>
        <img
          src="../src/assets/images/logoPaginaPNG.png"
          alt="Logo ClutchUp"
          className="logo-form"
        />
        <h2>Inicio de Sesión</h2>

        {error && <div className="error">{error}</div>}

        <div className="campo">
          <label htmlFor="usuario">Usuario o Email</label>
          <input
            type="text"
            id="usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
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
