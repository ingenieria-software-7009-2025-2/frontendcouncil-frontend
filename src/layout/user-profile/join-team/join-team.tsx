import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './join-team.css';
import logo from '../../../assets/SISREP_LOGO_BLACK.svg';

const JoinTeam = () => {
  const handleButtonClick = () => {
    console.log("Solicitud enviada");
    // Aquí va la logica para notificar al admin SUDO
  };

  return (
    <div className="join-team-container">
        <div className="header-join">
          <h1 className="h1-join">Únete a nuestro equipo</h1>
          <img src={logo} alt="Logo" className="logo-join"></img>
        </div>

      <div className="container-card-join">
        <div className="card-join card-blue columna">
          <h2>Participa activamente en la seguridad </h2>
          <p>¿Te gustaría asumir un rol más activo dentro de la plataforma?</p>
        </div>
        <div className="card-join card-orange columna">
          <h2>Administradores de la plataforma</h2>
          <p>Conviértete en administrador y ayuda a gestionar los reportes de incidentes.</p>
        </div>
        <div className="card-join card-yellow columna">
          <h2>Monitorea y mejora</h2>
          <p>Tendrás la posibilidad de actualizar el estado de cada incidente, colaborar en su resolución y asegurarte de que la información fluya correctamente.</p>
        </div>
      </div>

      <div className="d-grid gap-2 col-6 mx-auto">
        <button 
          className="btn btn-primary"
          onClick={handleButtonClick}>
          Enviar solicitud
        </button>
      </div>
    </div>
  );
};

export default JoinTeam;