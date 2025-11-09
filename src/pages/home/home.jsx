import Boton from '../../components/boton/Boton.tsx';
import { useNavigate } from 'react-router-dom';
import './home.css';
import logo from '../../assets/images/logoPaginaPNG.png';

function Home({ manejarRegistro }) {
  const navigate = useNavigate();

  const irAHome = () => {
    navigate('/'); // Navega al home
    window.location.reload(); // Refresca la página (opcional)
  };

  return (
    <div className='contenedor-body'>
      <img
        className='body-logo'
        src={logo}
        alt='logo pagina'
        onClick={irAHome} // Hace click
      />
      <h2>JUEGA, COMPITE, Y GANA</h2>
      <h5>
        ClutchUp es la plataforma online definitiva para competir en torneos online y llevar tu nivel al máximo.
        <br />
        Si estás listo para competir, <span className="texto-resaltado">ESTE ES TU LUGAR...</span>
      </h5>
      <Boton
        texto='Unete Ahora'
        esBotonDeInicio={false}
        manejarBoton={manejarRegistro}
        claseExtra="boton-unete"
      />
    </div>
  );
}

export default Home;
