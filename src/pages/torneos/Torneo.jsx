import { useState, useEffect } from 'react';
import { obtenerTorneos, eliminarTorneo } from '../../services/torneoService.js';
import { inscribirUsuarioIndividual, inscribirEquipo, verificarInscripcion } from '../../services/inscripcionService.js';
import { useAuth } from '../../context/useAuth.js';
import { useNavigate } from 'react-router-dom';
import ModalEquipos from './modalEquipos.jsx';
import './Torneo.css';
import { useCallback } from 'react';

function Torneos() {
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inscripcionLoading, setInscripcionLoading] = useState(null);
  const [mostrarModalEquipos, setMostrarModalEquipos] = useState(false);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
  const [estadosInscripcion, setEstadosInscripcion] = useState({});

  const navigate = useNavigate();
  const { usuario } = useAuth();

  const puedeInscribirse = useCallback((torneo) => {
    if (!usuario) return false;
    
    const ahora = new Date();
    const inicioIns = new Date(torneo.fechaInicioIns);
    const finIns = new Date(torneo.fechaFinIns);
    
    return ahora >= inicioIns && ahora <= finIns && torneo.estado === 'Pendiente';
  }, [usuario]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await obtenerTorneos();
        setTorneos(data);
        
        if (usuario) {
          const estados = {};
          for (const torneo of data) {
            if (puedeInscribirse(torneo)) {
              try {
                const respuesta = await verificarInscripcion(torneo.id, usuario.id);
                estados[torneo.id] = respuesta.estaInscrito;
              } catch (err) {
                console.error('Error verificando inscripción:', err);
                estados[torneo.id] = false;
              }
            } else {
              estados[torneo.id] = false;
            }
          }
          setEstadosInscripcion(estados);
        }
      } catch (err) {
        setError(err.message || 'Error al cargar torneos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [usuario, puedeInscribirse]);


  const handleInscripcionIndividual = async (torneo) => {
    if (!usuario) {
      setError('Debes iniciar sesión para inscribirte');
      return;
    }

    setInscripcionLoading(torneo.id);
    setError("");

    try {
      await inscribirUsuarioIndividual(torneo.id, usuario.id);
      setEstadosInscripcion(prev => ({
        ...prev,
        [torneo.id]: true
      }));
      alert('¡Inscripción individual exitosa!');
    } catch (err) {
      setError(err.message || 'Error al inscribirse');
    } finally {
      setInscripcionLoading(null);
    }
  };

  const handleInscripcionEquipo = async (torneo) => {
    if (!usuario) {
      setError('Debes iniciar sesión para inscribirte');
      return;
    }

    setTorneoSeleccionado(torneo);
    setMostrarModalEquipos(true);
  };

  const handleSeleccionarEquipo = async (equipoId) => {
    if (!torneoSeleccionado) return;

    setInscripcionLoading(torneoSeleccionado.id);
    setError("");

    try {
      await inscribirEquipo(torneoSeleccionado.id, equipoId);
      setEstadosInscripcion(prev => ({
        ...prev,
        [torneoSeleccionado.id]: true
      }));
      setMostrarModalEquipos(false);
      setTorneoSeleccionado(null);
      alert('¡Equipo inscrito exitosamente!');
    } catch (err) {
      setError(err.message || 'Error al inscribir equipo');
    } finally {
      setInscripcionLoading(null);
    }
  };

  const handleInscripcion = (torneo) => {
    if (!usuario) {
      setError('Debes iniciar sesión para inscribirte');
      navigate('/login');
      return;
    }

    if (torneo.tipoDeTorneo?.esIndividual) {
      handleInscripcionIndividual(torneo);
    } else {
      handleInscripcionEquipo(torneo);
    }
  };

  const getTextoBotonInscripcion = (torneo) => {
    if (estadosInscripcion[torneo.id]) {
      return 'Ya Inscrito';
    }
    if (inscripcionLoading === torneo.id) {
      return 'Inscribiendo...';
    }
    return 'Inscribirse';
  };

  const handleActualizarTorneo = (torneoId) => {
    navigate(`/torneos/actualizar/${torneoId}`);
  };

  const handleCrearTorneo = () => {
    navigate('/torneos/crear');
  };

  const handleEliminarTorneo = async (torneoId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este torneo?')) {
      return;
    }

    try {
      await eliminarTorneo(torneoId);
      setTorneos(prev => prev.filter(t => t.id !== torneoId));
      alert('Torneo eliminado exitosamente');
    } catch (err) {
      setError(err.message || 'Error al eliminar torneo');
    }
  };

  const esDueñoDelTorneo = (torneo) => {
    return usuario && torneo.creador?.id === usuario.id;
  };

  if (loading) {
    return (
      <div className='contenedor-torneos'>
        <h1>Lista de Torneos</h1>
        <p>Cargando torneos...</p>
      </div>
    );
  }

  return (
    <div className='contenedor-torneos'>
      <h1>Lista de Torneos</h1>
      {error && <div className="error">{error}</div>}
      
      <div className='lista-torneos'>
        {torneos.map((t) => (
          <div key={t.id} className="tarjeta-torneo">
            <div className="contenido-tarjeta">
              <h3>{t.nombre}</h3>
              <p><strong>Descripción y Reglas:</strong> {t.descripcionReglas || 'No especificado'}</p>
              <p><strong>Resultado:</strong> {t.resultado || 'Sin resultado aún'}</p>
              <p><strong>Juego:</strong> {t.juego?.nombre || 'No especificado'}</p>
              <p><strong>Tipo:</strong> {t.tipoDeTorneo?.nombre || 'No especificado'}</p>
              <p><strong>Estado:</strong> {t.estado}</p>
              <p><strong>Estado Inscripción:</strong> {t.estadoInscripcion || 'No disponible'}</p>
              
              {t.tipoDeTorneo?.esIndividual ? (
                <p><strong>Jugadores Individuales:</strong> {t.cantJugadores}</p>
              ) : (
                <>
                  <p><strong>Jugadores por Equipo:</strong> {t.cantJugadoresEquipo}</p>
                  <p><strong>Cantidad de Equipos:</strong> {t.cantEquipos}</p>
                </>
              )}
              
              <p><strong>Inicio Inscripciones:</strong> {new Date(t.fechaInicioIns).toLocaleDateString()}</p>
              <p><strong>Fin Inscripciones:</strong> {new Date(t.fechaFinIns).toLocaleDateString()}</p>
              <p><strong>Inicio Torneo:</strong> {new Date(t.fechaInicio).toLocaleDateString()}</p>

              {estadosInscripcion[t.id] && (
                <div className="inscripcion-confirmada">
                  Ya estás inscrito en este torneo
                </div>
              )}
            </div>
            
            <div className="botones-tarjeta">
              {puedeInscribirse(t) && !estadosInscripcion[t.id] && (
                <button 
                  className={`btnInscribir ${inscripcionLoading === t.id ? 'loading' : ''}`}
                  onClick={() => handleInscripcion(t)}
                  disabled={inscripcionLoading === t.id}
                >
                  {getTextoBotonInscripcion(t)}
                </button>
              )}
              
              {esDueñoDelTorneo(t) && (
                <>
                  <button 
                    className='btnActualizar'
                    onClick={() => handleActualizarTorneo(t.id)}
                  >
                    Actualizar
                  </button>
                  <button 
                    className='btnEliminar'
                    onClick={() => handleEliminarTorneo(t.id)}
                  >
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        
        {/* Tarjeta para Agregar Torneo (solo admin) */}
        {usuario?.rol === 'admin' && (
          <div className="tarjeta-agregar" onClick={handleCrearTorneo}>
            <button className="btnAgregarTarjeta">
              <span className="icono-agregar">+</span>
              <span className="texto-agregar">Agregar Torneo</span>
            </button>
          </div>
        )}
      </div>

      {mostrarModalEquipos && (
        <ModalEquipos
          torneo={torneoSeleccionado}
          onSeleccionarEquipo={handleSeleccionarEquipo}
          onCancelar={() => {
            setMostrarModalEquipos(false);
            setTorneoSeleccionado(null);
          }}
        />
      )}
    </div>
  );
}

export default Torneos;