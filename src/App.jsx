import './App.css'
import Boton from './componentes/Boton.tsx'
import { Link } from 'react-router-dom';

function App() {

const iniciarSesion = () => {
  
} 

const registrar = () => {

}

  return (
    <>
      <div className='contenedor-app'>
        <div className='contenedor-header'>
            <div className='logo-navbar'>
              <img className='header-logo'
              src= '../src/imagenes/logoPaginaPNG.png'
              alt= 'logo pagina'/>
            </div>
            <div className='contenedor-navbar-links'>
              <ul className='navbar-links'>
                <li><a href="#">PERFIL</a></li>
                <li><Link to="/torneos">TORNEOS</Link></li>
                <li><a href="#">JUEGOS</a></li>
                <li><a href="#">EQUIPOS</a></li>
                <li><a href="#">FAQS</a></li>
              </ul>
              <Boton
              texto='Iniciar'
              esBotonDeInicio = {true}
              manejarBoton = {iniciarSesion}/>
              <Boton
              texto='Registrar'
              esBotonDeInicio = {false}
              manejarBoton = {registrar}/>
            </div>
            
        </div>
        <div className='contenedor-body'>
          <img className='body-logo'
              src= '../src/imagenes/logoPaginaPNG.png'
              alt= 'logo pagina'/>
          <h2>JUEGA, COMPITE, Y GANA</h2>
          <h5>ClutchUp es la plataforma online definitiva para competir  en torneos online y llevar tu nivel al maximo.
            <br/>Si estas listo para competir, <span className="texto-resaltado">ESTE ES TU LUGAR...</span></h5>
          <Boton
            texto='Unete Ahora'
            esBotonDeInicio = {false}
            manejarBoton = {registrar}
            claseExtra="boton-unete"/>
        </div>
      </div>
  
    </>
  )
}

export default App