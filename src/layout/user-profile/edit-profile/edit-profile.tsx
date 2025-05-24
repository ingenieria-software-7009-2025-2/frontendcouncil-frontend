import { useState, useEffect, JSX } from 'react';
import { Card, Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './edit-profile.css';

/**
 * @global
 * Información que puede cambiar el usuario.
 * 
 * @param {string} username - Nombre de usuario.
 * @param {string} firstName - Nombre
 * @param {string} lastName - Apellido paterno.
 * @param {string} motherLastName - Apellido materno.
 * @param {string} email - Correo electrónico.
*/
type UserProfile = {
  username: string;
  firstName: string;
  lastName: string;
  motherLastName: string;
  email: string;
};

/**
 * @global
 * Lay-out para editar perfil de cuenta activa.
 * 
 * @apicall GET - `"http://localhost:8080/v1/users/me"`
 * @apicall PUT - `"http://localhost:8080/v1/users/me"`
 * 
 * @returns {JSX.Element} Elemento correspondinete.
 * 
 * @eventProperty
 */
const EditProfile = () => {
  const navigate = useNavigate();
  const [tempUser, setTempUser] = useState<UserProfile>({
    username: '',
    firstName: '',
    lastName: '',
    motherLastName: '',
    email: '',
  });

  // Cargar datos del usuario al montar el componente
  useEffect(() => {

    /**
     * Obtención de datos de la cuenta activa.
     * 
     * @apicall GET - `"http://localhost:8080/v1/users/me"`
     * 
     * @returns {Promise<void>} Representación del terminado con éxito de una operación asíncrona.
     */
    const loadUserData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No hay token disponible");
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/v1/users/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los datos del usuario");
        }

        const userData = await response.json();
        setTempUser({
          username: userData.userName || '',
          firstName: userData.nombre || '',
          lastName: userData.apPaterno || '',
          motherLastName: userData.apMaterno || '',
          email: userData.correo || '',
        });
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
      }
    };

    loadUserData();
  }, []);

  /**
   * Manejador de guardado.
   * 
   * @apicall PUT - `"http://localhost:8080/v1/users/me"`
   * 
   * @returns {Promise<void>} Representación del terminado con éxito de una operación asíncrona.
   */
  const handleSave = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No hay token disponible");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/v1/users/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: tempUser.username,
          nombre: tempUser.firstName,
          apPaterno: tempUser.lastName,
          apMaterno: tempUser.motherLastName,
          correo: tempUser.email
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el usuario");
      }

      const updatedUser = await response.json();
      
      // Actualizar sessionStorage si es necesario
      sessionStorage.setItem("correo", updatedUser.correo);
      sessionStorage.setItem("nombre", updatedUser.nombre);
      sessionStorage.setItem("apPaterno", updatedUser.apPaterno);
      sessionStorage.setItem("apMaterno", updatedUser.apMaterno);
      sessionStorage.setItem("userName", updatedUser.userName);
      
      navigate('/profile');
    } catch (error) {
      console.error("Error en la actualización:", error);
    }
  };

  /**
   * Manejador ante cancelado.
   * 
   * @beta
   */
  const handleCancel = () => {
    navigate('/profile');
  };

  /**
   * Manejador ante cambio.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio.
   * 
   * @eventProperty
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempUser({
      ...tempUser,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container className="edit-profile-container edit-profile-centered">
      <div className="edit-profile-main-content">
        <Card className="edit-profile-card">
          <Card.Body className="edit-profile-form">
            <div className="edit-profile-header">
              <h2 className="fw-bold">Editar Perfil</h2>
              <p className="text-muted">Actualiza tu información personal</p>
            </div>

            <Form.Group className="mb-4">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={tempUser.firstName}
                onChange={handleChange}
                placeholder="Nombre"
                className="mb-2"
              />
              <Form.Control
                type="text"
                name="lastName"
                value={tempUser.lastName}
                onChange={handleChange}
                placeholder="Apellido paterno"
                className="mb-2"
              />
              <Form.Control
                type="text"
                name="motherLastName"
                value={tempUser.motherLastName}
                onChange={handleChange}
                placeholder="Apellido materno"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={tempUser.username}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={tempUser.email}
                onChange={handleChange}
              />
            </Form.Group>
            <div className="edit-profile-actions">
                <Button variant="primary" className="btn-save" onClick={handleSave}>
                    Guardar cambios
                </Button>
                <Button variant="outline" className="btn-cancel" onClick={handleCancel}>
                    Cancelar
                </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

/**
 * @module edit-profile
 * 
 * Lay-out para la edición de datos de perfil.
 */
export default EditProfile;