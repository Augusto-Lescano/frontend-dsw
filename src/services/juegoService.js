import axios from 'axios';

// === JUEGOS ===
const juegosUrl = "http://localhost:3000/api/juego";

export async function obtenerJuegos() {
  const res = await axios.get(juegosUrl);
  return res.data.data;
}

export async function obtenerUnJuego(id) {
  const res = await axios.get(`${juegosUrl}/${id}`);
  return res.data.data;
}

export async function crearJuego(juego) {
  const res = await axios.post(juegosUrl, juego);
  return res.data.data;
}

export async function eliminarJuego(id) {
  await axios.delete(`${juegosUrl}/${id}`);
  return true;
}