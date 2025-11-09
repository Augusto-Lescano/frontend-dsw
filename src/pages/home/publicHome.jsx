import React from 'react';
import Boton from '../../components/boton/Boton';
import { useNavigate } from 'react-router-dom';
import '../../styles/main.css';

export default function PublicHome() {
  const navigate = useNavigate();

  return (
    <div className="contenedor-body">
      <img
        className="body-logo"
        src="/src/assets/images/logoPaginaPNG.png"
        alt="logo pagina"
      />
      <h2>JUEGA, COMPITE, Y GANA</h2>
      <h5>
        ClutchUp es la plataforma online definitiva para competir en torneos y
        llevar tu nivel al máximo. <br />
        Si estás listo para competir,{' '}
        <span className="texto-resaltado">ESTE ES TU LUGAR...</span>
      </h5>
      <Boton texto="Únete Ahora" manejarBoton={() => navigate('/register')} />
    </div>
  );
}
