import axios from 'axios';

// ⭐ Crear instancia de axios con configuración común
const apiJuegos = axios.create({
  baseURL: 'http://localhost:3000/api/juego',
  withCredentials: true, // ⭐ Importante para las cookies HTTP-only
});

export async function obtenerJuegos() {
  try {
    const res = await apiJuegos.get('/');
    console.log('✅ Respuesta juegos:', res.data); // Para debug
    return res.data.data;
  } catch (error) {
    console.error('❌ Error obteniendo juegos:', error);
    throw error;
  }
}

export async function obtenerUnJuego(id) {
  try {
    const res = await apiJuegos.get(`/${id}`);
    return res.data.data;
  } catch (error) {
    console.error(`❌ Error obteniendo juego ${id}:`, error);
    throw error;
  }
}

export async function crearJuego(juego) {
  try {
    const res = await apiJuegos.post('/', juego, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data.data;
  } catch (error) {
    console.error('❌ Error creando juego:', error);
    throw error;
  }
}

export async function eliminarJuego(id) {
  try {
    await apiJuegos.delete(`/${id}`);
    return true;
  } catch (error) {
    console.error(`❌ Error eliminando juego ${id}:`, error);
    throw error;
  }
}