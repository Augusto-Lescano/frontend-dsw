import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './registerForm.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    pais: '',
    usuario: '',
    email: '',
    password: '',
    confirmar: '',
  });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const navigate = useNavigate();

  const paises = [
    'Argentina',
    'Brasil',
    'Chile',
    'Uruguay',
    'Paraguay',
    'México',
    'España',
    'Estados Unidos',
    'Perú',
    'Colombia',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    const { nombre, apellido, pais, usuario, email, password, confirmar } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 🔎 Validaciones
    if (!nombre || !apellido || !pais || !usuario || !email || !password || !confirmar) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    if (typeof nombre !== 'string' || nombre.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.');
      return;
    }

    if (typeof apellido !== 'string' || apellido.trim().length < 4) {
      setError('El apellido debe tener al menos 4 caracteres.');
      return;
    }

    if (typeof pais !== 'string' || pais.trim().length < 4) {
      setError('Debe seleccionar un país válido.');
      return;
    }

    if (typeof usuario !== 'string' || usuario.trim().length < 6) {
      setError('El nombre de usuario debe tener al menos 6 caracteres.');
      return;
    }

    if (typeof email === 'string' && !emailRegex.test(email)) {
      setError('El formato del email es inválido.');
      return;
    }

    if (typeof password !== 'string' || password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // ✅ Si pasa todas las validaciones:
    setExito('Registro exitoso ✅');
    setTimeout(() => navigate('/login'), 1500);
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

      <form className="form-login" onSubmit={handleRegister}>
        <img
          src="../src/assets/images/logoPaginaPNG.png"
          alt="Logo ClutchUp"
          className="logo-form"
        />
        <h2>Crear Cuenta</h2>

        {error && <div className="error">{error}</div>}
        {exito && <div className="exito">{exito}</div>}

        <div className="campo">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ingrese su nombre"
          />
        </div>

        <div className="campo">
          <label htmlFor="apellido">Apellido</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            placeholder="Ingrese su apellido"
          />
        </div>

        <div className="campo">
          <label htmlFor="pais">País</label>
          <select
            id="pais"
            name="pais"
            value={formData.pais}
            onChange={handleChange}
          >
            <option value="">Seleccione un país</option>
            {paises.map((pais) => (
              <option key={pais} value={pais}>
                {pais}
              </option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label htmlFor="usuario">Nombre de Usuario</label>
          <input
            type="text"
            id="usuario"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            placeholder="Ingrese un nombre de usuario"
          />
        </div>

        <div className="campo">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div className="campo">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </div>

        <div className="campo">
          <label htmlFor="confirmar">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmar"
            name="confirmar"
            value={formData.confirmar}
            onChange={handleChange}
            placeholder="Repite la contraseña"
          />
        </div>

        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
