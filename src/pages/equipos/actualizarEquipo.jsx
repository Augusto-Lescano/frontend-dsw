import { useEffect, useState } from 'react';
import { obtenerUnEquipo, actualizarEquipo } from '../../services/equipoService.js';
import { obtenerUsuariosSinEquipo } from '../../services/authService.js';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/useAuth.js';
import './actualizarEquipo.css';

export default function ActualizarEquipo() {
  const { id } = useParams();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState(''); // <-- campo descripcion
  const [miembros, setMiembros] = useState([]);
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { usuario } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const equipo = await obtenerUnEquipo(id);
        const disponibles = await obtenerUsuariosSinEquipo();
        const filtrados = disponibles.filter(u => u.id !== usuario.id);
        setNombre(equipo.nombre || '');
        setDescripcion(equipo.descripcion || ''); // <-- inicializar descripcion
        // backend devuelve "jugadores"
        setMiembros(equipo.jugadores?.map((j) => j.id) || []);
        setUsuariosDisponibles(filtrados);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, [id, usuario]);

  const handleSeleccionarMiembro = (userId) => {
    setMiembros((prev) =>
      prev.includes(userId)
        ? prev.filter((m) => m !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // enviamos "jugadores" porque así lo espera el backend
      await actualizarEquipo(id, { nombre, descripcion, jugadores: miembros });
      navigate('/equipos');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="contenedor-torneos">
      <h1>Actualizar equipo</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form-equipo">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del equipo"
          required
        />

        {/* campo descripcion */}
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción del equipo (opcional)"
          rows={4}
        />

        <h3>Actualizar miembros</h3>
        <div className="miembros-lista">
          {usuariosDisponibles.length > 0 ? (
            usuariosDisponibles.map((u) => (
              <label key={u.id} className="miembro-item">
                <input
                  type="checkbox"
                  checked={miembros.includes(u.id)}
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
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
