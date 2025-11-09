import './styles/App.css';
import Boton from './components/boton/Boton.tsx';
import { Link, useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  const iniciarSesion = () => {
    navigate('/login');
  };

  const registrar = () => {
    navigate('/register');
  };

  const irAHome = () => {
    navigate('/'); // Navega al home
    window.location.reload(); // Refresca la página (opcional)
  };

  return (
    <div className="contenedor-app">
      <div className="contenedor-header">
        <div className="logo-navbar">
          <img
            className="header-logo"
            src="../src/assets/images/logoPaginaPng.png"
            alt="logo pagina"
            onClick={irAHome}
          />
        </div>
        <div className="contenedor-navbar-links">
          <ul className="navbar-links">
            <li><a href="#">PERFIL</a></li>
            <li><Link to="/torneos">TORNEOS</Link></li>
            <li><a href="#">JUEGOS</a></li>
            <li><a href="#">EQUIPOS</a></li>
            <li><a href="#">FAQS</a></li>
          </ul>
          <Boton
            texto="Iniciar"
            esBotonDeInicio={true}
            manejarBoton={iniciarSesion}
          />
          <Boton
            texto="Registrar"
            esBotonDeInicio={false}
            manejarBoton={registrar}
          />
        </div>
      </div>

      <div className="contenedor-body">
        <img
          className="body-logo"
          src="../src/assets/images/logoPaginaPng.png"
          alt="logo pagina"
        />
        <h2>JUEGA, COMPITE, Y GANA</h2>
        <h5>
          ClutchUp es la plataforma online definitiva para competir en torneos y
          llevar tu nivel al máximo.
          <br />
          Si estás listo para competir,{' '}
          <span className="texto-resaltado">ESTE ES TU LUGAR...</span>
        </h5>
        <Boton
          texto="Únete Ahora"
          esBotonDeInicio={false}
          manejarBoton={registrar}
          claseExtra="boton-unete"
        />
      </div>
    </div>
  );
}

export default App;
