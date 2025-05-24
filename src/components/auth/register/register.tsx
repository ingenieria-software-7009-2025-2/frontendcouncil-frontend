import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './register.css';

/**
 * @global
 * Interfaz de propiedades para el sign up.
 * 
 * @param {function} onRegisterSuccess - Función que indica la acción ante éxito al hacer sign up.
 * @param {function} onRegisterError - Función que indica la acción ante error al hacer sign up.
 * 
 * @interface
 */
interface RegisterFormProps {

  /**
   * Función que indica la acción ante éxito al hacer sign up.
   */
  onRegisterSuccess: () => void;

  /**
   * Función que indica la acción ante error al hacer sign up.
   * @param {string} message - Mensaje a mostrar,
   */
  onRegisterError: (message: string) => void;
}

/**
 * @global
 * Form usado para hacer sign up.
 * 
 * @apicall GET - `/v1/users/check-email`
 * @apicall GET - `/v1/users/check-username`
 * @apicall POST - `http://localhost:8080/v1/users`
 * 
 * @param {function} onRegisterSuccess - Función que indica la acción ante éxito al hacer sign up.
 * @param {function} onRegisterError - Función que indica la acción ante error al hacer sign up.
 * 
 * @eventProperty
 */
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

  /**
   * Manejador de cambios al hacer sing up.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio ante entrada.
   * 
   * @eventProperty
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // limpia error al escribir
    setFormError('');
  };

  /**
   * Validador de formato de contraseñas.
   * @param {string} password - Cadena con la posible contraseña.
   */
  const validatePassword = (password: string) => {
    const lengthOK = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return lengthOK && hasNumber && hasUpper && hasSpecial;
  };

  /**
   * Validador de formato de correos.
   * @param {string} correo - Cadena con la posible correo.
   */
  const validateEmail = (correo: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  };

  /**
   * Manejador de forma al logear.
   * TODO: Modify request
   * 
   * @apicall GET - `/v1/users/check-email`
   * 
   * @param {React.FormEvent<>} e - Evento dedicado a formas
   * 
   * @returns {Promise<void>} Representación de una acción asíncrona completa.
   * 
   * @beta
   */
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

  /**
   * Manejador de forma al logear.
   * TODO: Modify request
   * 
   * @apicall GET - `/v1/users/check-username`
   * 
   * @param {React.FormEvent<>} e - Evento dedicado a formas
   * 
   * @returns {Promise<void>} Representación de una acción asíncrona completa.
   * 
   * @beta @eventProperty
   */
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

  /**
   * Manejador de forma al hacer sign up.
   * 
   * @remaks Crea el elemento para llenar la forma, si no está llenada correctamente, se notifica al usuario.
   * En otro caso, hace llamada al API dedicado para sign up.
   * Dada la respuesta del servidor, se da acceso, o se controla avisa al usuario la eventualidad.
   * 
   * @apicall POST - `/v1/users`
   * 
   * @param {React.FormEvent<>} e - Evento dedicado al llenado de formas.
   * 
   * @returns {Promise<void>} Representación de una acción asíncrona completa.
   * 
   * @eventProperty
   */
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
      if (!response.ok) {
        const errorData = await response.text();
        if (response.status === 406) {
          setErrors(prev => ({ ...prev, username: 'Este nombre de usuario ya está en uso' }));
        } else if (response.status === 407) {
          setErrors(prev => ({ ...prev, correo: 'Este correo ya está registrado' }));
        } else {
          onRegisterError('⚠️ Ocurrió un error inesperado');
        }
        return;
      }
      await response.json();
      onRegisterSuccess();
    } catch (error) {
      if (error instanceof RangeError){
        onRegisterError('⚠️ Lo sentimos, este correo ya esta en uso.');
      } else if (error instanceof TypeError ){
        onRegisterError('⚠️ Lo sentimos, este usuario ya esta en uso.');
      }
      onRegisterError('⚠️ Lo sentimos, el servidor fuera de servicio');
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

/**
 * @module register
 *
 * Registro de sesión.
 * 
 * @remarks Modulo especilizado en la obtención de datos por un formulario para registro de cuenta.
 */
export default RegisterForm;