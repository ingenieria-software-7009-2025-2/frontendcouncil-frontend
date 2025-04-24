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
      <p className="join-team-subtitle">¿Te gustaría asumir un rol más activo dentro de la plataforma?</p>
      <p className="join-team-subsubtitle">Conviértete en administrador y ayuda a gestionar los reportes de incidentes.</p>
      <p className="join-team-body">Tendrás la posibilidad de actualizar el estado de cada incidente, colaborar en su resolución y asegurarte de que la información fluya correctamente.</p>
      <button 
        className="join-team-button"
        onClick={handleButtonClick}>
        Enviar solicitud
      </button>
    </div>
  );
};

export default JoinTeam;