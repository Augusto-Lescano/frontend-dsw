import { useState, useEffect } from 'react';
import { obtenerEquiposDelUsuario } from '../../services/inscripcionService.js';
import { useAuth } from '../../context/useAuth.js';
import './ModalEquipos.css';

function ModalEquipos({ torneo, onSeleccionarEquipo, onCancelar }) {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

  const { usuario } = useAuth();

  useEffect(() => {
    const cargarEquipos = async () => {
      try {
        setLoading(true);
        if (!usuario) {
          setError('Usuario no autenticado');
          return;
        }
        
        const equiposData = await obtenerEquiposDelUsuario();
        setEquipos(equiposData);
      } catch (err) {
        setError(`Error al cargar los equipos: ${err.message || 'Error desconocido'}`);
        console.error('Error cargando equipos:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarEquipos();
  }, [usuario]);

  const handleConfirmar = () => {
    if (equipoSeleccionado) {
      onSeleccionarEquipo(equipoSeleccionado);
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-equipos">
          <h3>Seleccionar Equipo</h3>
          <p>Cargando equipos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-equipos">
        <h3>Seleccionar Equipo para {torneo.nombre}</h3>
        
        {error && <p className="error">{error}</p>}
        
        {equipos.length === 0 ? (
          <div className="sin-equipos">
            <p>No tienes equipos creados</p>
            <p>Para inscribirte en este torneo necesitas crear un equipo primero</p>
          </div>
        ) : (
          <div className="lista-equipos">
            {equipos.map(equipo => (
              <div 
                key={equipo.id}
                className={`equipo-item ${equipoSeleccionado === equipo.id ? 'seleccionado' : ''}`}
                onClick={() => setEquipoSeleccionado(equipo.id)}
              >
                <div className="equipo-info">
                  <h4>{equipo.nombre}</h4>
                  <p>{equipo.descripcion || 'Sin descripción'}</p>
                  <p><strong>Capitan:</strong> {equipo.capitan?.nombre || 'No asignado'}</p>
                  <p><strong>Jugadores:</strong> {equipo.jugadores?.length + 1 || 1}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button 
            className="btnCancelar" 
            onClick={onCancelar}
          >
            Cancelar
          </button>
          {equipos.length > 0 && (
            <button 
              className="btnConfirmar" 
              onClick={handleConfirmar}
              disabled={!equipoSeleccionado}
            >
              Inscribir Equipo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalEquipos;