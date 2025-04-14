import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaExclamationCircle } from 'react-icons/fa';
import './login.css'

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
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

    const isEmail = loginData.identifier.includes('@');
    const credentials = isEmail
      ? { correo: loginData.identifier, password: loginData.password }
      : { username: loginData.identifier, password: loginData.password };

    try {
      const response = await fetch('http://localhost:8080/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        setErrors({
          identifier: true,
          password: true,
          formError: 'Credenciales incorrectas',
          identifierMessage: '',
          passwordMessage: ''
        });
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      // Modificar esto de acuerdo al backend
      // localStorage.setItem('rol', data.user.rol);
      // IMPLEMENTACIÓN TEMPORAL DE ROL:
      if (loginData.identifier === 'admin@admin.com') {
        localStorage.setItem('rol', 'admin');
      } else {
        localStorage.setItem('rol', 'user');
      }
      onLoginSuccess();
    } catch (error) {
      setErrors({
        identifier: true,
        password: true,
        formError: 'Credenciales incorrectas',
        identifierMessage: '',
        passwordMessage: ''
      });
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

export default LoginForm;
