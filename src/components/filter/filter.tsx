import { Navbar, Nav, Button, Container, Dropdown } from 'react-bootstrap';
import { useState, useRef } from 'react';
import './filter.css';  

const Filter = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <div className="navbar-filter" ref={dropdownRef}>
          <Dropdown show={showDropdown} onToggle={toggleDropdown}>
          <Dropdown.Toggle as="div" className="user-toggle">
            <div className="hamburger-menu">
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </div>
          </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="menu-content">
            <Dropdown.Item href="#home">Incidentes registrados</Dropdown.Item>
            <Dropdown.Item href="#features">Incidentes en revisión</Dropdown.Item>
            <Dropdown.Item href="#pricing">Incidentes resueltos</Dropdown.Item>
          </Dropdown.Menu>
          </Dropdown>
        </div>
  );
};

export default Filter;
