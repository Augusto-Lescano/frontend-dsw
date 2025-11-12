import { useState, useEffect } from 'react';
import { obtenerEquipos, eliminarEquipo } from '../../services/equipoService.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth.js';
import './Equipo.css';

export default function Equipos() {
  const [equipos, setEquipos] = useState([]);
  const [error, setError] = useState('');
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

  const navigate = useNavigate();
  const { usuario } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerEquipos();
        setEquipos(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  const handleCrearEquipo = () => navigate('/equipos/crear');
  const handleActualizarEquipo = (id) => navigate(`/equipos/actualizar/${id}`);

  const handleEliminarEquipo = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este equipo?')) {
      try {
        await eliminarEquipo(id);
        setEquipos((prev) => prev.filter((e) => e.id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleMostrarMiembros = (equipo) => {
    setEquipoSeleccionado((prev) =>
      prev?.id === equipo.id ? null : equipo
    );
  };

  return (
  <div className="contenedor-equipos">
    <h1>Lista de Equipos</h1>
    {error && <p className="error">{error}</p>}

    <div className="lista-equipos">
      {equipos.length > 0 ? (
        equipos.map((e) => (
          <div key={e.id} className="tarjeta-equipo">
            <div className="contenido-tarjeta">
              <h3>{e.nombre}</h3>
              <p><strong>Capitán:</strong> {e.capitan?.nombre || 'Sin capitán'}</p>
              <p><strong>Miembros:</strong> {e.jugadores?.length + 1 || 1}</p>
              <p><strong>Descripción:</strong> {e.descripcion || 'Sin descripción'}</p>

              {equipoSeleccionado?.id === e.id && (
                <div className="miembros-lista">
                  <h4>Miembros del equipo:</h4>
                  <ul>
                    <li>👑 {e.capitan?.nombre} (Capitán)</li>
                    {e.jugadores && e.jugadores.length > 0 ? (
                      e.jugadores.map((jugador) => (
                        <li key={jugador.id}>👤 {jugador.nombre}</li>
                      ))
                    ) : (
                      <li>No hay otros miembros en el equipo</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div className="botones-tarjeta">
              <button
                className="btnVerMiembros"
                onClick={() => handleMostrarMiembros(e)}
              >
                {equipoSeleccionado?.id === e.id
                  ? 'Ocultar miembros'
                  : 'Ver miembros'}
              </button>

              {usuario?.id === e.capitan?.id && (
                <>
                  <button
                    className="btnActualizar"
                    onClick={() => handleActualizarEquipo(e.id)}
                  >
                    Actualizar
                  </button>
                  <button
                    className="btnEliminar"
                    onClick={() => handleEliminarEquipo(e.id)}
                  >
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No hay equipos disponibles.</p>
      )}

      {/* ✅ Tarjeta para Agregar Equipo */}
      {usuario && (
        <div className="tarjeta-equipo-agregar" onClick={handleCrearEquipo}>
          <button className="btnAgregarTarjeta">
            <span className="icono-agregar">+</span>
            <span className="texto-agregar">Agregar Equipo</span>
          </button>
        </div>
      )}
    </div>
  </div>
);

}