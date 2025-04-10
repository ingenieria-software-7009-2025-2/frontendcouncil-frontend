import { Dropdown, Form } from 'react-bootstrap';
import { useState } from 'react';
import './filter.css';  

const Filter = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="navbar-filter">
      <Dropdown show={showDropdown} onToggle={() => setShowDropdown(!showDropdown)}>
        {/* Botón Circular con el Menú Hamburguesa */}
        <Dropdown.Toggle as="div" className="user-toggle" onClick={() => setShowDropdown(!showDropdown)}>
          <div className="menu-circle">
            <div className="hamburger-menu">
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </div>
          </div>
        </Dropdown.Toggle>

        {/* Menú desplegable */}
        <Dropdown.Menu align="end" className="menu-content">
          <Dropdown.Item>
            Incidentes registrados 
            <Form.Check
            type="switch"
            id="filter-registered"
            onChange={() => { /* Aquí va la lógica para manejar registrados */ }}
            label=""
          /></Dropdown.Item>
          <Dropdown.Item href="#features">Incidentes en revisión</Dropdown.Item>
          <Dropdown.Item href="#pricing">Incidentes resueltos</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default Filter;
