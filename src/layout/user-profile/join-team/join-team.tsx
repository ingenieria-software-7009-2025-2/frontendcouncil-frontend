import React from 'react';
import './join-team.css';

const JoinTeam = () => {
  const handleButtonClick = async () => {
      console.log("Solicitud enviada");

      try {
          const username = sessionStorage.getItem("userName")
          const token = sessionStorage.getItem("token");

          const peticion = {
              username: username,
              rolid: 2
          }

          const response = await fetch("http://localhost:8080/v1/users/toolkit", {
              method: "PUT",
              headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(peticion)
          });
          if (!response.ok) {
              throw new Error("no se pudo cambiar");
          }
      } catch (error) {
          console.log(error)
      }
      // Aquí va la logica para notificar al admin SUDO
  };

  return (
    <div className="join-team-container">
      <h2 className="join-team-title">Únete a nuestro equipo</h2>
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
      <button 
        className="join-team-button"
        onClick={handleButtonClick}>
        Enviar solicitud
      </button>
    </div>
  );
};

export default JoinTeam;