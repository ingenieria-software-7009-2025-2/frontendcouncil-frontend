import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

/**
 * @global
 * Interfaz que maneja las propiedades para borrar cuenta.
 * 
 * @param {boolean} mostrar - Muestra contraseña.
 * @param {function} onConfirmar - Función que indica la acción al confirmar.
 * @param {function} onCancelar - Función que indica la cción tras cancelar.
 * 
 * @interface
*/
interface ModalDeleteAccount {
  mostrar: boolean;

  /**
   * Función que indica la acción al confirmar.
   */
  onConfirmar: () => void;

  /**
   * Función que indica la cción tras cancelar.
   */
  onCancelar: () => void;
}

/**
 * @global
 * Lay-out para de borrar cuenta,
 * 
 * @apicall POST - `http://localhost:8080/v1/users/toolkit/verify-password`
 * @apicall DELETE - `http://localhost:8080/v1/users`
 * 
 * @param {boolean} mostrar - Muestra contraseña.
 * @param onConfirmar - Función que indica la acción al confirmar.
 * @param onCancelar - Función que indica la cción tras cancelar.
 * 
 * @returns {JSX.Element} Elemento correspondiente.
 * 
 * @eventProperty
 */
const ModalDeleteAccount: React.FC<ModalDeleteAccount> = ({
  mostrar,
  onConfirmar,
  onCancelar
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  // Obtener el correo del usuario del localStorage o del estado de la aplicación
  const userEmail = sessionStorage.getItem('correo');

  useEffect(() => {
    // Resetear estados cuando el modal se muestra/oculta
    if (!mostrar) {
      setPassword('');
      setError('');
      setIsPasswordCorrect(false);
      setShowPassword(false);
    }
  }, [mostrar]);

  /**
   * Verifica la contraseña del usuario activo.
   * 
   * @apicall POST - `http://localhost:8080/v1/users/toolkit/verify-password`
   * 
   * @returns {Promise<void>} Representación del terminado con éxito de una operación asíncrona.
   */
  const verifyPassword = async () => {
    if (!password) {
      setError('');
      setIsPasswordCorrect(false);
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch('http://localhost:8080/v1/users/toolkit/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify({
          email: userEmail,
          password: password
        }),
      });
      console.log("mande la peticion")
      const data = await response.json();

      if (response.ok ) {
        setError('');
        console.log("entre")
        setIsPasswordCorrect(true);
      } else {
        setError('La contraseña es incorrecta');
        setIsPasswordCorrect(false);
      }
    } catch (error) {
      setError('Error al verificar la contraseña');
      setIsPasswordCorrect(false);
    } finally {
      setIsChecking(false);
    }
  };

  // Verificar la contraseña mientras el usuario escribe (con debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (password) {
        verifyPassword();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [password]);

  /**
   * Cambio de contraseña.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio de evento.
   * 
   * @eventProperty
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (!e.target.value) {
      setError('');
      setIsPasswordCorrect(false);
    }
  };

  /**
   * Eliminado de cuenta activa.
   * 
   * @apicall DELETE - `http://localhost:8080/v1/users`
   * 
   * @param {string} password - Contraseña para autenticar y confirmar.
   */
  const eliminarCuenta = async (password: string) => {
        const token = sessionStorage.getItem("token")
    try {
      const response = await fetch('http://localhost:8080/v1/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          token: token,
          correo: userEmail,
          password: password
        }),
      });

      if (response.ok) {
        console.log('Cuenta eliminada');
        sessionStorage.clear()
        window.location.href = '/'; // o lo que quieras hacer después
      } else {
        console.error('Error al eliminar la cuenta');
      }
    } catch (e){
          console.log("fallo el borrado")
    }
  };
  return (
    <Modal show={mostrar} onHide={onCancelar} centered backdrop="static" style={{ zIndex: 900000 }}>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center">
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <ExclamationTriangleFill className="text-warning" size={48} />
        <h4 className="mb-3 fw-bold">Eliminar cuenta</h4>
        <p className="text-muted">
          Esta acción eliminará permanentemente todos tus datos, historial y contenido asociado.
          <br />
          <strong>No podrás recuperar tu cuenta después de esto.</strong>
        </p>
        
        <div className="mb-3 position-relative">
          <div className="position-relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className={`form-control custom-input pe-4 ${error ? 'is-invalid' : ''}`}
              id="passwordLogin"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Para continuar ingresa tu contraseña"
            />
            <span
              className="position-absolute top-50 end-0 translate-middle-y me-2"
              style={{cursor: 'pointer', color: error ? '#dc3545' : '#9aaaba'}} 
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {error && (
            <div className="text-danger mt-1" style={{ fontSize: '0.75rem' }}>
              {error}
            </div>
          )}
        </div>
        
        {isPasswordCorrect && (
          <>
            <h4 className="question mt-3">¿Estás seguro de eliminar tu cuenta?</h4>
            <div className="d-flex justify-content-center gap-3 mt-3">
              <Button variant="outline-secondary" onClick={onCancelar} className="px-4">
                Cancelar
              </Button>
              <Button variant="danger" onClick={() => eliminarCuenta(password)} className="px-4">
                Sí, eliminar cuenta
              </Button>
            </div>
          </>
        )}
      </Modal.Body>
      {!isPasswordCorrect && (
        <Modal.Footer className="border-0 justify-content-center">
          <Button variant="outline-secondary" onClick={onCancelar} className="px-4">
            Cancelar
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

/**
 * @module delete-account
 * 
 * Lay-out para borrado de cuenta.
 */
export default ModalDeleteAccount;