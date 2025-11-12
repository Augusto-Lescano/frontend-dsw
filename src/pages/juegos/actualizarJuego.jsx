import { useState, useEffect } from "react";
import { 
  obtenerJuegoPorId, 
  actualizarJuegoCompleto
} from "../../services/juegoService.js";
import { obtenerTiposDeJuego } from "../../services/tipoDeJuegoService.js";
import { obtenerPlataformas } from "../../services/plataformaService.js";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/useAuth.js";
import './ActualizarJuego.css';

function ActualizarJuego() {
  const [juego, setJuego] = useState({
    nombre: '',
    descripcion: '',
    tipoDeJuego: '',
    plataformas: []
  });
  const [tiposDeJuego, setTiposDeJuego] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const navigate = useNavigate();
  const { id } = useParams();
  const { usuario } = useAuth();

  useEffect(() => {
    if (usuario?.rol !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        
        const [juegoData, tiposData, plataformasData] = await Promise.all([
          obtenerJuegoPorId(id),
          obtenerTiposDeJuego(),
          obtenerPlataformas()
        ]);
        
        setJuego({
          nombre: juegoData.nombre || '',
          descripcion: juegoData.descripcion || '',
          tipoDeJuego: juegoData.tipoDeJuego?.id || '',
          plataformas: juegoData.plataformas?.map(p => p.id) || []
        });
        
        setTiposDeJuego(tiposData || []);
        setPlataformas(plataformasData || []);
        
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError(`Error al cargar los datos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, usuario, navigate]);

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
    setSubmitting(true);

    try {
      console.log('Iniciando actualización...');
      
      // El sanitize del backend maneja los campos undefined
      await actualizarJuegoCompleto(id, juego);
      
      setSuccess("Juego actualizado correctamente");
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/juegos');
      }, 2000);
      
    } catch (err) {
      console.error('Error actualizando juego:', err);
      
      // Mensaje de error más específico
      let mensajeError = 'Error al actualizar el juego';
      
      if (err.response?.data?.message) {
        mensajeError = err.response.data.message;
      } else if (err.message) {
        mensajeError = err.message;
      }
      
      setError(`${mensajeError}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/juegos');
  };

  if (usuario?.rol !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="contenedor-actualizar-juego">
        <div className="cargando">Cargando datos del juego...</div>
      </div>
    );
  }

  return (
    <div className="contenedor-actualizar-juego">
      <h1>Actualizar Juego</h1>
      
      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {success && (
        <div className="success">
          <strong>Éxito:</strong> {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-actualizar-juego">
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Juego:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={juego.nombre}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={juego.descripcion}
            onChange={handleChange}
            required
            rows="4"
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tipoDeJuego">Tipo de Juego:</label>
          <select
            id="tipoDeJuego"
            name="tipoDeJuego"
            value={juego.tipoDeJuego}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">Seleccionar tipo de juego</option>
            {tiposDeJuego.map(tipo => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Plataformas:</label>
          <div className="plataformas-lista">
            {plataformas.map(plataforma => (
              <label key={plataforma.id} className="plataforma-item">
                <input
                  type="checkbox"
                  checked={juego.plataformas?.includes(plataforma.id) || false}
                  onChange={() => handlePlataformaChange(plataforma.id)}
                />
                {plataforma.nombre}
              </label>
            ))}
          </div>
        </div>

        <div className="botones-form">
          <button 
            type="submit" 
            className="btnCrud" 
            disabled={submitting}
          >
            {submitting ? 'Actualizando...' : 'Actualizar Juego'}
          </button>
          <button 
            type="button" 
            className="btnCancelar" 
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ActualizarJuego;