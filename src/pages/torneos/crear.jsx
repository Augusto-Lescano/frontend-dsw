import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearTorneo } from '../../apis/torneoApi.ts';
import './crear.css';
import { useEffect } from 'react';
import { obtenerJuegos } from '../../apis/juegoApi.ts';
import { obtenerPlataformas } from '../../apis/plataformaApi.ts';
import { obtenerTipoTorneos } from '../../apis/tipoTorneoApi.ts';

function CrearTorneo(){

    const [formData, setFormData] = useState({
        nombre: '',
        descripcionReglas: '',
        cantJugadoresEquipo: '',
        cantEquipos: '',
        cantJugadores: '',
        fechaInicio:'',
        fechaFin:'',
        fechaInicioIns:'',
        fechaFinIns:'',
        resultado:'',
        region:'',
        estado:'',
        tipoDeTorneo:'',
        juego:'',
        creador:'',
        plataforma:'',

    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [juegos, setJuegos] = useState([]);
    const [plataformas, setPlataformas] = useState([]);
    const [tipoTorneos, settipoTorneos] = useState([]);

    const handleEntrada = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleEnviar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    useEffect(()=>{
      const fetchData = async () => {
        try{
          const [juegosData,plataformasData, tipoTorneosData] = await Promise.all([
            obtenerJuegos(),
            obtenerPlataformas(),
            obtenerTipoTorneos()
          ]);
          setJuegos(juegosData)
          setPlataformas(plataformasData)
          settipoTorneos(tipoTorneosData)
        }catch (err){
          setError("Error cargando datos: " + err.message);
        }
      };
      fetchData();
    },[]);


    try {
        await crearTorneo(formData);
        alert('Torneo creado exitosamente');
        navigate('/torneos'); // Volver a la lista
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    };

  const handleCancelar = () => {
    navigate('/torneos');
  };

  return (
    <div className="contenedor-torneos">
      <div className="header-torneos">
        <h1>Crear Nuevo Torneo</h1>
      </div>

      {error && <p className="error">{error}</p>}

      <form className="form-torneo" onSubmit={handleEnviar}>
        <div className="form-group">
          <label>Nombre del Torneo:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleEntrada}
            required
          />
        </div>

        <div className="form-group">
          <label>Descripcion Reglas:</label>
          <input
            type="string"
            name="descripcionReglas"
            value={formData.descripcionReglas}
            onChange={handleEntrada}
            required
          />
        </div>

        <div className="form-group">
          <label>Cantidad jugadores por equipo:</label>
          <input
            type="number"
            name="cantJugadoresEquipo"
            value={formData.cantJugadoresEquipo}
            onChange={handleEntrada}
            required
          />
        </div>

        <div className="form-group">
          <label>Cantidad equipos:</label>
          <input
            type="number"
            name="cantEquipos"
            value={formData.cantEquipos}
            onChange={handleEntrada}
            required
          />
        </div>

        <div className="form-group">
          <label>Cantidad Jugadores:</label>
          <input
            type="number"
            name="cantJugadores"
            value={formData.cantJugadores}
            onChange={handleEntrada}
            required
          />
        </div>

        <div className="form-group">
          <label>Fecha de Inicio de Torneo:</label>
          <input
            type="date"
            name="fechaInicio"
            value={formData.fechaInicio}
            onChange={handleEntrada}
            required
          />
        </div>

        <div className="form-group">
          <label>Fecha de Fin de Torneo::</label>
          <input
            type="date"
            name="fechaFin"
            value={formData.fechaFin}
            onChange={handleEntrada}
            required
          />
        </div>

        <div className="form-group">
          <label>Fecha de Inicio Inscripciones:</label>
          <input
            type="date"
            name="fechaInicioIns"
            value={formData.fechaInicioIns}
            onChange={handleEntrada}
            required
          />
        </div>

        <div className="form-group">
          <label>Fecha de Fin Inscripciones:</label>
          <input
            type="date"
            name="fechaFinIns"
            value={formData.fechaFinIns}
            onChange={handleEntrada}
            required
          />
        </div>

        <div className="form-group">
          <label>Resultado:</label>
          <input
            type="string"
            name="resultado"
            value={formData.resultado}
            onChange={handleEntrada}
            required
          />
        </div>

        <div className="form-group">
          <label>Region:</label>
          <input
            type="string"
            name="region"
            value={formData.region}
            onChange={handleEntrada}
            required
          />
        </div>

        <div className="form-group">
          <label>Estado:</label>
          <input
            type="string"
            name="estado"
            value={formData.estado}
            onChange={handleEntrada}
            required
          />
        </div>

        <div className="form-group">
          <label>Tipo de Torneo:</label>
          <select
            name="tipoTorneoId"
            value={formData.tipoTorneo}
            onChange={handleEntrada}
            required
          >
            <option value="">Seleccione un tipo de torneo</option>
            {juegos.map(tipoTorneo => (
              <option key={tipoTorneo.id} value={tipoTorneo.id}>{tipoTorneo.nombre}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Juego:</label>
          <select
            name="juegoId"
            value={formData.juego}
            onChange={handleEntrada}
            required
          >
            <option value="">Seleccione un juego</option>
            {juegos.map(juego => (
              <option key={juego.id} value={juego.id}>{juego.nombre}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>ID del Creador:</label>
          <input
            type="number"
            name="creador"
            value={formData.creador}
            onChange={handleEntrada}
            required
          />
        </div>

        <div className="form-group">
          <label>Plataforma:</label>
          <select
            name="plataformaId"
            value={formData.plataforma}
            onChange={handleEntrada}
            required
          >
            <option value="">Seleccione una plataforma</option>
            {plataformas.map(plataforma => (
              <option key={plataforma.id} value={plataforma.id}>{plataforma.nombre}</option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-guardar" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Torneo'}
          </button>
          <button type="button" className="btn-cancelar" onClick={handleCancelar}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );


}

export default CrearTorneo;