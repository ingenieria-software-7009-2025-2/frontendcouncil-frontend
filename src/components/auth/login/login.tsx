import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaExclamationCircle } from 'react-icons/fa';
import './login.css'

/**
 * @global
 * Interfaz de propiedades para el login.
 * 
 * @param {function} onLoginSuccess - Función que indica la acción ante éxito al logear.
 * @param {function} onLoginError - Función que indica la acción ante error al logear.
 * 
 * @interface
 */
interface LoginFormProps {

  /**
   * Función que indica la acción ante éxito al logear.
   */
  onLoginSuccess: () => void;

  /**
   * Función que indica la acción ante error al logear.
   * @param {string} message - Mensaje a mostrar.
   */
  onLoginError: (message: string) => void;
}

/**
 * @global
 * Form usado para el login.
 * 
 * @param {function} onLoginSuccess - Función que indica la acción ante éxito al logear.
 * @param {function} onLoginError - Función que indica la acción ante error al logear.
 * 
 * @returns {JSX.Element} - Elemento correspondiente.
 * 
 * @eventProperty
 */
const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onLoginError }) => {
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const [errors, setErrors] = useState({
    identifier: false,
    password: false,
    formError: '',
    identifierMessage: '',
    passwordMessage: ''
  });

  /**
   * Manejador de cambios al logear.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio ante entrada.
   * 
   * @eventProperty
   */
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });

    // Limpiar errores al escribir
    setErrors(prev => ({
      ...prev,
      [e.target.name]: false,
      formError: '',
      [`${e.target.name}Message`]: '' // Limpiar el mensaje de error específico
    }));
  };

  /**
   * Manejador de forma al logear.
   * 
   * @remaks Crea el elemento para llenar la forma, si no está llenada correctamente, se notifica al usuario.
   * En otro caso, hace llamada al API dedicado para login.
   * Dada la respuesta del servidor, se da acceso, o se controla avisa al usuario la eventualidad.
   * 
   * @apicall POST - `/v1/users/login`
   * 
   * @param {React.FormEvent<>} e - Evento dedicado al llenado de formas.
   * 
   * @returns {Promise<void>} Representación de una acción asíncrona completa.
   * 
   * @eventProperty
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos vacíos
    const hasEmptyFields = !loginData.identifier || !loginData.password;

    let newErrors = {
      identifier: false,
      password: false,
      formError: '',
      identifierMessage: '',
      passwordMessage: ''
    };

    if (!loginData.identifier) {
      newErrors.identifier = true;
      newErrors.identifierMessage = 'Por favor ingrese correo o nombre de usuario';
    }

    if (!loginData.password) {
      newErrors.password = true;
      newErrors.passwordMessage = 'Por favor ingrese una contraseña';
    }

    if (hasEmptyFields) {
      setErrors(newErrors);
      return;
    }
    // TODO: Update regex [A-Za-z0-9]+@[a-z0-9]+\.[a-z]{2-4}
    const isEmail = loginData.identifier.includes('@');
    // TODO: Raise error if not email.
    const credentials = isEmail
      ? { correo: loginData.identifier, password: loginData.password }
      : { correo: loginData.identifier, password: loginData.password };

    try {
      const response = await fetch('http://localhost:8080/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          // Usuario no encontrado
          setErrors({
            identifier: true,
            password: false,
            formError: 'Usuario o correo no encontrado',
            identifierMessage: 'Usuario o correo no registrado',
            passwordMessage: ''
          });
        } else if (response.status === 401) {
          // Contraseña incorrecta
          setErrors({
            identifier: false,
            password: true,
            formError: 'Contraseña incorrecta',
            identifierMessage: '',
            passwordMessage: 'La contraseña ingresada no es correcta'
          });
        } else {
          // Otro tipo de error
          setErrors({
            identifier: true,
            password: true,
            formError: data.message || 'Error al iniciar sesión',
            identifierMessage: '',
            passwordMessage: ''
          });
        }
        return;
      }
      sessionStorage.setItem('token', data.token);
      // Modificar esto de acuerdo al backend
      sessionStorage.setItem('rol', data.rolid);
      console.log(data.rolid)
      // IMPLEMENTACIÓN TEMPORAL DE ROL:
      /*
      if (loginData.identifier === 'admin@admin.com' ||  loginData.identifier === 'admin') {
        sessionStorage.setItem('rol', 'admin');
      } else {
        sessionStorage.setItem('rol', 'user');
      }
      */

      onLoginSuccess();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        onLoginError('⚠️ Lo sentimos, no se pudo conectar con el servidor. Intentalo más tarde.');
      }
      else {
        setErrors({
          identifier: true,
          password: true,
          formError: 'Credenciales incorrectas',
          identifierMessage: '',
          passwordMessage: ''
        });
      }
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="mb-3">
        <input
          type="text"
          className={`form-control custom-input pe-4 ${errors.password ? 'is-invalid' : ''}`}
          id="identifier"
          name="identifier"
          value={loginData.identifier}
          onChange={handleLoginChange}
          placeholder="Ingresa tu correo o nombre de usuario"
        />
        {errors.identifierMessage && (
          <div className="text-danger mt-1" style={{ fontSize: '0.75rem' }}>
            {errors.identifierMessage}
          </div>
        )}
      </div>
      <div className="mb-3 position-relative">
        <div className="position-relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className={`form-control custom-input pe-4 ${errors.password ? 'is-invalid' : ''}`}
            id="passwordLogin"
            name="password"
            value={loginData.password}
            onChange={handleLoginChange}
            placeholder="Ingresa tu contraseña"/>
          <span
            className="position-absolute top-50 end-0 translate-middle-y me-2"
            style={{cursor: 'pointer', color: errors.password ? '#dc3545' : '#9aaaba'}} onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.passwordMessage && (
          <div className="text-danger mt-1" style={{ fontSize: '0.75rem' }}>
            {errors.passwordMessage}
          </div>
        )}
      </div>  
      
      {/* Mensaje de error general (texto rojo sin fondo) */}
      {errors.formError && (
        <div className="text-danger mt-2 mb-3" style={{ fontSize: '0.9rem' }}>
          {errors.formError}
        </div>
      )}
      <div className="d-flex justify-content-end">
        <Link to="/recuperar" className="forgot-password-link">¿Olvidaste tu contraseña?</Link>
      </div>
      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-log-primary text-white">
          Iniciar sesión
        </button>
      </div>
    </form>
  );
};

/**
 * @module login
 *
 * Inicio de sesión.
 * 
 * @remarks Modulo especilizado en la obtención de datos por un formulario para inicio de sesión.
 */
export default LoginForm;
