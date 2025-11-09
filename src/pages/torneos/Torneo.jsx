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
      const usuarioId = usuario?.data.id ?? null;
      const equipoId = null;

      await inscribirEnTorneo(torneoId,usuarioId,equipoId);

      alert('¡Inscripción exitosa!');
  }catch(err) {
      setError(err.message);
    } finally {
      setInscripcionLoading(null);
    }
  };

  const handleCrearTorneo = () =>{
    navigate('/torneos/crear')
  }

  const handleActualizarTorneo = torneoId =>{
    navigate(`/torneos/actualizar/${torneoId}`)
  }

  /*const hanldeEliminarTorneo = () =>{
    navigate('/torneos/crear')
  }*/

  return (

    <div className='contenedor-torneos'>
        <h1>Lista de Torneos</h1>
        {error && <p className="error">{error}</p>}
        <div className='lista-torneos'>
            {torneos.length > 0 ? (
                torneos.map ((t)=>(
                    <div key={t.id} className="tarjeta-torneo">
                        <h3>{t.nombre}</h3>
                        <p>Juego: {t.juego?.nombre}</p>
                        <p>Tipo: {t.tipoDeTorneo?.nombre}</p>
                        <p>Jugadores: {t.cantJugadores}</p>
                        <p>Cantidad Equipos: {t.cantEquipos}</p>
                        <p>Inicio Torneo: {new Date(t.fechaInicio).toLocaleDateString()}</p>
                        <p>Fin Torneo: {new Date(t.fechaFin).toLocaleDateString()}</p>
                        <p>Apertura Inscripcion: {new Date(t.fechaInicioIns).toLocaleDateString()}</p>
                        <p>Cierre Inscripcion: {new Date(t.fechaFinIns).toLocaleDateString()}</p>
                        <button className={
                          `btnInscribir ${inscripcionLoading === t.id ? 'loading' : ''}`}
                          onClick={() => handleInscripcion(t.id)}
                          disabled={inscripcionLoading === t.id}>
                            {inscripcionLoading === t.id ? 'Inscribiendo...' : 'Inscribirse'}
                        </button>
                        <button className='btnCrud'
                          onClick={handleActualizarTorneo(t.id)}>Actualizar</button>
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