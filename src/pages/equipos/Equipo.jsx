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
      {error && <p className="error">{error}</p>}

      {/* Tarjetas de equipos */}
      <div className="lista-equipos">
        {equipos.length > 0 ? (
          equipos.map((e) => (
            <div key={e.id} className="tarjeta-equipo">
              <div className="contenido-tarjeta">
                <h3>{e.nombre}</h3>
                <p><strong>Capitán:</strong> {e.capitan?.nombre || 'Sin capitán'}</p>
                <p><strong>Miembros:</strong> {e.miembros?.length || 0}</p>
                <p><strong>Descripción:</strong> {e.descripcion || 'Sin descripción'}</p>

                {equipoSeleccionado?.id === e.id && (
                  <div className="miembros-lista">
                    <h4>Miembros del equipo:</h4>
                    {e.miembros && e.miembros.length > 0 ? (
                      <ul>
                        {e.miembros.map((m) => (
                          <li key={m.id}>{m.nombre}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No hay miembros en este equipo.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Botones al final de la tarjeta */}
              <div className="botones-tarjeta">
                <button
                  className="btnInscribir"
                  onClick={() => handleMostrarMiembros(e)}
                >
                  {equipoSeleccionado?.id === e.id
                    ? 'Ocultar miembros'
                    : 'Ver miembros'}
                </button>

                {usuario?.id === e.capitan?.id && (
                  <>
                    <button
                      className="btnCrud"
                      onClick={() => handleActualizarEquipo(e.id)}
                    >
                      Actualizar
                    </button>
                    <button
                      className="btnCrud"
                      style={{ background: '#89211c' }}
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
      </div>

      {/* Botón Agregar igual que en torneos */}
      {usuario && (
        <div className="contenedor-botones">
          <button className="btnCrud" onClick={handleCrearEquipo}>
            Agregar
          </button>
        </div>
      )}
    </div>
  );
}
