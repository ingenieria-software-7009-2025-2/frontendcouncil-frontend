import { useState, useRef } from 'react';
import { Dropdown } from 'react-bootstrap';
import { PersonFill, Gear, BoxArrowRight } from 'react-bootstrap-icons';
import { useNavigate } from "react-router-dom";
import './UserDropdown.css';
const UserDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [userData, setUserData] = useState<{ nombre: string; correo: string; userName:string; }>(null);
  const [dataFetched, setDataFetched] = useState(false);
  const navigate = useNavigate(); //hook de navegacion
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      console.error("No hay token disponible");
      return;
    }


    try {
      const response = await fetch("http://localhost:8080/v1/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      localStorage.setItem("correo", data.correo);
      localStorage.setItem("nombre", data.nombre);
      localStorage.setItem("apPaterno", data.apPaterno);
      localStorage.setItem("apMaterno", data.apMaterno);
      localStorage.setItem("userName", data.userName);

      setUserData({nombre: data.nombre, correo:data.correo, userName:data.userName}); // Guardar datos en el estado
      setDataFetched(true); // Marcar que ya hicimos la petición
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    console.log(token);
    try {
      const response = await fetch("http://localhost:8080/v1/users/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al cerrar sesión");
      }
      localStorage.clear();
      navigate("/"); // Redirigir a la página principal
      window.location.reload();
    } catch (error) {
      console.error("Error en el logout:", error);
    }
  };

  const toggleDropdown = (isOpen: boolean) => {
    setShowDropdown(isOpen);
    if (isOpen && !dataFetched) {
      fetchUserData();
    }
  };

  // Cambiar esto con el auth y la bd

  return (
    <div className="user-dropdown-container" ref={dropdownRef}>
      <Dropdown show={showDropdown} onToggle={toggleDropdown}>
        <Dropdown.Toggle as="div" className="user-toggle">
          <div className="user-circle">
            <span className="user-content">U</span>
            {/* Alternativa con ícono: */}
            {/* <PersonFill className="user-icon" /> */}
          </div>
        </Dropdown.Toggle>

        <Dropdown.Menu className="user-dropdown-menu">
          {/* Sección de información del usuario (no clickeable) */}
          <div className="user-info-section">
            {userData ? (
                <>
                  <div className="user-name">{userData.nombre}</div>
                  <div className="user-email">{userData.correo}</div>
                </>
            ) : (
                <div>Cargando...</div>
            )}
          </div>
          <Dropdown.Divider/>
          <Dropdown.Item href="/profile" className="dropdown-item-with-icon">
            <Gear className="dropdown-icon" />
            <span>Configuración de la cuenta</span>
          </Dropdown.Item>
          <Dropdown.Divider/>
          <Dropdown.Item onClick={handleLogout} className="dropdown-item-with-icon">
            <BoxArrowRight className="dropdown-icon" />
            <span>Cerrar sesión</span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default UserDropdown;