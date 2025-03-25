import { Navbar, Nav, Button, Container, Dropdown } from 'react-bootstrap';
import { useState } from 'react';
import './filter.css';  

const Filter = () => {
  const [open, setOpen] = useState(false);

  return (
    <Navbar expand="lg" variant="dark" className="navbar-filter">
      <Container>
        {/* Botón Circular del Menú de Hamburguesa */}
        <Dropdown show={open} onToggle={() => setOpen(!open)}>
          <Dropdown.Toggle 
            as={Button} 
            className={`menu-circle ${open ? 'active' : ''}`}
            onClick={() => setOpen(!open)}
          >
            <span className="navbar-toggler-icon"></span>
          </Dropdown.Toggle>

          {/* Menú desplegable */}
          <Dropdown.Menu align="end" className="menu-content">
            <Dropdown.Item href="#home">Incidentes registrados</Dropdown.Item>
            <Dropdown.Item href="#features">Incidentes en revisión</Dropdown.Item>
            <Dropdown.Item href="#pricing">Incidentes resueltos</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </Navbar>
  );
};

export default Filter;
