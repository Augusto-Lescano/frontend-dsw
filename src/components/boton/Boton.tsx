import './Boton.css';

interface BotonProps {
  texto: string;
  esBotonDeInicio: boolean;
  manejarBoton: () => void;
  claseExtra?: string; 
}

export default function Boton({ texto, esBotonDeInicio, manejarBoton,claseExtra }: BotonProps) {
  return (
    <button
      className={`${esBotonDeInicio ? 'boton-iniciar' : 'boton-registrar'} ${claseExtra || ''}`}
      onClick={manejarBoton}>
      {texto}
    </button>
  );
}

