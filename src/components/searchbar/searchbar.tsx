import { Navbar, Form, FormControl, Button, Container, Dropdown } from 'react-bootstrap';
import { useState } from 'react';
import { Search, X } from 'react-bootstrap-icons'; 

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [open, setOpen] = useState(false);

  const handleSearch = (e:any) => {
    e.preventDefault();
    console.log('Buscando:', searchQuery, 'Filtro:', selectedFilter);
    // Aquí iría la lógica de búsqueda
  };

  const handleClear = () => {
    setSearchQuery('');
  };


  return (
    <Navbar expand="lg" variant="dark" className="navbar-searchbar py-3">
      <Container className="px-0 px-lg-3">
        <Form onSubmit={handleSearch} className="w-100">
          <div className="search-container">
            {/* Icono de búsqueda */}
            <span className="search-icon">
              <Search size={20} />
            </span>
            
            {/* Campo de búsqueda */}
            <FormControl
              type="search"
              placeholder="Buscar contenido..."
              aria-label="Buscar"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {/* Botón para limpiar */}
            {searchQuery && (
              <button 
                type="button" 
                className="clear-button"
                onClick={handleClear}
              >
                <X size={20} />
              </button>
            )}
        
            
            {/* Botón de búsqueda (opcional para móviles) */}
            <Button 
              variant="primary" 
              type="submit" 
              className="search-button d-lg-none"
            >
              Buscar
            </Button>
          </div>
        </Form>
      </Container>
    </Navbar>
  );
};

export default SearchBar;