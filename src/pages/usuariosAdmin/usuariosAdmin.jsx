import { useEffect, useState } from "react";
import { obtenerUsuariosAdmin, eliminarUsuario } from "../../services/authService.js";
import "./UsuariosAdmin.css";

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await obtenerUsuariosAdmin(); // ya retorna data.data en el service
        setUsuarios(data);
      } catch (err) {
        setError(err.message || "Error al cargar usuarios");
      }
    };
    fetchUsuarios();
  }, []);

  const handleEliminar = async (id) => {
    const confirmDelete = window.confirm("¿Seguro que deseas eliminar este usuario?");
    if (!confirmDelete) return;

    try {
      await eliminarUsuario(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert("Error al eliminar usuario: " + err.message);
    }
  };

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="usuarios-container">
      <h2 className="titulo">Gestión de Usuarios</h2>

      <div className="usuarios-lista">
        {usuarios.length === 0 ? (
          <p>No hay usuarios registrados.</p>
        ) : (
          usuarios.map((usuario) => (
            <div key={usuario.id} className="usuario-card">
              <h3>{usuario.nombre} {usuario.apellido}</h3>
              <p><strong>Email:</strong> {usuario.email}</p>
              <p><strong>Nombre de usuario:</strong> {usuario.nombreUsuario}</p>
              <p><strong>País:</strong> {usuario.pais}</p>
              <p><strong>Rol:</strong> {usuario.rol}</p>

              {/* Equipos donde participa */}
              {usuario.equiposMiembro?.length > 0 && (
                <p>
                  <strong>Miembro de:</strong>{" "}
                  {usuario.equiposMiembro.join(", ")}
                </p>
              )}

              {/* Equipos donde es capitán */}
              {usuario.equiposCapitan?.length > 0 && (
                <p>
                  <strong>Capitán de:</strong>{" "}
                  {usuario.equiposCapitan.join(", ")}
                </p>
              )}

              {/* Torneos creados */}
              {usuario.torneosCreados?.length > 0 && (
                <p>
                  <strong>Torneos creados:</strong>{" "}
                  {usuario.torneosCreados.join(", ")}
                </p>
              )}

              <button className="btn-eliminar" onClick={() => handleEliminar(usuario.id)}>
                Eliminar usuario
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
