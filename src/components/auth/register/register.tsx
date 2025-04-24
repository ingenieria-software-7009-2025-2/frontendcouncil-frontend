import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './register.css';

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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // limpia error al escribir
    setFormError('');
  };

  const validatePassword = (password: string) => {
    const lengthOK = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return lengthOK && hasNumber && hasUpper && hasSpecial;
  };

  const validateEmail = (correo: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  };

  const checkEmailExists = async (correo: string) => {
    if (!correo || !validateEmail(correo)) return false;
    try {
      const response = await fetch(`http://localhost:8080/v1/users/check-email?email=${correo}`);
      if (response.ok) {
        return await response.json();
      }
      return false;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const checkUsernameExists = async (username: string) => {
    if (!username) return false;
    try {
      const response = await fetch(`http://localhost:8080/v1/users/check-username?username=${username}`);
      if (response.ok) {
        return await response.json();
      }
      return false;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Validar campos vacíos excepto motherLastName
    if (!formData.firstName.trim()) newErrors.firstName = 'Por favor ingrese un nombre';
    if (!formData.lastName.trim()) newErrors.lastName = 'Por favor ingrese un apellido paterno';
    if (!formData.username.trim()) newErrors.username = 'Por favor ingrese un nombre de usuario';
    if (!formData.correo.trim()) newErrors.correo = 'Por favor ingrese un correo';
    if (!formData.password.trim()) newErrors.password = 'Por favor ingrese una contraseña';
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Por favor confirme su contraseña';

    // Validar formato de correo
    if (formData.correo && !validateEmail(formData.correo)) {
      newErrors.correo = 'Ingrese un correo válido';
    }

    // Validar formato de contraseña
    if (formData.password && !validatePassword(formData.password)) {
      newErrors.password = 'Formato de contraseña no válido (mínimo 8 caracteres, un número, una mayúscula y un carácter especial)';
    }

    // Validar coincidencia de contraseñas
    if (formData.password !== formData.confirmPassword) {
      newErrors.password = 'Las contraseñas no coinciden';
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Verificar si el correo ya existe
    const emailExists = await checkEmailExists(formData.correo);
    if (!emailExists) {
      setErrors(prev => ({ ...prev, correo: 'Este correo ya está registrado' }));
      return;
    }

    // Verificar si el usuario ya existe
    const usernameExists = await checkUsernameExists(formData.username);
    if (!usernameExists) {
      setErrors(prev => ({ ...prev, username: 'Este nombre de usuario ya está en uso' }));
      return;
    }

    setErrors({});
    setFormError('');

    const user = {
      nombre: formData.firstName,
      apPaterno: formData.lastName,
      apMaterno: formData.motherLastName,
      correo: formData.correo,
      username: formData.username,
      password: formData.password,
    };

    try {
      const response = await fetch('http://localhost:8080/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error('Error en el registro');
      await response.json();
      onRegisterSuccess();
    } catch (error) {
      onRegisterError('⚠️ Lo sentimos, no se pudo conectar con el servidor. Intentalo más tarde.');
    }
  };

  const getInputClass = (field: string) =>
    `form-control custom-input ${errors[field] ? 'is-invalid' : ''}`;

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <input
          type="text"
          className={getInputClass('firstName')}
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Nombre"/>
        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
      </div>

      <div className="mb-3">
        <input
          type="text"
          className={getInputClass('lastName')}
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Apellido paterno"/>
        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control custom-input"
          id="motherLastName"
          name="motherLastName"
          value={formData.motherLastName}
          onChange={handleChange}
          placeholder="Apellido materno"/>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className={getInputClass('username')}
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          onBlur={() => checkUsernameExists(formData.username).then(exists => {
            if (exists) {
              setErrors(prev => ({ ...prev, username: 'Este nombre de usuario ya está en uso' }));
            }
          })}
          placeholder="Nombre de usuario"/>
        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
      </div>

      <div className="mb-3">
        <input
          type="text"
          className={getInputClass('correo')}
          id="emailRegister"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          onBlur={() => checkEmailExists(formData.correo).then(exists => {
            if (exists) {
              setErrors(prev => ({ ...prev, correo: 'Este correo ya está registrado' }));
            }
          })}
          placeholder="Correo"/>
        {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
      </div>
      
      <div className="mb-3 position-relative">
        <div className="position-relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className={`${getInputClass('password')} pe-4`}
            id="passwordRegister"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña"/>
          <span
            className="position-absolute top-50 end-0 translate-middle-y me-2"
            style={{ 
              cursor: 'pointer',
              color: errors.password ? '#dc3545' : '#9aaaba'}}
              onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && (<div className="invalid-feedback d-block mt-1"> {errors.password}</div>)}
      </div>

      <div className="mb-3">
        <input
          type='password'
          className={getInputClass('confirmPassword')}
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirmar contraseña" />
        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
      </div>

      {formError && <div className="alert alert-danger">{formError}</div>}

      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-log-primary text-white">
          Crear cuenta
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
