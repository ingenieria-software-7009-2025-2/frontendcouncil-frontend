import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useSwalMessages } from '../../shared/swal-messages';
import LoginForm from './login/login';
import RegisterForm from './register/register';
import './login-register.css';

interface ModalLoginRegisterProps {
  show: boolean;
  onClose: () => void;
}

const ModalLoginRegister: React.FC<ModalLoginRegisterProps> = ({ show, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { successMessage, errorMessage } = useSwalMessages();

  const handleLoginSuccess = () => {
    onClose();
    window.location.reload(); 
  };

  const handleLoginError = (message: string) => {
    onClose();
    errorMessage(message);
  };

  const handleRegisterSuccess = () => {
    onClose();
    successMessage('¡Cuenta registrada exitosamente!');
  };

  const handleRegisterError = (message: string) => {
    onClose();
    errorMessage(message);
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static" keyboard={false} className="modal" style={{ zIndex: 9999999 }}>
      <Modal.Header className="row" style={{ borderBottom: 'none', marginBottom: '0'}}>
        {/* Columna para el botón de cerrar */}
        <div className="col-12 d-flex justify-content-end">
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
        </div>
        
        {/* Columna para las pestañas */}
        <div className="col-12">
          <ul className="nav nav-tabs w-100 border-0">
            <li className="nav-item w-50">
              <button
                className={`nav-link w-100 border-0 bg-transparent ${isLogin ? 'active border-bottom border-primary border-3' : ''}`}
                onClick={() => setIsLogin(true)}
                style={{ color: isLogin ? '#000000' : '#999999', fontWeight: 'bold', fontSize: '14px' }}
              >
                INICIAR SESIÓN
              </button>
            </li>
            <li className="nav-item w-50">
              <button
                className={`nav-link w-100 border-0 bg-transparent ${!isLogin ? 'active border-bottom border-primary border-3' : ''}`}
                onClick={() => setIsLogin(false)}
                style={{ color: !isLogin ? '#000000' : '#999999', fontWeight: 'bold', fontSize: '14px' }}
              >
                CREAR CUENTA
              </button>
            </li>
          </ul>
        </div>
      </Modal.Header>
      
      <Modal.Body>
        {isLogin ? (
          <LoginForm onLoginSuccess={handleLoginSuccess} onLoginError={handleLoginError} />
        ) : (
          <RegisterForm onRegisterSuccess={handleRegisterSuccess} onRegisterError={handleRegisterError} />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ModalLoginRegister;