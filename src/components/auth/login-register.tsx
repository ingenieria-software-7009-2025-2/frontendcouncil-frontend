
import React, { useState, useEffect, useRef } from 'react';
import { useSwalMessages } from '../../shared/swal-messages';
import { useNavigate, useLocation } from 'react-router-dom';
import { CloseButton } from 'react-bootstrap';
import './login-register.css'

interface ModalLoginRegisterProps {
  onClose: () => void;
}

const ModalLoginRegister: React.FC<ModalLoginRegisterProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { successMessage, errorMessage} = useSwalMessages();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    motherLastName: '',
    username: '',
    correo: '',
    password: '',
    confirmPassword: '',
  });

  const [loginData, setLoginData] = useState({
    identifier: '',  // Puede ser un email o nombre de usuario
    password: '',
  });

  const [formError, setFormError] = useState('');

  // Función para manejar el cambio de cada campo
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  

  //Función para manejo de login por email o username.
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,  // Mantener los valores previos
      [e.target.name]: e.target.value,  // Actualizar el campo correspondiente
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Verificamos si es email o username.
    const isEmail = loginData.identifier.includes('@');

    // Si es un correo se manda como correo de lo contrario como username.
    const credentials = isEmail
        ? {correo: loginData.identifier, password: loginData.password}
        : {username: loginData.identifier, password: loginData.password};

    // Autenticacion con fetch
    try {
      const response = await fetch("http://localhost:8080/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      console.log(response)
      if (!response.ok) {
        throw new Error("Error en la autenticación");
      }

      const data = await response.json();
      console.log("Usuario autenticado:", data);
      successMessage("Inicio de sesión exitoso");
    } catch (error) {
      console.error("Error de login:", error);
      errorMessage("Credenciales incorrectas");
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setFormError('Las contraseñas no coinciden');
      return;
    }

    setFormError('');
    // Crear objeto user con todos los datos.
    const user = {
      nombre: formData.firstName,
      apPaterno: formData.lastName,
      apMaterno: formData.motherLastName,
      correo: formData.correo,
      username: formData.username, // Agregamos el campo de nombre de usuario
      password: formData.password,
    };

    console.log("Formulario enviado:", user);
    try {
      const response = await fetch("http://localhost:8080/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      console.log(response)
      if (!response.ok) {
        throw new Error("Error en el registro");
      }

      const data = await response.json();
      console.log("Usuario Registrado:", data);
      successMessage("Exito");
    } catch (error) {
      console.error("Error de register:", error);
      errorMessage("datos invalidos");
    }
    // Aquí puedes hacer la petición al backend con fetch o axios
    // fetch('URL_DEL_BACKEND/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(user)
    // }).then(response => response.json())
    //   .then(data => console.log("Respuesta del backend:", data))
    //   .catch(error => console.error("Error en el registro:", error));
  };



  return (
    <div className="modal fade show data-modal-close" tabIndex={-1} style={{ display: 'block' }} aria-labelledby="modalLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header position-relative">
        <button 
              type="button" 
              className="btn-close position-absolute" 
              style={{right: '20px', top: '20px'}}
              onClick={onClose}
              aria-label="Close">
          </button>
          {/* Pestañas estilo subrayado */}
          <ul className="nav nav-tabs w-100 border-0">
            <li className="nav-item w-50">
              <button
                className={`nav-link w-100 border-0 bg-transparent ${isLogin ? 'active border-bottom border-primary border-3' : ''}`}
                onClick={() => setIsLogin(true)}
                style={{ 
                  color: isLogin ? '#000000' : '#999999',
                  fontWeight: isLogin ? '650' : '400',
                  fontSize: '14px'
                }}>
              INICIAR SESIÓN
              </button>
            </li>
            <li className="nav-item w-50">
              <button
                className={`nav-link w-100 border-0 bg-transparent ${!isLogin ? 'active border-bottom border-primary border-3' : ''}`}
                onClick={() => setIsLogin(false)}
                style={{ 
                  color: !isLogin ? '#000000' : '#999999',
                  fontWeight: !isLogin ? '650' : '400',
                  fontSize: '14px'
                }}
              >
                CREAR CUENTA
              </button>
            </li>
          </ul>
        </div>
        
        {/* El resto de tu contenido permanece igual */}
        <div className="modal-body">
          {isLogin ? (
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="identifier" className="form-label">Correo electrónico o Usuario</label>
                <input 
                  type="text"
                  className="form-control"
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
                    className="form-control"
                    id="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="Ingresa tu contraseña"

                    />
              </div>
              <div className="d-flex justify-content-end">
                <button 
                  type="submit" 
                  className="btn btn-log-primary text-white">
                  Iniciar sesión
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Ingresa tu nombre"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Nombre de Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Ingresa tu nuevo nombre de usuario"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">Apellido Paterno</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Ingresa tu apellido paterno"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="motherLastName" className="form-label">Apellido Materno</label>
                  <input
                    type="text"
                    className="form-control"
                    id="motherLastName"
                    name="motherLastName"
                    value={formData.motherLastName}
                    onChange={handleChange}
                    placeholder="Ingresa tu apellido materno"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="emailRegister" className="form-label">Correo electrónico</label>
                  <input
                    type="correo"
                    className="form-control"
                    id="emailRegister"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    placeholder="Ingresa tu correo"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="passwordRegister" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordRegister"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirma tu contraseña"
                  />
                </div>

                {/* Mostrar el error si las contraseñas no coinciden */}
                {formError && <div className="alert alert-danger">{formError}</div>}
                <div className="d-flex justify-content-end">
                <button 
                  type="submit" 
                  className="btn btn-log-primary text-white"
                  onClick={() => successMessage('¡Su cuenta ha sido registrada exitosamente!')}>
                  Crear cuenta
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default ModalLoginRegister;