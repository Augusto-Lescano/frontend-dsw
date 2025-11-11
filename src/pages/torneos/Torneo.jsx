import { useState, useEffect } from 'react'
import { obtenerTorneos, inscribirEnTorneo } from '../../services/torneoService.js';
import './Torneo.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth.js';

function Torneos() {
  const [torneos, setTorneos] = useState([]);
  const [error, setError] = useState("");
  const [inscripcionLoading, setInscripcionLoading] = useState(null);
  const navigate = useNavigate();
  const { usuario } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerTorneos();
        setTorneos(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  const handleInscripcion = async (torneoId) => {
    setInscripcionLoading(torneoId);
    setError("");

    try{
      const usuarioId = usuario?.id ?? usuario?.data?.id ?? null;
      if(!usuarioId) {
        setError('Usuario no identificado');
        setInscripcionLoading(null);
        return;
      }
      let inscripcionData;

      if (torneoId.tipoDeTorneo?.esIndividual) {
        inscripcionData = { usuarioId };
      } else {
        const equipoSeleccionadoId = prompt("Ingrese el ID de su equipo para inscribirse:");
        if (!equipoSeleccionadoId){
          alert('Debes ingresar un equipo para inscribirte en este torneo');
          setInscripcionLoading(null);
          return;
        }
        inscripcionData = { equipoId: Number(equipoSeleccionadoId) }
      }

      const res = await inscribirEnTorneo(torneoId,inscripcionData);
      console.log('Respuesta inscribirEnTorneo ->', res);
      alert('¡Inscripción exitosa!');
    } catch(err) {
      setError(err.message);
    } finally {
      setInscripcionLoading(null);
    }
  };

  const handleCrearTorneo = () => {
    navigate('/torneos/crear')
  }

  const handleActualizarTorneo = (torneoId) => {
    navigate(`/torneos/actualizar/${torneoId}`)
  }

  return (
    <div className='contenedor-torneos'>
        <h1>Lista de Torneos</h1>
        {error && <p className="error">{error}</p>}
        <div className='lista-torneos'>
            {torneos.length > 0 ? (
                torneos.map ((t)=>(
                    <div key={t.id} className="tarjeta-torneo">
                        <div className="contenido-tarjeta">
                            <h3>{t.nombre}</h3>
                            <p>Juego: {t.juego?.nombre}</p>
                            <p>Tipo: {t.tipoDeTorneo?.nombre}</p>
                            
                            {t.tipoDeTorneo?.esIndividual ? (
                                <p>Jugadores Individuales: {t.cantJugadores}</p>
                            ) : (
                                <>
                                    <p>Jugadores por Equipo: {t.cantJugadoresEquipo}</p>
                                    <p>Cantidad de Equipos: {t.cantEquipos}</p>
                                    <p>Jugadores Totales: {t.cantJugadores}</p>
                                </>
                            )}
                            
                            <p>Inicio Torneo: {new Date(t.fechaInicio).toLocaleDateString()}</p>
                            <p>Fin Torneo: {new Date(t.fechaFin).toLocaleDateString()}</p>
                            <p>Apertura Inscripcion: {new Date(t.fechaInicioIns).toLocaleDateString()}</p>
                            <p>Cierre Inscripcion: {new Date(t.fechaFinIns).toLocaleDateString()}</p>
                            
                            <div className={`tipo-indicador ${t.tipoDeTorneo?.esIndividual ? 'individual' : 'por-equipos'}`}>
                                {t.tipoDeTorneo?.esIndividual ? 'Torneo Individual' : 'Torneo por Equipos'}
                            </div>
                        </div>
                        
                        <div className="botones-tarjeta">
                          {(usuario?.rol === 'admin' || usuario?.rol === 'user') && Date.now() >= new Date(t.fechaInicioIns) && Date.now() <= new Date(t.fechaFinIns) && (
                            <button 
                              className={`btnInscribir ${inscripcionLoading === t.id ? 'loading' : ''}`}
                              onClick={() => handleInscripcion(t)}
                              disabled={inscripcionLoading === t.id}>
                              {inscripcionLoading === t.id ? 'Inscribiendo...' : 'Inscribirse'}
                            </button>
                          )}
                            
                            {usuario?.rol === 'admin' && (
                              <button 
                                className='btnCrud'
                                onClick={() => handleActualizarTorneo(t.id)}>
                                Actualizar
                              </button>
                            )}
                        </div>
                    </div>
                ))
            ):(
                <p>No hay torneos disponibles</p>
            )}
        </div>
        
        {/* Botón solo para admins */}
        {usuario?.rol === 'admin' && (
            <div className='contenedor-botones'>
                <button className='btnCrud' onClick={handleCrearTorneo}>Agregar</button>
            </div>
        )}
    </div>
);
}

export default Torneos;