import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3000/api/torneos',
  withCredentials: true, // importante para las cookies httpOnly
});

// Obtener todos los torneos
export async function obtenerTorneos() {
  const res = await api.get('/');
  return res.data.data; // devuelve el array de torneos
}

// Obtener un torneo por ID
export async function obtenerUnTorneo(id) {
  const res = await api.get(`/${id}`);
  return res.data.data;
}

// Crear un torneo (solo admins)
export async function crearTorneo(torneo) {
  const res = await api.post('/', torneo, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data.data;
}

export async function actualizarTorneo(id, torneo) {
  const res = await api.put(`/${id}`, torneo, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data.data;
}

// Eliminar un torneo por ID (solo admins)
export async function eliminarTorneo(id) {
  await api.delete(`/${id}`);
  return true;
}