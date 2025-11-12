import axios from 'axios';


const apiJuegos = axios.create({
  baseURL: 'http://localhost:3000/api/juego',
  withCredentials: true,
});


export async function obtenerJuegos() {
  try {
    const res = await apiJuegos.get('/');
    return res.data.data;
  } catch (error) {
    console.error('Error obteniendo juegos:', error);
    throw error;
  }
}


export async function obtenerJuegoPorId(id) {
  try {
    const res = await apiJuegos.get(`/${id}`);
    return res.data.data;
  } catch (error) {
    console.error('Error obteniendo juego:', error);
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
    console.error('Error creando juego:', error);
    throw error;
  }
}


export async function eliminarJuego(id) {
  try {
    await apiJuegos.delete(`/${id}`);
    return true;
  } catch (error) {
    console.error(`Error eliminando juego ${id}:`, error);
    throw error;
  }
}


// Maneja la actualización completa de un juego y tambien parcial
export async function actualizarJuegoCompleto(id, juego) {
  try {
    console.log('Enviando actualización:', { id, juego });
    
    const datosParaEnviar = {
      nombre: juego.nombre,
      descripcion: juego.descripcion,
      tipoDeJuego: juego.tipoDeJuego,
      plataformas: juego.plataformas
    };
    
    console.log('Datos estructurados:', datosParaEnviar);
    
    const res = await apiJuegos.put(`/${id}`, datosParaEnviar, {
      headers: { 'Content-Type': 'application/json' },
    });
    
    console.log('Juego actualizado:', res.data);
    return res.data.data;
  } catch (error) {
    console.error('Error actualizando juego:', error);
    
    if (error.response) {
      console.error('Respuesta del error:', error.response.data);
      console.error('Status del error:', error.response.status);
    }
    
    throw error;
  }
}


export async function obtenerJuegoConTorneos(id) {
  try {
    const res = await apiJuegos.get(`/${id}/torneos`);
    return res.data.data;
  } catch (error) {
    console.error('Error obteniendo juego con torneos:', error);
    throw error;
  }
}


export async function obtenerTorneosActivosPorJuego(juegoId) {
  try {
    const res = await apiJuegos.get(`/${juegoId}/torneos/activos`);
    return res.data.data;
  } catch (error) {
    console.error('Error obteniendo torneos activos:', error);
    throw error;
  }
}


export async function obtenerTorneosFinalizadosPorJuego(juegoId) {
  try {
    const res = await apiJuegos.get(`/${juegoId}/torneos/finalizados`);
    return res.data.data;
  } catch (error) {
    console.error('Error obteniendo torneos finalizados:', error);
    throw error;
  }
}