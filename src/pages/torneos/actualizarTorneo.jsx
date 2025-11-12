import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { actualizarTorneo, obtenerUnTorneo } from '../../services/torneoService.js'
import { obtenerJuegos } from "../../services/juegoService.js";
import { obtenerPlataformas } from "../../services/plataformaService.js";
import { obtenerTipoTorneos } from "../../services/tipoTorneoService.js";
import { useAuth } from "../../context/useAuth.js";
import './ActualizarTorneo.css';

function ActualizarTorneo() {
    const [torneo, setTorneo] = useState({
        nombre: '',
        descripcionReglas: '',
        cantJugadoresEquipo: '',
        cantEquipos: '',
        cantJugadores: '',
        fechaInicio: '',
        fechaFin: '',
        fechaInicioIns: '',
        fechaFinIns: '',
        resultado: '',
        region: '',
        estado: '',
        tipoDeTorneo: '',
        juego: '',
        creador: '',
        plataforma: '',
    });

    const [juegos, setJuegos] = useState([]);
    const [plataformas, setPlataformas] = useState([]);
    const [tipoTorneos, setTipoTorneos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    const navigate = useNavigate();
    const { id } = useParams();
    const { usuario } = useAuth();


useEffect(() => {
  if (!usuario) {
    navigate('/');
    return;
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const torneoId = parseInt(id);
      const [torneoData, juegosData, plataformasData, tipoTorneosData] = await Promise.all([
        obtenerUnTorneo(torneoId),
        obtenerJuegos(),
        obtenerPlataformas(),
        obtenerTipoTorneos()
      ]);

      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setTorneo({
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
        tipoDeTorneo: torneoData.tipoDeTorneo || '',
        juego: torneoData.juego?.id || '',
        creador: torneoData.creador?.id || '',
        plataforma: torneoData.plataforma?.id || '',
      });

      setJuegos(juegosData || []);
      setPlataformas(plataformasData || []);
      setTipoTorneos(tipoTorneosData || []);

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
        setTorneo(prev => ({
            ...prev,
            [name]: value
        }));
    };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  setSubmitting(true);

  try {
    const torneoId = parseInt(id);

    // Preparar datos para enviar (solo IDs donde corresponde)
    const torneoParaEnviar = {
      ...torneo,
      tipoDeTorneo: torneo.tipoDeTorneo.id,
      juego: parseInt(torneo.juego),
      plataforma: parseInt(torneo.plataforma),
      creador: parseInt(torneo.creador),
    };

    await actualizarTorneo(torneoId, torneoParaEnviar);

    setSuccess("Torneo actualizado correctamente");

    setTimeout(() => {
      navigate('/torneos');
    }, 2000);

  } catch (err) {
    console.error('Error actualizando torneo:', err);

    let mensajeError = 'Error al actualizar el torneo';
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
        navigate('/torneos');
    };

    if (!usuario) {
        return null;
    }

    if (loading) {
        return (
            <div className="contenedor-actualizar-torneo">
                <div className="cargando">Cargando datos del torneo...</div>
            </div>
        );
    }

return (
    <div className="contenedor-actualizar-torneo">
        <h1>Actualizar Torneo</h1>
        
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

        <form onSubmit={handleSubmit} className="form-actualizar-torneo">
            <div className="form-group">
                <label htmlFor="nombre">Nombre del Torneo:</label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={torneo.nombre}
                    onChange={handleChange}
                    required
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label htmlFor="descripcionReglas">Descripción y Reglas:</label>
                <textarea
                    id="descripcionReglas"
                    name="descripcionReglas"
                    value={torneo.descripcionReglas}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="form-textarea"
                    placeholder="Describe las reglas del torneo..."
                />
            </div>

            {torneo.tipoDeTorneo && !torneo.tipoDeTorneo.esIndividual && (
            <>
                <div className="form-group">
                <label htmlFor="cantJugadoresEquipo">Jugadores por Equipo:</label>
                <input
                    type="number"
                    id="cantJugadoresEquipo"
                    name="cantJugadoresEquipo"
                    value={torneo.cantJugadoresEquipo}
                    onChange={handleChange}
                    required
                    className="form-input"
                    min="1"
                />
                </div>

                <div className="form-group">
                <label htmlFor="cantEquipos">Cantidad de Equipos:</label>
                <input
                    type="number"
                    id="cantEquipos"
                    name="cantEquipos"
                    value={torneo.cantEquipos}
                    onChange={handleChange}
                    required
                    className="form-input"
                    min="1"
                />
                </div>
            </>
            )}

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="cantJugadores">Total de Jugadores:</label>
                    <input
                        type="number"
                        id="cantJugadores"
                        name="cantJugadores"
                        value={torneo.cantJugadores}
                        onChange={handleChange}
                        required
                        className="form-input"
                        min="1"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="fechaInicioIns">Inicio de Inscripciones:</label>
                    <input
                        type="date"
                        id="fechaInicioIns"
                        name="fechaInicioIns"
                        value={torneo.fechaInicioIns}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="fechaFinIns">Fin de Inscripciones:</label>
                    <input
                        type="date"
                        id="fechaFinIns"
                        name="fechaFinIns"
                        value={torneo.fechaFinIns}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="fechaInicio">Inicio del Torneo:</label>
                    <input
                        type="date"
                        id="fechaInicio"
                        name="fechaInicio"
                        value={torneo.fechaInicio}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="fechaFin">Fin del Torneo:</label>
                    <input
                        type="date"
                        id="fechaFin"
                        name="fechaFin"
                        value={torneo.fechaFin}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="region">Región:</label>
                    <input
                        type="text"
                        id="region"
                        name="region"
                        value={torneo.region}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="Ej: América, Europa, Asia..."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="estado">Estado:</label>
                    <select
                        id="estado"
                        name="estado"
                        value={torneo.estado}
                        onChange={handleChange}
                        required
                        className="form-select"
                    >
                        <option value="">Seleccionar estado</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="activo">Activo</option>
                        <option value="finalizado">Finalizado</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="resultado">Resultado:</label>
                <input
                    type="text"
                    id="resultado"
                    name="resultado"
                    value={torneo.resultado}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Resultado del torneo (opcional)"
                />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tipoDeTorneo">Tipo de Torneo:</label>
                  <select
                    id="tipoDeTorneo"
                    name="tipoDeTorneo"
                    value={torneo.tipoDeTorneo?.id || ''}
                    onChange={(e) => {
                    const selected = tipoTorneos.find(t => t.id === parseInt(e.target.value));
                    setTorneo(prev => ({
                    ...prev,
                    tipoDeTorneo: selected || ''
                  }));
                }}
                required
                className="form-select"
                >
                  <option value="">Seleccionar tipo de torneo</option>
                  {tipoTorneos.map(tipoTorneo => (
                  <option key={tipoTorneo.id} value={tipoTorneo.id}>
                  {tipoTorneo.nombre}
                </option>
              ))}
                </select>
            </div>

                <div className="form-group">
                    <label htmlFor="juego">Juego:</label>
                    <select
                        id="juego"
                        name="juego"
                        value={torneo.juego}
                        onChange={handleChange}
                        required
                        className="form-select"
                    >
                        <option value="">Seleccionar juego</option>
                        {juegos.map(juego => (
                            <option key={juego.id} value={juego.id}>
                                {juego.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="plataforma">Plataforma:</label>
                    <select
                        id="plataforma"
                        name="plataforma"
                        value={torneo.plataforma}
                        onChange={handleChange}
                        required
                        className="form-select"
                    >
                        <option value="">Seleccionar plataforma</option>
                        {plataformas.map(plataforma => (
                            <option key={plataforma.id} value={plataforma.id}>
                                {plataforma.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="creador">ID del Creador:</label>
                <input
                    type="number"
                    id="creador"
                    name="creador"
                    value={torneo.creador}
                    onChange={handleChange}
                    required
                    className="form-input"
                    min="1"
                />
            </div>

            <div className="botones-form">
                <button 
                    type="submit" 
                    className="btnCrud" 
                    disabled={submitting}
                >
                    {submitting ? 'Actualizando...' : 'Actualizar Torneo'}
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

export default ActualizarTorneo;