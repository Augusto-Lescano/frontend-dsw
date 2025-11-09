import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearTorneo } from '../../services/torneoService.js';
import './crear.css';
import { obtenerJuegos } from '../../services/juegoService.js';
import { obtenerPlataformas } from '../../services/plataformaService.js';
import { obtenerTipoTorneos } from '../../services/tipoTorneoService.js';

function CrearTorneo() {
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

  const [juegos, setJuegos] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [tipoTorneos, setTipoTorneos] = useState([]);

  const navigate = useNavigate();

  // Traer datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [juegosData, plataformasData, tipoTorneosData] = await Promise.all([
          obtenerJuegos(),
          obtenerPlataformas(),
          obtenerTipoTorneos()
        ]);
        setJuegos(juegosData);
        setPlataformas(plataformasData);
        setTipoTorneos(tipoTorneosData);
      } catch (err) {
        setError("Error cargando datos: " + err.message);
      }
    };

    fetchData();
  }, []);

  const handleEntrada = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEnviar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await crearTorneo(formData);
      alert('Torneo creado exitosamente');
      navigate('/torneos');
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
        {/* Aca van todos los inputs y selects, igual que antes */}
        <div className="form-group">
          <label>Tipo de Torneo:</label>
          <select
            name="tipoDeTorneo"
            value={formData.tipoDeTorneo}
            onChange={handleEntrada}
            required
          >
            <option value="">Seleccione un tipo de torneo</option>
            {tipoTorneos.map(tipo => (
              <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Juego:</label>
          <select
            name="juego"
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
          <label>Plataforma:</label>
          <select
            name="plataforma"
            value={formData.plataforma}
            onChange={handleEntrada}
            required
          >
            <option value="">Seleccione una plataforma</option>
            {plataformas.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
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
