import React from 'react';
import { useAuth } from '../../context/useAuth.js';
import '../../styles/main.css';

export default function UserHome() {
  const { usuario } = useAuth();

  return (
    <div className="user-home">
      <h1>¡Bienvenido, {usuario?.nombre || 'Usuario'}!</h1>
      <p>
        Esta es tu página de usuario. <br />
        Si estás listo para competir, podés inscribirte en un torneo o incluso crear tu propio equipo junto a otros jugadores.
      </p>
    </div>
  );
}
