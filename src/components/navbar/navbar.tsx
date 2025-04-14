import React, { useState, useEffect } from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import ModalLoginRegister from '../auth/login-register'; 
import SearchBar from '../searchbar/searchbar';
import Filter from '../filter/filter';
import UserDropdown from '../userMenu/userMenu';
import './navbar.css';

const NavbarComponent = () => {
  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);
  // Autenticacion
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Si hay token, el usuario está autenticado.
  }, []);

  // Función para abrir y cerrar el modal
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = (loggedIn = false) => {
    setShowModal(false);
    
    if (loggedIn) { 
      setIsAuthenticated(true);
      window.location.reload(); 
    }
  };

   // Función de logout para actualizar estado
   const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false); // Ocultar UserDropdown
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" variant="dark" className="navbar-custom">
      <Container>
          {currentPath === '/' && (
            <div className="menuH">
              <Filter />
            </div>
          )}
          {currentPath !== '/' && (
              <Button variant="outline-light" className="backHomeButton" onClick={() => navigate('/')}>
                Ir al mapa
              </Button>
            )}
          {/* Mostrar botón de "Ir al mapa" solo si no estamos en la ruta raíz */}
          {isAuthenticated ? (
            <div className="d-flex align-items-center gap-2">
              {currentPath !== '/' && (
                <Button variant="outline-light" className="backHomeButton" onClick={() => navigate('/')}>
                  Ir al mapa
                </Button>
              )}
              <div className="userMenu">
                <UserDropdown onLogout={handleLogout} />
              </div>
            </div>
          ) : (
            currentPath === '/' && (
              <Button
                variant="outline-light"
                className="login-button w-auto px-3"
                onClick={handleShowModal}>
                Iniciar Sesión
              </Button>
            )
          )}
        </Container>
      </Navbar>

      {/* Mostrar el modal solo si `showModal` es true */}
      {showModal && (
        <div className="modal-overlay" onClick={() => handleCloseModal()}>
          <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
            <ModalLoginRegister onClose={() => handleCloseModal(true)} />
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarComponent;
