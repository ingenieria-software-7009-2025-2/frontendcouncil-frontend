import React, { useState } from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import ModalLoginRegister from '../auth/login-register'; 
import { useLocation } from 'react-router-dom';
import SearchBar from '../searchbar/searchbar';
import Filter from '../filter/filter';
import UserDropdown from '../userMenu/userMenu';
import './navbar.css';

const NavbarComponent = () => {
  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  // Función para abrir y cerrar el modal
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    handleCloseModal();
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" variant="dark" className="navbar-custom">
        <Container>
          {location.pathname === '/' && (
            <div className="menuH">
              <Filter />
            </div>
          )}
          {isAuthenticated ? (
            <div className="userMenu">
              <UserDropdown />
            </div>
          ) : location.pathname === '/' && (
            <Button 
              variant="outline-light" 
              className="ml-3 login-button" 
              onClick={handleShowModal}>
              Iniciar Sesión
            </Button>
          )}
        </Container>
      </Navbar>

      {/* Mostrar el modal solo si `showModal` es true */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
            <ModalLoginRegister onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarComponent;






