import { Dropdown, Form } from 'react-bootstrap';
import { useState } from 'react';
import ToggleSwitch from '../toggle-button/toggle-switch';
import './filter.css';

/**
 * @global
 * Filtros disponibles.
 * 
 * @type { {...boolean} }
 * @see {@link ./src/models/dto-incidents.ts}
 */
type Filters = {
  reportado: boolean;
  revision: boolean;
  resuelto: boolean;
};

/**
 * @global
 * Nav-bar para filtros.
 * 
 * @returns {JSX.Element} Elemento correspondiente.
 */
const Filter = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    reportado: false,
    revision: false,
    resuelto: false
  });
  const handleToggle = (filterName: keyof Filters) => (isOn: boolean) => {
    setFilters(prev => ({ ...prev, [filterName]: isOn }));
    // Lógica de filtrado aquí
  };

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
        <Dropdown.Item as="div" className="menu-item">
            <div className="d-flex justify-content-between align-items-center w-100">
              <span>Incidentes registrados</span>
              <ToggleSwitch 
                id="filter-reportado"
                onChange={handleToggle('reportado')}
              />
            </div>
          </Dropdown.Item>
          <Dropdown.Item as="div" className="menu-item">
            <div className="d-flex justify-content-between align-items-center w-100">
              <span>Incidentes en revisión</span>
              <ToggleSwitch 
                id="filter-revision"
                onChange={handleToggle('revision')}
              />
            </div>
          </Dropdown.Item>
          <Dropdown.Item as="div" className="menu-item">
            <div className="d-flex justify-content-between align-items-center w-100">
              <span>Incidentes resueltos</span>
              <ToggleSwitch 
                id="filter-resuelto"
                onChange={handleToggle('resuelto')}
              />
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

/**
 * @module filter
 *
 * Nav bar de filtros.
 * 
 * @remarks Módulo especializado en una barra de navegación hecha para filtrado de incidentes.
 */
export default Filter;
