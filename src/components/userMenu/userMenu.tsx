import { useState, useRef, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { PersonFill, Gear, BoxArrowRight } from 'react-bootstrap-icons';
import { useNavigate } from "react-router-dom";
import './UserDropdown.css';

const UserDropdown = ({ onLogout }: { onLogout: () => void }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [userData, setUserData] = useState<{ 
    nombre: string; 
    apPaterno: string | null; 
    apMaterno: string | null; 
    correo: string; 
    userName: string;
  }>(null);
  const [dataFetched, setDataFetched] = useState(false);
  const navigate = useNavigate();

  // Cargar datos del usuario cuando el componente se monte
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token && !dataFetched) {
      fetchUserData();
    }
  }, []); 

  const fetchUserData = async () => {
    const token = sessionStorage.getItem("token");
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
      sessionStorage.setItem("correo", data.correo);
      sessionStorage.setItem("nombre", data.nombre);
      sessionStorage.setItem("apPaterno", data.apPaterno);
      sessionStorage.setItem("apMaterno", data.apMaterno);
      sessionStorage.setItem("userName", data.userName);
      setUserData({
        nombre: data.nombre, 
        apPaterno: data.apPaterno,
        apMaterno: data.apMaterno,
        correo: data.correo, 
        userName: data.userName
      });
      setDataFetched(true);
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
    }
  };

  const handleLogout = async () => {
    const token = sessionStorage.getItem("token");
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
      sessionStorage.clear();
      onLogout();
      navigate("/");
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

  // Obtener la inicial del nombre (o 'P' si no hay datos)
  const getUserInitial = () => {
    if (userData?.nombre) {
      return userData.nombre.charAt(0).toUpperCase();
    }
    const storedName = sessionStorage.getItem("nombre");
    if (storedName) {
      return storedName.charAt(0).toUpperCase();
    }
    return 'P';
  };

  return (
    <div className="user-dropdown-container" ref={dropdownRef}>
      <Dropdown show={showDropdown} onToggle={toggleDropdown}>
        <Dropdown.Toggle as="div" className="user-toggle">
          <div className="user-circle">
            <span className="user-content">{getUserInitial()}</span>
          </div>
        </Dropdown.Toggle>

        <Dropdown.Menu className="user-dropdown-menu">
          <div className="user-info-section">
            {userData ? (
                <>
                  <div className="user-name">
                    {userData.nombre} 
                    {userData.apPaterno ? ` ${userData.apPaterno}` : ''}
                    {userData.apMaterno ? ` ${userData.apMaterno}` : ''}
                  </div>
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