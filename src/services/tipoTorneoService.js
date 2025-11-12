import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3000/api/tipoDeTorneo',
  withCredentials: true, // Importante para las cookies HTTP-only
});

export async function obtenerTipoTorneos() {
  try {
    const res = await api.get('/');
    return res.data.data;
  } catch (error) {
    console.error('Error obteniendo tipos de torneo:', error);
    throw error;
  }
}

export async function obtenerUnTipoTorneo(id) {
  try {
    const res = await api.get(`/${id}`);
    return res.data.data;
  } catch (error) {
    console.error(`Error obteniendo tipo torneo ${id}:`, error);
    throw error;
  }
}

export async function crearTipoTorneo(tipoTorneo) {
  try {
    const res = await api.post('/', tipoTorneo, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data.data;
  } catch (error) {
    console.error('Error creando tipo torneo:', error);
    throw error;
  }
}

export async function eliminarTipoTorneo(id) {
  try {
    await api.delete(`/${id}`);
    return true;
  } catch (error) {
    console.error(`Error eliminando tipo torneo ${id}:`, error);
    throw error;
  }
}