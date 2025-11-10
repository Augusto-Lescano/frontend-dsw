import { Link, useNavigate } from 'react-router-dom';
import Boton from '../boton/Boton';
import IconoUsuario from '../usuarioIcono/iconoUsuario.jsx';
import { useAuth } from '../../context/useAuth.js';
import logo from '../../assets/images/logoPaginaPNG.png';
import './navBar.css';

export default function Navbar() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (!usuario) navigate('/'); // público
    else if (usuario.rol === 'admin') navigate('/admin'); // admin
    else navigate('/home'); // usuario
  };

  return (
    <header className="contenedor-header">
      <div className="logo-navbar">
        <img
          className="header-logo"
          src={logo}
          alt="logo"
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div className="contenedor-navbar-links">
        <ul className="navbar-links">
          <li><Link to="/torneos">TORNEOS</Link></li>

          {usuario?.rol === 'admin' && (
            <>
              <li><Link to="/juegos">JUEGOS</Link></li>
              <li><Link to="/inscripciones">INSCRIPCIONES</Link></li>
              <li><Link to="/equipos">EQUIPOS</Link></li>
              <li><Link to="/usuarios">USUARIOS</Link></li>
            </>
          )}

          {usuario?.rol === 'user' && <li><Link to="/equipos">EQUIPOS</Link></li>}

          <li><Link to="/faqs">FAQS</Link></li>
        </ul>

        {!usuario ? (
          <>
            <Boton texto="Iniciar" esBotonDeInicio manejarBoton={() => navigate('/login')} />
            <Boton texto="Registrar" esBotonDeInicio={false} manejarBoton={() => navigate('/register')} />
          </>
        ) : (
          <IconoUsuario />
        )}
      </div>
    </header>
  );
}
