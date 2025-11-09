import axios from "axios";

const tiposTorneoUrl = "http://localhost:3000/api/tipoDeTorneo";

export async function obtenerTipoTorneos() {
  const res = await axios.get(tiposTorneoUrl);
  return res.data.data;
}

export async function obtenerUnTipoTorneo(id) {
  const res = await axios.get(`${tiposTorneoUrl}/${id}`);
  return res.data.data;
}

export async function crearTipoTorneo(tipoTorneo) {
  const res = await axios.post(tiposTorneoUrl, tipoTorneo);
  return res.data.data;
}

export async function eliminarTipoTorneo(id) {
  await axios.delete(`${tiposTorneoUrl}/${id}`);
  return true;
}