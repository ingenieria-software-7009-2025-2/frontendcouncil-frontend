import { useState, useEffect } from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import ModalLoginRegister from '../auth/login-register'; 
import UserDropdown from '../userMenu/userMenu';
import './navbar.css';

const NavbarComponent = () => {
  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);
  // Autenticacion
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Rol
  const [userRole, setUserRole] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const rol = sessionStorage.getItem("rol"); // Agregue esto para el rol (TEMPORAL)
    setIsAuthenticated(!!token); 
    setUserRole(rol); // Agregue esto para el rol (TEMPORAL)
  }, []);

  // Función para abrir y cerrar el modal
  const handleShowModal = () => setShowModal(true);

  const handleCloseModal = (loggedIn = false) => {
    setShowModal(false);
    if (loggedIn) {
      setIsAuthenticated(true);
      setUserRole(sessionStorage.getItem("rol")); // Agregue esto para el rol (TEMPORAL)
      window.location.reload();
    }
  };

   // Función de logout para actualizar estado
   const handleLogout = () => {
        sessionStorage.clear();
        setIsAuthenticated(false);
        setUserRole(null); // Agregue esto para el rol (TEMPORAL)
  };

  return (
    <>
      {currentPath === '/' ? (
      <Navbar collapseOnSelect expand="lg" variant="dark" className="navbar-custom-map">
        {isAuthenticated ? ( 
          <div className="d-flex align-items-center gap-2">
          {(userRole === '3' || userRole === '4') && (
            <>
              <Button
                variant="outline-warning"
                className={`manageIncidentsButton ${currentPath === '/manage-incidents' ? 'active' : ''}`}
                style={{ zIndex: 9999999 }}
                onClick={() => navigate('/manage-incidents')}>
                Incidentes
              </Button>
              <Button
                variant="outline-info"
                className={`manageUsersButton ${currentPath === '/manage-users' ? 'active' : ''}`}
                onClick={() => navigate('/manage-users')}>
                Usuarios
              </Button>
            </>
          )}
          <div className="userMenu">
            <UserDropdown onLogout={handleLogout} />
          </div>
        </div>
        ) : (
          <Button
            variant="outline-light"
            className="login-button w-auto px-3"
            onClick={handleShowModal}>
            Iniciar Sesión
          </Button>
        )}
      </Navbar>
      ) : (
      <Navbar collapseOnSelect expand="lg" variant="dark" className="navbar-custom">
          {currentPath !== '/' && (
              <Button variant="outline-light" className="backHomeButton" onClick={() => navigate('/')}>
                Ir al mapa
              </Button>
            )}
          {/* Mostrar botón de "Ir al mapa" solo si no estamos en la ruta raíz */}
          {isAuthenticated && (
            <div className="d-flex align-items-center gap-2">
              {currentPath !== '/' && (
                <Button variant="outline-light" className="backHomeButton" onClick={() => navigate('/')}>
                  Ir al mapa
                </Button>
              )}
              {(userRole === '3' ||userRole === '4' ) && (
                <>
                  <Button
                    variant="outline-warning"
                    className={`manageIncidentsButton ${currentPath === '/manage-incidents' ? 'active' : ''}`}
                    style={{ zIndex: 9999999 }}
                    onClick={() => navigate('/manage-incidents')}>
                    Incidentes
                  </Button>
                  <Button
                    variant="outline-info"
                    className={`manageUsersButton ${currentPath === '/manage-users' ? 'active' : ''}`}
                    onClick={() => navigate('/manage-users')}>
                    Usuarios
                  </Button>
                </>
              )}
              <div className="userMenu">
                <UserDropdown onLogout={handleLogout} />
              </div>
            </div>
          )}   
      </Navbar>
      )}
      {/* Mostrar el modal solo si `showModal` es true */}
      {showModal && (
        <div className="modal-overlay" onClick={() => handleCloseModal()}>
          <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
            <ModalLoginRegister onClose={(loggedIn = false) => handleCloseModal(loggedIn)} />
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarComponent;
