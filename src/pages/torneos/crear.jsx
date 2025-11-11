import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth.js';
import { crearTorneo } from '../../services/torneoService.js';
import './crear.css';
import { obtenerJuegos } from '../../services/juegoService.js';
import { obtenerPlataformas } from '../../services/plataformaService.js';
import { obtenerTipoTorneos } from '../../services/tipoTorneoService.js';

function CrearTorneo() {
  const { usuario } = useAuth(); // Obtener usuario autenticado (admin)
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcionReglas: '',
    cantJugadoresEquipo: '',
    cantEquipos: '',
    cantJugadores: '',
    fechaInicio: '',
    fechaFin: '',
    fechaInicioIns: '',
    fechaFinIns: '',
    resultado: 'pendiente',
    region: '',
    estado: 'pendiente',
    tipoDeTorneo: '',
    juego: '',
    creador: usuario?.id || '', // Inicializar con el ID del usuario (admin)
    plataforma: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [juegos, setJuegos] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [tipoTorneos, setTipoTorneos] = useState([]);
  // Estado para controlar visibilidad
  const [tipoTorneoSeleccionado, setTipoTorneoSeleccionado] = useState(false);

  // Efecto para actualizar el creador cuando el usuario esté disponible
  useEffect(() => {
    if (usuario?.id) {
      setFormData(prev => ({
        ...prev,
        creador: usuario.id
      }));
    }
  }, [usuario]);


  // Traer datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Verificar que el usuario esté autenticado
        if (!usuario) {
          setError("Debes estar autenticado para crear un torneo");
          setLoading(false);
          return;
        }

        const [juegosData, plataformasData, tipoTorneosData] = await Promise.all([
          obtenerJuegos(),
          obtenerPlataformas(),
          obtenerTipoTorneos()
        ]);
        setJuegos(juegosData);
        setPlataformas(plataformasData);
        setTipoTorneos(tipoTorneosData);
      } catch (err) {
        setError("Error cargando datos: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [usuario]);


  // Efecto para redirigir si no está autenticado
  useEffect(() => {
    if (!usuario && !loading) {
      navigate('/login', { 
        state: { from: '/crear-torneo' } // Para redirigir de vuelta después del login
      });
    }
  }, [usuario, loading, navigate]);


  // Efecto para actualizar el tipo de torneo seleccionado
  useEffect(() => {
    if (formData.tipoDeTorneo && tipoTorneos.length > 0) {
      const tipo = tipoTorneos.find(t => t.id === Number(formData.tipoDeTorneo));
      setTipoTorneoSeleccionado(tipo || null);

      // Limpia campos si es individual
      if (tipo?.esIndividual) {
        setFormData(prev => ({
          ...prev,
          cantJugadoresEquipo: '',
          cantEquipos: ''
        }));
      }
    } else {
      setTipoTorneoSeleccionado(null);
    }
  }, [formData.tipoDeTorneo, tipoTorneos]);


  const handleEntrada = (e) => {
    const { name, value, type } = e.target;
    
    // Convertir a número si el campo es numérico
    const finalValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: finalValue 
    }));
  };

  const handleEnviar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

     // Validaciones específicas según tipo de torneo
    if (tipoTorneoSeleccionado && !tipoTorneoSeleccionado.esIndividual) {
      // Validar campos requeridos para torneos por equipos
      if (!formData.cantJugadoresEquipo) {
        setError("Para torneos por equipos, debe especificar la cantidad de jugadores por equipo");
        setLoading(false);
        return;
      }
      if (!formData.cantEquipos) {
        setError("Para torneos por equipos, debe especificar la cantidad de equipos");
        setLoading(false);
        return;
      }
    }


    // Validaciones básicas de fechas
    if (formData.fechaInicioIns && formData.fechaFinIns && new Date(formData.fechaInicioIns) >= new Date(formData.fechaFinIns)) {
      setError("La fecha de fin de inscripción debe ser posterior a la fecha de inicio");
      setLoading(false);
      return;
    }

    if (formData.fechaInicio && formData.fechaFin && new Date(formData.fechaInicio) >= new Date(formData.fechaFin)) {
      setError("La fecha de fin del torneo debe ser posterior a la fecha de inicio");
      setLoading(false);
      return;
    }

    try {
      // Preparar datos para enviar (convertir IDs a números si es necesario)
      const datosEnviar = {
        // Campos de texto y fechas (se mantienen igual)
        nombre: formData.nombre,
        descripcionReglas: formData.descripcionReglas,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        fechaInicioIns: formData.fechaInicioIns,
        fechaFinIns: formData.fechaFinIns,
        region: formData.region,
        // Resultado y estado automáticos
        
        // Campos convertidos a número
        tipoDeTorneo: formData.tipoDeTorneo ? Number(formData.tipoDeTorneo) : null,
        juego: formData.juego ? Number(formData.juego) : null,
        plataforma: formData.plataforma ? Number(formData.plataforma) : null,
        cantJugadoresEquipo: formData.cantJugadoresEquipo ? Number(formData.cantJugadoresEquipo) : null,
        cantEquipos: formData.cantEquipos ? Number(formData.cantEquipos) : null,
        cantJugadores: formData.cantJugadores ? Number(formData.cantJugadores) : null,

        // ID del creador
        creador: usuario.id,
      };

      await crearTorneo(datosEnviar);
      setSuccess('Torneo creado exitosamente');
      
      // Redirigir después de 2 segundos para que el usuario vea el mensaje
      setTimeout(() => {
        navigate('/torneos');
      }, 2000);
      
    } catch (err) {
      console.error('Error completo:', err);
      setError(err.response?.data?.message || err.message || "Error al crear el torneo");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    if (window.confirm('¿Estás seguro de que quieres cancelar? Los datos no guardados se perderán.')) {
      navigate('/torneos');
    }
  };

  // Helper para determinar si mostrar campos de equipos
  const mostrarCamposEquipos = tipoTorneoSeleccionado && !tipoTorneoSeleccionado.esIndividual;

  return (
    <div className="contenedor-torneos">
      <div className="header-torneos">
        <h1>Crear Nuevo Torneo</h1>
        {tipoTorneoSeleccionado && (
          <div className={`tipo-indicador ${tipoTorneoSeleccionado.esIndividual ? 'individual' : 'por-equipos'}`}>
            {tipoTorneoSeleccionado.esIndividual ? 'Torneo Individual' : 'Torneo por Equipos'}
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form className="form-torneo" onSubmit={handleEnviar}>
        {/* Campos básicos */}
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Torneo:</label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleEntrada}
            required
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcionReglas">Reglas y Descripción:</label>
          <textarea
            id="descripcionReglas"
            name="descripcionReglas"
            value={formData.descripcionReglas}
            onChange={handleEntrada}
            rows="4"
            required
          />
        </div>

        {/* Selectores */}
        <div className="form-group">
          <label htmlFor="tipoDeTorneo">Tipo de Torneo:</label>
          <select
            id="tipoDeTorneo"
            name="tipoDeTorneo"
            value={formData.tipoDeTorneo}
            onChange={handleEntrada}
            required
          >
            <option value="">Seleccione un tipo de torneo</option>
            {tipoTorneos.map(tipo => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="juego">Juego:</label>
          <select
            id="juego"
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
          <label htmlFor="plataforma">Plataforma:</label>
          <select
            id="plataforma"
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

        {/* Campos numéricos - CONDICIONALES */}
        <div className="form-row">
          {/* Mostrar campos de equipos solo si NO es individual */}
          {mostrarCamposEquipos && (
            <>
              <div className="form-group">
                <label htmlFor="cantJugadoresEquipo">Jugadores por Equipo:</label>
                <input
                  id="cantJugadoresEquipo"
                  type="number"
                  name="cantJugadoresEquipo"
                  value={formData.cantJugadoresEquipo}
                  onChange={handleEntrada}
                  min="1"
                  max="20"
                  required={mostrarCamposEquipos}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cantEquipos">Cantidad de Equipos:</label>
                <input
                  id="cantEquipos"
                  type="number"
                  name="cantEquipos"
                  value={formData.cantEquipos}
                  onChange={handleEntrada}
                  min="2"
                  max="64"
                  required={mostrarCamposEquipos}
                />
              </div>
            </>
          )}

          {/* Este campo se muestra siempre */}
          <div className="form-group">
            <label htmlFor="cantJugadores">
              {tipoTorneoSeleccionado?.esIndividual 
                ? 'Cantidad de Jugadores:' 
                : 'Cantidad de Jugadores Totales:'
              }
            </label>
            <input
              id="cantJugadores"
              type="number"
              name="cantJugadores"
              value={formData.cantJugadores}
              onChange={handleEntrada}
              min="1"
              max="500"
              required
            />
            {tipoTorneoSeleccionado?.esIndividual && (
              <small className="helper-text">
                Número total de participantes individuales
              </small>
            )}
          </div>
        </div>

        {/* Resto del formulario (fechas, región, etc.) - se mantiene igual */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fechaInicioIns">Inicio de Inscripción:</label>
            <input
              id="fechaInicioIns"
              type="datetime-local"
              name="fechaInicioIns"
              value={formData.fechaInicioIns}
              onChange={handleEntrada}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fechaFinIns">Fin de Inscripción:</label>
            <input
              id="fechaFinIns"
              type="datetime-local"
              name="fechaFinIns"
              value={formData.fechaFinIns}
              onChange={handleEntrada}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fechaInicio">Inicio del Torneo:</label>
            <input
              id="fechaInicio"
              type="datetime-local"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleEntrada}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fechaFin">Fin del Torneo:</label>
            <input
              id="fechaFin"
              type="datetime-local"
              name="fechaFin"
              value={formData.fechaFin}
              onChange={handleEntrada}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="region">Región:</label>
            <input
              id="region"
              type="text"
              name="region"
              value={formData.region}
              onChange={handleEntrada}
              placeholder="Ej: América Latina, Europa, etc."
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-guardar" 
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Torneo'}
          </button>
          <button 
            type="button" 
            className="btn-cancelar" 
            onClick={handleCancelar}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CrearTorneo;