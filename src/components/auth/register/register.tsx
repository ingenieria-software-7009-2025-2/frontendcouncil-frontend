import React, { useState } from 'react';

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onRegisterError: (message: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onRegisterError }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    motherLastName: '',
    username: '',
    correo: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    motherLastName: '',
    username: '',
    correo: '',
    password: '',
    confirmPassword: '',
    formError: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Limpiar errores al escribir
    setErrors(prev => ({
      ...prev,
      [e.target.name]: '',
      formError: ''
    }));
  };

  const validateFields = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      motherLastName: '',
      username: '',
      correo: '',
      password: '',
      confirmPassword: '',
      formError: ''
    };

    // Validar campos vacíos
    if (formData.firstName.trim() === '') {
      newErrors.firstName = 'Este campo es obligatorio';
      isValid = false;
    }
    if (formData.lastName.trim() === '') {
      newErrors.lastName = 'Este campo es obligatorio';
      isValid = false;
    }
    if (formData.motherLastName.trim() === '') {
      newErrors.motherLastName = 'Este campo es obligatorio';
      isValid = false;
    }
    if (formData.username.trim() === '') {
      newErrors.username = 'Este campo es obligatorio';
      isValid = false;
    }
    if (formData.correo.trim() === '') {
      newErrors.correo = 'Este campo es obligatorio';
      isValid = false;
    }
    if (formData.password.trim() === '') {
      newErrors.password = 'Este campo es obligatorio';
      isValid = false;
    }
    if (formData.confirmPassword.trim() === '') {
      newErrors.confirmPassword = 'Este campo es obligatorio';
      isValid = false;
    }

    if (!isValid) {
      newErrors.formError = 'Por favor llene todos los campos';
    }

    // Validar coincidencia de contraseñas
    if (formData.password !== formData.confirmPassword && formData.password && formData.confirmPassword) {
      newErrors.password = 'Las contraseñas no coinciden';
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const checkExistingUser = async () => {
    try {
      // Verificar si el usuario ya existe
      const userResponse = await fetch(`http://localhost:8080/v1/users/check-username?username=${formData.username}`);
      if (!userResponse.ok) {
        throw new Error('Error al verificar usuario');
      }
      const userData = await userResponse.json();
      if (userData.exists) {
        setErrors(prev => ({
          ...prev,
          username: 'El usuario ya está registrado',
          formError: 'El usuario ya está registrado'
        }));
        return false;
      }

      // Verificar si el correo ya existe
      const emailResponse = await fetch(`http://localhost:8080/v1/users/check-email?email=${formData.correo}`);
      if (!emailResponse.ok) {
        throw new Error('Error al verificar correo');
      }
      const emailData = await emailResponse.json();
      if (emailData.exists) {
        setErrors(prev => ({
          ...prev,
          correo: 'El correo está registrado',
          formError: 'El correo está registrado'
        }));
        return false;
      }

      return true;
    } catch (error) {
      onRegisterError('Error al verificar los datos');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) return;
    if (!await checkExistingUser()) return;

    const user = {
      nombre: formData.firstName.trim(),
      apPaterno: formData.lastName.trim(),
      apMaterno: formData.motherLastName.trim(),
      correo: formData.correo.trim(),
      username: formData.username.trim(),
      password: formData.password,
    };

    try {
      const response = await fetch('http://localhost:8080/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
      }

      const data = await response.json();
      onRegisterSuccess();
    } catch (error) {
      onRegisterError('Error al registrar el usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">Nombre de Usuario</label>
        <input
          type="text"
          className={`form-control ${errors.username ? 'border-danger' : ''}`}
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Ingresa tu nuevo nombre de usuario"
        />
        {errors.username && <div className="text-danger small mt-1">{errors.username}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="emailRegister" className="form-label">Correo electrónico</label>
        <input
          type="email"
          className={`form-control ${errors.correo ? 'border-danger' : ''}`}
          id="emailRegister"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          placeholder="Ingresa tu correo"/>
        {errors.correo && <div className="text-danger small mt-1">{errors.correo}</div>}
      </div>  
      
      <div className="mb-3">
        <label htmlFor="firstName" className="form-label">Nombre</label>
        <input
          type="text"
          className={`form-control ${errors.firstName ? 'border-danger' : ''}`}
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Ingresa tu nombre" />
        {errors.firstName && <div className="text-danger small mt-1">{errors.firstName}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="lastName" className="form-label">Apellido Paterno</label>
        <input
          type="text"
          className={`form-control ${errors.lastName ? 'border-danger' : ''}`}
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Ingresa tu apellido paterno" />
        {errors.lastName && <div className="text-danger small mt-1">{errors.lastName}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="motherLastName" className="form-label">Apellido Materno</label>
        <input
          type="text"
          className={`form-control ${errors.motherLastName ? 'border-danger' : ''}`}
          id="motherLastName"
          name="motherLastName"
          value={formData.motherLastName}
          onChange={handleChange}
          placeholder="Ingresa tu apellido materno"/>
        {errors.motherLastName && <div className="text-danger small mt-1">{errors.motherLastName}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="passwordRegister" className="form-label">Contraseña</label>
        <input
          type="password"
          className={`form-control ${errors.password ? 'border-danger' : ''}`}
          id="passwordRegister"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Ingresa tu contraseña"/>
        {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
        <input
          type="password"
          className={`form-control ${errors.confirmPassword ? 'border-danger' : ''}`}
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirma tu contraseña"/>
        {errors.confirmPassword && <div className="text-danger small mt-1">{errors.confirmPassword}</div>}
      </div>
      
      {/* Mensaje de error general */}
      {errors.formError && (
        <div className="text-danger mb-3" style={{ fontSize: '0.9rem' }}>
          {errors.formError}
        </div>
      )}
      
      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-log-primary text-white">
          Crear cuenta
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;