import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { actualizarTorneo, obtenerUnTorneo } from '../../apis/torneoApi.ts';
import './crear.css';
import { useEffect } from 'react';
import { obtenerJuegos } from '../../apis/juegoApi.ts';
import { obtenerPlataformas } from '../../apis/plataformaApi.ts';
import { obtenerTipoTorneos } from '../../apis/tipoTorneoApi.ts';

function ActualizarTorneo(){

    const {id} = useParams();
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


     useEffect(()=>{
      const fetchData = async () => {
        try{
            setCargandoDatos(true);
            setError("");
            const torneoId = parseInt(id);
            const [torneoData,juegosData,plataformasData, tipoTorneosData] = await Promise.all([
            obtenerJuegos(),
            obtenerPlataformas(),
            obtenerTipoTorneos(),
            obtenerUnTorneo(torneoId)
          ]);

          const formatDateForInput = (dateString) => {
                    if (!dateString) return '';
                    const date = new Date(dateString);
                    return date.toISOString().split('T')[0];
                };

            setFormData({
                    nombre: torneoData.nombre || '',
                    descripcionReglas: torneoData.descripcionReglas || '',
                    cantJugadoresEquipo: torneoData.cantJugadoresEquipo || '',
                    cantEquipos: torneoData.cantEquipos || '',
                    cantJugadores: torneoData.cantJugadores || '',
                    fechaInicio: formatDateForInput(torneoData.fechaInicio),
                    fechaFin: formatDateForInput(torneoData.fechaFin),
                    fechaInicioIns: formatDateForInput(torneoData.fechaInicioIns),
                    fechaFinIns: formatDateForInput(torneoData.fechaFinIns),
                    resultado: torneoData.resultado || '',
                    region: torneoData.region || '',
                    estado: torneoData.estado || '',
                    tipoDeTorneoId: torneoData.tipoDeTorneo?.id || torneoData.tipoDeTorneoId || '',
                    juegoId: torneoData.juego?.id || torneoData.juegoId || '',
                    creador: torneoData.creador || '',
                    plataformaId: torneoData.plataforma?.id || torneoData.plataformaId || '',
                });
            
          setJuegos(juegosData)
          setPlataformas(plataformasData)
          settipoTorneos(tipoTorneosData)
        }catch (err){
          setError("Error cargando datos: " + err.message);
        }
      };
      fetchData();
    },[id]);

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

        try{
            const torneoId = parseInt(id);
            await actualizarTorneo(torneoId, formData);
            alert('Torneo actualizado exitosamente');
            navigate('/torneos');
        }catch (err){
            setError(err.message);
        }
    }

    const handleCancelar = () => {
    navigate('/torneos');
  };

  if (setCargandoDatos){
    return (
            <div className="contenedor-torneos">
                <div className="header-torneos">
                    <h1>Cargando torneo...</h1>
                </div>
            </div>
        );
    }
return (
    <div className="contenedor-torneos">
      <div className="header-torneos">
        <h1>Actualizar Torneo</h1>
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
            value={formData.tipoDeTorneo}
            onChange={handleEntrada}
            required
          >
            <option value="">Seleccione un tipo de torneo</option>
            {tipoTorneos.map(tipoTorneo => (
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
export default ActualizarTorneo;