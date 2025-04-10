import React, { useState } from 'react';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    identifier: false,
    password: false,
    formError: '',
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
      formError: ''
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos vacíos
    const hasEmptyFields = !loginData.identifier || !loginData.password;
    
    if (hasEmptyFields) {
      setErrors({
        identifier: !loginData.identifier,
        password: !loginData.password,
        formError: 'Todos los campos son obligatorios'
      });
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
          formError: 'Credenciales incorrectas'
        });
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      onLoginSuccess();
    } catch (error) {
      setErrors({
        identifier: true,
        password: true,
        formError: 'Credenciales incorrectas'
      });
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="mb-3">
        <label htmlFor="identifier" className="form-label">Correo electrónico o Usuario</label>
        <input
          type="text"
          className={`form-control ${errors.identifier ? 'border-danger' : ''}`}
          id="identifier"
          name="identifier"
          value={loginData.identifier}
          onChange={handleLoginChange}
          placeholder="Ingresa tu correo o nombre de usuario"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">Contraseña</label>
        <input
          type="password"
          className={`form-control ${errors.password ? 'border-danger' : ''}`}
          id="password"
          name="password"
          value={loginData.password}
          onChange={handleLoginChange}
          placeholder="Ingresa tu contraseña"
        />
      </div>

      {/* Mensaje de error general (texto rojo sin fondo) */}
      {errors.formError && (
        <div className="text-danger mt-2 mb-3" style={{ fontSize: '0.9rem' }}>
          {errors.formError}
        </div>
      )}

      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-log-primary text-white">
          Iniciar sesión
        </button>
      </div>
    </form>
  );
};

export default LoginForm;