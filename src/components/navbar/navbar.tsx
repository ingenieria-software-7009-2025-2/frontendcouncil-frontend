import React, { useState } from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import ModalLoginRegister from '../auth/login-register';  // Importa tu modal
import SearchBar from '../searchbar/searchbar';
import Filter from '../filter/filter';
import UserDropdown from '../userMenu/userMenu';
import './navbar.css';

const NavbarComponent = () => {
  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);

  // Función para abrir y cerrar el modal
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <Navbar collapseOnSelect expand="lg" variant="dark" className="navbar-custom">
        <Container>
          {/* Agregar un if para ver si esta logeado el usuario y ver que componentes usar*/}
          <div className="menuH">
            <Filter />
          </div>
         {/* Corrigiendo estilos del navbar, aunque creo que vamos a utiliar la de la api de mapas
         <div className="searchbar">
            <SearchBar />
          </div>*/}

          <div className="userMenu">
            <UserDropdown />
          </div>
          
          <Button
            variant="outline-light"
            className="ml-3 login-button"
            onClick={handleShowModal} // Abre el modal al hacer clic
          >
            Iniciar Sesión
          </Button>
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
