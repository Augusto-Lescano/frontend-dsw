import { Outlet } from 'react-router-dom';
import Navbar from './components/navBar/navBar.jsx';
import './styles/App.css';

export default function App() {
  return (
    <div className="contenedor-app">
      <Navbar />
      <div className="contenedor-body">
        {/* Aca se cargan las páginas hijas según la ruta */}
        <Outlet />
      </div>
    </div>
  );
}
