import { Dropdown, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import ToggleSwitch from '../toggle-button/toggle-switch';
import './filter.css';
import { getCategories } from '../../services/category.service';
import { CategoryDTO } from '../../models/dto-category'; 

interface FilterProps {
  onFilterChange: (filters: Filters) => void;
}

type Filters = {
  reportado: boolean;
  revision: boolean;
  resuelto: boolean;
};

const Filter = ({ onFilterChange }: FilterProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    reportado: true,  
    revision: true,   
    resuelto: true    
  });
  
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [categoryStates, setCategoryStates] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const loadCategories = async () => {
      const loadedCategories = await getCategories();
      setCategories(loadedCategories);
      
      // Inicializar todas las categorías como activadas
      const initialCategoryStates = loadedCategories.reduce((acc, category) => {
        acc[category.id] = true;
        return acc;
      }, {} as Record<number, boolean>);
      
      setCategoryStates(initialCategoryStates);
    };
    loadCategories();
  }, []);

  const handleToggle = (filterName: keyof Filters) => (isOn: boolean) => {
    const newFilters = { ...filters, [filterName]: isOn };
    setFilters(newFilters);
    onFilterChange(newFilters); 
  };

  const handleCategoryToggle = (categoryId: number) => (isOn: boolean) => {
    setCategoryStates(prev => ({ ...prev, [categoryId]: isOn }));
    // Lógica de filtrado para categorías aquí
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
          <Dropdown.Header>Mostrar ...</Dropdown.Header>
          <Dropdown.Divider />
          <Dropdown.Item as="div" className="menu-item">
            <div className="d-flex justify-content-between align-items-center w-100">
              <span>Incidentes registrados</span>
              <ToggleSwitch 
                id="filter-reportado"
                isOn={filters.reportado}
                onChange={handleToggle('reportado')}
              />
            </div>
          </Dropdown.Item>
          <Dropdown.Item as="div" className="menu-item">
            <div className="d-flex justify-content-between align-items-center w-100">
              <span>Incidentes en revisión</span>
              <ToggleSwitch 
                id="filter-revision"
                isOn={filters.revision}
                onChange={handleToggle('revision')}
              />
            </div>
          </Dropdown.Item>
          <Dropdown.Item as="div" className="menu-item">
            <div className="d-flex justify-content-between align-items-center w-100">
              <span>Incidentes resueltos</span>
              <ToggleSwitch 
                id="filter-resuelto"
                isOn={filters.resuelto}
                onChange={handleToggle('resuelto')}
              />
            </div>
          </Dropdown.Item>

          <Dropdown.Divider />
          {categories.map(category => (
            <Dropdown.Item as="div" className="menu-item" key={category.id}>
              <div className="d-flex justify-content-between align-items-center w-100">
                <span>{category.icon} {category.name}</span>
                <ToggleSwitch 
                  id={`filter-category-${category.id}`}
                  isOn={categoryStates[category.id] || false}
                  onChange={handleCategoryToggle(category.id)}
                />
              </div>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default Filter;