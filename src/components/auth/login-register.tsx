import React, { useState } from 'react';
import { useSwalMessages } from '../../shared/swal-messages';
import LoginForm from './login/login';
import RegisterForm from './register/register';
import './login-register.css';

interface ModalLoginRegisterProps {
  onClose: () => void;
}

const ModalLoginRegister: React.FC<ModalLoginRegisterProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { successMessage, errorMessage } = useSwalMessages();

  const handleLoginSuccess = () => {
    onClose();
  };

  const handleRegisterSuccess = () => {
    successMessage('¡Cuenta registrada exitosamente!');
    onClose();
  };

  const handleRegisterError = (message: string) => {
    errorMessage(message);
  };

  return (
    <div className="modal fade show data-modal-close" tabIndex={-1} style={{ display: 'block' }} aria-labelledby="modalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header row" style={{ borderBottom: 'none', marginBottom: '0' }}>
            {/* Columna para el botón de cerrar */}
            <div className="col-12 d-flex justify-content-end">
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            
            {/* Columna para las pestañas */}
            <div className="col-12">
              <ul className="nav nav-tabs w-100 border-0">
                <li className="nav-item w-50">
                  <button
                    className={`nav-link w-100 border-0 bg-transparent ${isLogin ? 'active border-bottom border-primary border-3' : ''}`}
                    onClick={() => setIsLogin(true)}
                    style={{ color: isLogin ? '#000000' : '#999999', fontWeight: 'bold', fontSize: '14px' }}>
                    INICIAR SESIÓN
                  </button>
                </li>
                <li className="nav-item w-50">
                  <button
                    className={`nav-link w-100 border-0 bg-transparent ${!isLogin ? 'active border-bottom border-primary border-3' : ''}`}
                    onClick={() => setIsLogin(false)}
                    style={{ color: !isLogin ? '#000000' : '#999999', fontWeight: 'bold', fontSize: '14px' }}>
                    CREAR CUENTA
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="modal-body">
            {isLogin ? (
              <LoginForm onLoginSuccess={handleLoginSuccess}  />
            ) : (
              <RegisterForm onRegisterSuccess={handleRegisterSuccess} onRegisterError={handleRegisterError} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalLoginRegister;
