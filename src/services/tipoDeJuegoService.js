import axios from 'axios';

const apiTiposDeJuego = axios.create({
  baseURL: 'http://localhost:3000/api/tipoDeJuego',
  withCredentials: true,
});

export async function obtenerTiposDeJuego() {
  try {
    const res = await apiTiposDeJuego.get('/');
    return res.data.data;
  } catch (error) {
    console.error('Error obteniendo tipos de juego:', error);
    throw error;
  }
}