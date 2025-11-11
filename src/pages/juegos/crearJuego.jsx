import { useState, useEffect } from "react";
import { crearJuego } from "../../services/juegoService.js";
import { obtenerTiposDeJuego } from "../../services/tipoDeJuegoService.js";
import { obtenerPlataformas } from "../../services/plataformaService.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth.js";
import './CrearJuego.css';

function CrearJuego() {
  const [juego, setJuego] = useState({
    nombre: '',
    descripcion: '',
    tipoDeJuego: '',
    plataformas: []
  });
  const [tiposDeJuego, setTiposDeJuego] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true); // Para la carga inicial
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const navigate = useNavigate();
  const { usuario } = useAuth();

  useEffect(() => {
    if (usuario?.rol !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoadingData(true);
        setError("");
        
        const [tiposData, plataformasData] = await Promise.all([
          obtenerTiposDeJuego(),
          obtenerPlataformas()
        ]);
        
        console.log('Tipos cargados:', tiposData);
        console.log('Plataformas cargadas:', plataformasData);
        
        setTiposDeJuego(tiposData || []);
        setPlataformas(plataformasData || []);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError(`Error al cargar datos: ${err.message}`);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [usuario, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJuego(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlataformaChange = (plataformaId) => {
    setJuego(prev => {
      const plataformasActuales = prev.plataformas || [];
      const nuevasPlataformas = plataformasActuales.includes(plataformaId)
        ? plataformasActuales.filter(id => id !== plataformaId)
        : [...plataformasActuales, plataformaId];
      
      return {
        ...prev,
        plataformas: nuevasPlataformas
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validaciones básicas
    if (!juego.nombre.trim()) {
      setError("El nombre del juego es requerido");
      setLoading(false);
      return;
    }

    if (!juego.descripcion.trim()) {
      setError("La descripción del juego es requerida");
      setLoading(false);
      return;
    }

    if (!juego.tipoDeJuego) {
      setError("Debe seleccionar un tipo de juego");
      setLoading(false);
      return;
    }

    if (juego.plataformas.length === 0) {
      setError("Debe seleccionar al menos una plataforma");
      setLoading(false);
      return;
    }

    try {
      await crearJuego(juego);
      setSuccess("Juego creado correctamente");
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/juegos');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/juegos');
  };

  if (usuario?.rol !== 'admin') {
    return null;
  }

  if (loadingData) {
    return (
      <div className="contenedor-crear-juego">
        <div className="cargando">Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className="contenedor-crear-juego">
      <h1>Agregar Nuevo Juego</h1>
      
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit} className="form-crear-juego">
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Juego</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={juego.nombre}
            onChange={handleChange}
            placeholder="Ingrese el nombre del juego"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={juego.descripcion}
            onChange={handleChange}
            placeholder="Describa el juego..."
            required
            rows="4"
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tipoDeJuego">Tipo de Juego</label>
          <select
            id="tipoDeJuego"
            name="tipoDeJuego"
            value={juego.tipoDeJuego}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">Seleccionar tipo de juego</option>
            {tiposDeJuego.length > 0 ? (
              tiposDeJuego.map(tipo => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))
            ) : (
              <option value="" disabled>No hay tipos disponibles</option>
            )}
          </select>
          {tiposDeJuego.length === 0 && !loadingData && (
            <p className="advertencia">No hay tipos de juego disponibles</p>
          )}
        </div>

        <div className="form-group">
          <label>Plataformas</label>
          <div className="plataformas-lista">
            {plataformas.length > 0 ? (
              plataformas.map(plataforma => (
                <label key={plataforma.id} className="plataforma-item">
                  <input
                    type="checkbox"
                    checked={juego.plataformas?.includes(plataforma.id) || false}
                    onChange={() => handlePlataformaChange(plataforma.id)}
                  />
                  <span className="plataforma-nombre">{plataforma.nombre}</span>
                </label>
              ))
            ) : (
              <p className="advertencia">No hay plataformas disponibles</p>
            )}
          </div>
          {juego.plataformas.length === 0 && plataformas.length > 0 && (
            <p className="advertencia">Seleccione al menos una plataforma</p>
          )}
        </div>

        <div className="botones-form">
          <button 
            type="submit" 
            className="btnCrear"
            disabled={loading || tiposDeJuego.length === 0 || plataformas.length === 0}
          >
            {loading ? 'Creando...' : 'Crear Juego'}
          </button>
          <button 
            type="button" 
            className="btnCancelar" 
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CrearJuego;