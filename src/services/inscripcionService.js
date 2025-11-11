import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/inscripcion',
  withCredentials: true,
});

// Inscribir usuario individualmente
export async function inscribirUsuarioIndividual(torneoId, usuarioId) {
  try {
    const res = await api.post('/individual', {
      torneoId,
      usuarioId
    });
    return res.data.data;
  } catch (error) {
    console.error('Error inscribiendo usuario:', error);
    throw error;
  }
}

// Inscribir equipo
export async function inscribirEquipo(torneoId, equipoId) {
  try {
    const res = await api.post('/equipo', {
      torneoId,
      equipoId
    });
    return res.data.data;
  } catch (error) {
    console.error('Error inscribiendo equipo:', error);
    throw error;
  }
}

// Obtener equipos del usuario
export async function obtenerEquiposDelUsuario() {
  try {
    const res = await api.get('mis-equipos');
    return res.data.data;
  } catch (error) {
    console.error('Error obteniendo equipos del usuario:', error);
    throw error;
  }
}

// Verificar si ya está inscrito
export async function verificarInscripcion(torneoId, usuarioId) {
  try {
    const res = await api.get(`/verificar/${torneoId}/usuario/${usuarioId}`);
    return res.data.data;
  } catch (error) {
    console.error('Error verificando inscripción:', error);
    throw error;
  }
}