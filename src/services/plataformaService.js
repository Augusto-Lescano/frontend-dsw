import axios from "axios";

const plataformasUrl = "http://localhost:3000/api/plataforma";

export async function obtenerPlataformas() {
  const res = await axios.get(plataformasUrl);
  return res.data.data;
}

export async function obtenerUnaPlataforma(id) {
  const res = await axios.get(`${plataformasUrl}/${id}`);
  return res.data.data;
}

export async function crearPlataforma(plataforma) {
  const res = await axios.post(plataformasUrl, plataforma);
  return res.data.data;
}

export async function eliminarPlataforma(id) {
  await axios.delete(`${plataformasUrl}/${id}`);
  return true;
}