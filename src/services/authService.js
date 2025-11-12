import axios from 'axios';

// Configuración base del cliente Axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // Envía cookies httpOnly automáticamente
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptores
// Interceptor para manejar errores globales (401, 403, etc.)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si el token expiró o no autorizado
    if (error.response?.status === 401) {
      console.warn('Token expirado o usuario no autenticado');
      // Aquí podríaamos intentar refrescar el token automáticamente:
      // await refreshAccessToken();
    }

    // Propagamos el error con un mensaje claro
    return Promise.reject(
      new Error(
        error.response?.data?.message ||
          'Error al comunicarse con el servidor'
      )
    );
  }
);

// Funciones de autenticación

export const loginReq = async (identifier, contrasenia) => {
  try {
    const res = await api.post('/usuarios/login', { identifier, contrasenia });
    return res.data; // solo devolvemos los datos
  } catch (err) {
    throw new Error(err.message || 'Error al iniciar sesión');
  }
};

export const registerReq = async (payload) => {
  try {
    const res = await api.post('/usuarios/register', payload);
    return res.data;
  } catch (err) {
    throw new Error(err.message || 'Error al registrar usuario');
  }
};

export const logoutReq = async () => {
  try {
    const res = await api.post('/usuarios/logout', {}, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error('Error logout:', err);
    throw new Error(err.message || 'Error al cerrar sesión');
  }
};


export const meReq = async () => {
  try {
    const res = await api.get('/usuarios/ruta/protegida');
    return res.data.data || null;
  } catch {
    return null; // si no hay sesión activa
  }
};

export const obtenerUsuariosSinEquipo = async () => {
  try {
    const res = await api.get('/usuarios/sin-equipo'); // backend debe exponer esta ruta
    return res.data.data;
  } catch (err) {
    console.error('Error obteniendo usuarios sin equipo:', err);
    throw err;
  }
};

export const obtenerUsuariosAdmin = async () => {
  try {
    const res = await api.get('/usuarios/admin/listado');
    return res.data.data;
  } catch (error) {
    console.error('Error obteniendo listado de usuarios (admin):', error);
    throw error;
  }
};

// Eliminar usuario (solo admin)
export async function eliminarUsuario(id) {
  try {
    const res = await api.delete(`/usuarios/admin/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    throw error;
  }
}

// A FUTURO
// Implementar refresh tokens.

export default api;
