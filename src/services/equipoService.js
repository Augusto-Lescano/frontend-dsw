import axios from 'axios';

// =====================
// Configuración base del cliente Axios
// =====================
const api = axios.create({
  baseURL: 'http://localhost:3000/api/equipos',
  withCredentials: true, // Envía cookies httpOnly automáticamente
  headers: {
    'Content-Type': 'application/json',
  },
});

// =====================
// Interceptores
// =====================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('⚠️ Token expirado o usuario no autenticado');
      // Podrías manejar un refresh token aquí en el futuro
    }

    return Promise.reject(
      new Error(
        error.response?.data?.message ||
          'Error al comunicarse con el servidor'
      )
    );
  }
);

// =====================
// Funciones del servicio de equipos
// =====================

// 🔹 Obtener todos los equipos
export const obtenerEquipos = async () => {
  try {
    const res = await api.get('/');
    return res.data.data;
  } catch (err) {
    console.error('❌ Error al obtener equipos:', err.message);
    throw err;
  }
};

// 🔹 Obtener un solo equipo por ID
export const obtenerUnEquipo = async (id) => {
  try {
    const res = await api.get(`/${id}`);
    return res.data.data;
  } catch (err) {
    console.error(`❌ Error al obtener el equipo ${id}:`, err.message);
    throw err;
  }
};

// 🔹 Crear equipo
export const crearEquipo = async (equipo) => {
  try {
    const res = await api.post('/', equipo);
    return res.data.data;
  } catch (err) {
    console.error('❌ Error al crear equipo:', err.message);
    throw err;
  }
};

// 🔹 Actualizar equipo
export const actualizarEquipo = async (id, equipo) => {
  try {
    const res = await api.put(`/${id}`, equipo);
    return res.data.data;
  } catch (err) {
    console.error(`❌ Error al actualizar el equipo ${id}:`, err.message);
    throw err;
  }
};

// 🔹 Eliminar equipo
export const eliminarEquipo = async (id) => {
  try {
    await api.delete(`/${id}`);
    return true;
  } catch (err) {
    console.error(`❌ Error al eliminar el equipo ${id}:`, err.message);
    throw err;
  }
};

export default api;
