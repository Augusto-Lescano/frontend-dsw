import axios from "axios";

// ⭐ Crear instancia de axios con configuración común
const apiPlataformas = axios.create({
  baseURL: 'http://localhost:3000/api/plataforma',
  withCredentials: true, // ⭐ Importante para las cookies HTTP-only
});

export async function obtenerPlataformas() {
  try {
    const res = await apiPlataformas.get('/');
    console.log('✅ Respuesta plataformas:', res.data); // Para debug
    return res.data.data;
  } catch (error) {
    console.error('❌ Error obteniendo plataformas:', error);
    throw error;
  }
}

export async function obtenerUnaPlataforma(id) {
  try {
    const res = await apiPlataformas.get(`/${id}`);
    return res.data.data;
  } catch (error) {
    console.error(`❌ Error obteniendo plataforma ${id}:`, error);
    throw error;
  }
}

export async function crearPlataforma(plataforma) {
  try {
    const res = await apiPlataformas.post('/', plataforma, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data.data;
  } catch (error) {
    console.error('❌ Error creando plataforma:', error);
    throw error;
  }
}

export async function eliminarPlataforma(id) {
  try {
    await apiPlataformas.delete(`/${id}`);
    return true;
  } catch (error) {
    console.error(`❌ Error eliminando plataforma ${id}:`, error);
    throw error;
  }
}