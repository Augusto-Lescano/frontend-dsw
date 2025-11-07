import { useState, useEffect } from 'react'
//import './Torneos.css'
import { obtenerTorneos } from '../apis/torneoApi.ts';


function Torneos() {
  const [torneos, setTorneos] = useState([]);
  const [error, setError] = useState("");

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
                        <p>Inicio: {new Date(t.fechaInicio).toLocaleDateString()}</p>
                    </div>
                ))
            ):(
                <p>No hay torneos disponibles</p>
            )}
        </div>
    </div>

  );

}

export default Torneos;