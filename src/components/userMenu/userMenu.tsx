import { useState, useRef } from 'react';
import { Dropdown } from 'react-bootstrap';
import { PersonFill, Gear, BoxArrowRight } from 'react-bootstrap-icons';

import './UserDropdown.css';


const UserDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Cambiar esto con el auth y la bd
  const userData = {
    name: "Nombre Apellido Apellido",
    email: "correo_ejemplo@gmail.com"
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);


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
            <div className="user-name">{userData.name}</div>
            <div className="user-email">{userData.email}</div>
          </div>
          <Dropdown.Divider/>
          <Dropdown.Item href="#/action-2" className="dropdown-item-with-icon">
            <Gear className="dropdown-icon" />
            <span>Configuración de la cuenta</span>
          </Dropdown.Item>
          <Dropdown.Divider/>
          <Dropdown.Item href="#/action-3" className="dropdown-item-with-icon">
            <BoxArrowRight className="dropdown-icon" />
            <span>Cerrar sesión</span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default UserDropdown;