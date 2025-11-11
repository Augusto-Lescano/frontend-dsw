import { useState, useEffect } from "react";
import { 
  obtenerJuegos, 
  eliminarJuego, 
  obtenerTorneosActivosPorJuego,
  obtenerTorneosFinalizadosPorJuego 
} from "../../services/juegoService.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth.js";
import './Juegos.css';

function Juegos() {
  const [juegos, setJuegos] = useState([]);
  const [juegosConTorneos, setJuegosConTorneos] = useState({}); // Objeto para almacenar torneos por juego
  const [loading, setLoading] = useState({}); // Loading por juego individual
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { usuario } = useAuth();

  useEffect(() => {
    if (usuario?.rol !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const data = await obtenerJuegos();
        setJuegos(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, [usuario, navigate]);

  const toggleTorneosDeJuego = async (juegoId) => {
    // Si ya está mostrando torneos, los oculta
    if (juegosConTorneos[juegoId]) {
      setJuegosConTorneos(prev => {
        const nuevoEstado = { ...prev };
        delete nuevoEstado[juegoId];
        return nuevoEstado;
      });
      return;
    }

    // Si no está mostrando torneos, los carga
    setLoading(prev => ({ ...prev, [juegoId]: true }));
    try {
      const [activos, finalizados] = await Promise.all([
        obtenerTorneosActivosPorJuego(juegoId),
        obtenerTorneosFinalizadosPorJuego(juegoId)
      ]);
      
      setJuegosConTorneos(prev => ({
        ...prev,
        [juegoId]: {
          activos,
          finalizados
        }
      }));
    } catch (err) {
      setError(`Error al cargar torneos del juego: ${err.message}`);
    } finally {
      setLoading(prev => {
        const nuevoLoading = { ...prev };
        delete nuevoLoading[juegoId];
        return nuevoLoading;
      });
    }
  };

  const handleAgregarJuego = () => {
    navigate('/juegos/crear');
  };

  const handleActualizarJuego = (juegoId) => {
    navigate(`/juegos/actualizar/${juegoId}`);
  };

  const handleEliminarJuego = async (juegoId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este juego?')) {
      try {
        await eliminarJuego(juegoId);
        setJuegos(prev => prev.filter(j => j.id !== juegoId));
        // Limpiar torneos del juego eliminado
        setJuegosConTorneos(prev => {
          const nuevoEstado = { ...prev };
          delete nuevoEstado[juegoId];
          return nuevoEstado;
        });
        alert('Juego eliminado correctamente');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (usuario?.rol !== 'admin') {
    return null;
  }

 return (
    <div className="contenedor-juegos">
      <h1>Gestión de Juegos</h1>
      {error && <p className="error">{error}</p>}
      
      <div className="lista-juegos">
        {juegos.length > 0 ? (
          juegos.map((j) => (
            <div key={j.id} className="tarjeta-juego">
              <div className="contenido-tarjeta">
                <h3>{j.nombre}</h3>
                <p><strong>Descripción:</strong> {j.descripcion}</p>
                <p><strong>Tipo:</strong> {j.tipoDeJuego?.nombre || 'No especificado'}</p>
                <p><strong>Plataformas:</strong> {j.plataformas?.map(p => p.nombre).join(', ') || 'No especificado'}</p>
                
                {/* Botón para ver/ocultar torneos */}
                <button 
                  className="btnVerTorneos"
                  onClick={() => toggleTorneosDeJuego(j.id)}
                  disabled={loading[j.id]}
                >
                  {loading[j.id] 
                    ? 'Cargando...' 
                    : juegosConTorneos[j.id] 
                      ? 'Ocultar Torneos' 
                      : 'Ver Torneos'
                  }
                </button>

                {/* Mostrar torneos si este juego está expandido */}
                {juegosConTorneos[j.id] && (
                  <div className="torneos-info">
                    <div className="torneos-activos">
                      <h4>Torneos Activos: {juegosConTorneos[j.id].activos.length}</h4>
                      {juegosConTorneos[j.id].activos.length > 0 ? (
                        <ul>
                          {juegosConTorneos[j.id].activos.map(torneo => (
                            <li key={torneo.id}>
                              <strong>{torneo.nombre}</strong> - {torneo.plataforma?.nombre} 
                              (Hasta: {new Date(torneo.fechaFin).toLocaleDateString()})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No hay torneos activos</p>
                      )}
                    </div>
                    
                    <div className="torneos-finalizados">
                      <h4>Torneos Finalizados: {juegosConTorneos[j.id].finalizados.length}</h4>
                      {juegosConTorneos[j.id].finalizados.length > 0 ? (
                        <ul>
                          {juegosConTorneos[j.id].finalizados.slice(0, 3).map(torneo => (
                            <li key={torneo.id}>
                              <strong>{torneo.nombre}</strong> - {torneo.plataforma?.nombre}
                              {torneo.resultado && ` - Resultado: ${torneo.resultado}`}
                            </li>
                          ))}
                          {juegosConTorneos[j.id].finalizados.length > 3 && (
                            <p>... y {juegosConTorneos[j.id].finalizados.length - 3} más</p>
                          )}
                        </ul>
                      ) : (
                        <p>No hay torneos finalizados</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Botones de acción para cada juego */}
              <div className="botones-tarjeta">
                <button 
                  className="btnCrud"
                  onClick={() => handleActualizarJuego(j.id)}
                >
                  Actualizar
                </button>
                <button 
                  className="btnEliminar"
                  onClick={() => handleEliminarJuego(j.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay juegos disponibles.</p>
        )}
        
        {/* Tarjeta para Agregar Juego - SIEMPRE al final */}
        {usuario?.rol === 'admin' && (
          <div className="tarjeta-agregar" onClick={handleAgregarJuego}>
            <button className="btnAgregarTarjeta">
              <div className="icono-agregar">+</div>
              <div className="texto-agregar">Agregar Juego</div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Juegos;