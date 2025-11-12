import { useEffect, useState } from "react";
import { obtenerTodasLasInscripciones } from "../../services/inscripcionService.js";
import "./InscripcionesAdmin.css";

export default function InscripcionesAdmin() {
  const [inscripciones, setInscripciones] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerTodasLasInscripciones();
        setInscripciones(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);
  

  return (
    <div className="contenedor-inscripciones-admin">
      <h1>Listado de Inscripciones</h1>
      {error && <p className="error">{error}</p>}

      <div className="lista-inscripciones">
        {inscripciones.length > 0 ? (
          inscripciones.map((i) => (
            <div key={i.id} className="tarjeta-inscripcion">
              <h2>{i.torneo?.nombre || "Torneo sin nombre"}</h2>
              <p><strong>Estado:</strong> {i.estado}</p>
              <p><strong>Fecha inicio insc.:</strong> {new Date(i.fechaApertura).toLocaleDateString()}</p>
              <p><strong>Fecha fin insc.:</strong> {new Date(i.fechaCierre).toLocaleDateString()}</p>

              {/* Individuales */}
              {i.inscripcionesIndividuales?.length > 0 && (
                <div className="seccion-inscripciones">
                  <h4>Inscripciones Individuales:</h4>
                  <ul>
                    {i.inscripcionesIndividuales.map((ind) => (
                      <li key={ind.id}>
                        👤 {ind.usuario?.nombre || "Desconocido"} —{" "}
                        {new Date(ind.fechaInscripcion).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Por equipos */}
              {i.inscripcionesEquipos?.length > 0 && (
                <div className="seccion-inscripciones">
                  <h4>Inscripciones por Equipo:</h4>
                  <ul>
                    {i.inscripcionesEquipos.map((eq) => (
                      <li key={eq.id}>
                        🏆 {eq.equipo?.nombre || "Equipo desconocido"} —{" "}
                        {new Date(eq.fechaInscripcion).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No hay inscripciones registradas.</p>
        )}
      </div>
    </div>
  );
}
