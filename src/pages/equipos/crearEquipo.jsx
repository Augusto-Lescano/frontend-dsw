import { useEffect, useState } from 'react';
import { crearEquipo } from '../../services/equipoService.js';
import { obtenerUsuariosSinEquipo } from '../../services/authService.js'; // nuevo endpoint
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth.js';
import './crearEquipo.css';

export default function CrearEquipo() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [jugadores, setJugadores] = useState([]);
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { usuario } = useAuth();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await obtenerUsuariosSinEquipo();
        const filtrados = res.filter(u => u.id !== usuario.id);
        setUsuariosDisponibles(filtrados);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUsuarios();
  }, [usuario.id]);

  const handleSeleccionarMiembro = (id) => {
    setJugadores((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearEquipo({
        nombre,
        capitan: usuario.id,
        descripcion,
        jugadores,
      });
      navigate('/equipos');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="contenedor-equipos">
      <h1>Crear nuevo equipo</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form-equipo">
        <input
          type="text"
          placeholder="Nombre del equipo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />

        <h3>Seleccionar miembros disponibles</h3>
        <div className="miembros-lista">
          {usuariosDisponibles.length > 0 ? (
            usuariosDisponibles.map((u) => (
              <label key={u.id} className="miembro-item">
                <input
                  type="checkbox"
                  checked={jugadores.includes(u.id)}
                  onChange={() => handleSeleccionarMiembro(u.id)}
                />
                {u.nombre}
              </label>
            ))
          ) : (
            <p>No hay usuarios disponibles.</p>
          )}
        </div>

        <button className="btnCrud" type="submit">
          Crear equipo
        </button>
      </form>
    </div>
  );
}
