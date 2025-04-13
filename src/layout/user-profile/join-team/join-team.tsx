import React from 'react';
import './join-team.css';

const JoinTeam = () => {
  const handleButtonClick = () => {
    console.log("Solicitud enviada");
    // Aquí va la logica para notificar al admin SUDO
  };

  return (
    <div className="join-team-container">
      <h2 className="join-team-title">Únete a nuestro equipo</h2>
      <p className="join-team-subtitle">Vuélvete administrador</p>
      <button 
        className="join-team-button"
        onClick={handleButtonClick}>
        Enviar solicitud
      </button>
    </div>
  );
};

export default JoinTeam;