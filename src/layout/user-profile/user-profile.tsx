import { useState } from 'react';
import { Card, Form, Button, Row, Col, Container } from 'react-bootstrap';
import { Pencil, Envelope, Person, Lock, ExclamationTriangle, Trash } from 'react-bootstrap-icons';
import './user-profile.css';

type UserProfile = {
  username: string;
  firstName: string;
  lastName: string;
  motherLastName: string;
  email: string;
  incidents: any[];
};

const UserProfilePage = () => {
  const nombre = localStorage.getItem("nombre");
  const apPaterno = localStorage.getItem("apPaterno");
  const apMaterno = localStorage.getItem("apMaterno");
  const correo = localStorage.getItem("correo");
  const userName = localStorage.getItem("userName");
  const [user, setUser] = useState<UserProfile>({
    username: userName,
    firstName: nombre,
    lastName: apPaterno,
    motherLastName: apMaterno,
    email: correo,
    incidents: []
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState<UserProfile>({ ...user });

  const handleEdit = () => {
    setTempUser({ ...user });
    setIsEditing(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    console.log(token);
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
        body: JSON.stringify(tempUser),
      });
    console.log(tempUser)
      if (!response.ok) {
        throw new Error("Error al actualizar el usuario");
      }

      const updatedUser = await response.json();
      
      setUser(updatedUser);
      setIsEditing(false);
      localStorage.setItem("correo", updatedUser.correo);
      localStorage.setItem("nombre", updatedUser.nombre);
      localStorage.setItem("apPaterno", updatedUser.apPaterno);
      localStorage.setItem("apMaterno", updatedUser.apMaterno);
      localStorage.setItem("userName", updatedUser.userName);
    } catch (error) {
      console.error("Error en la actualización:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    // Lógica para cambiar contraseña
    console.log('Cambiar contraseña');
  };

  const handleDeleteAccount = () => {
    // Lógica para eliminar cuenta
    console.log('Eliminar cuenta');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempUser({
      ...tempUser,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container className="user-profile-container">
      <Card className="profile-card">
        <Card.Body>
          <Row>
            <Col md={6}>
              {isEditing ? (
                <>
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

                  <div className="d-flex mt-4">
                    <Button variant="success" className="me-2" onClick={handleSave}>
                      Guardar
                    </Button>
                    <Button variant="outline-secondary" onClick={handleCancel}>
                      Cancelar
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0 fw-bold">
                      {`${user.firstName} ${user.lastName} ${user.motherLastName}`}
                    </h4>
                    <Button variant="outline-primary" onClick={handleEdit} className="edit-profile-button"> <Pencil className="me-2"/> </Button>
                  </div>

                  <div className="profile-info mb-4">
                    <div className="d-flex align-items-center mb-2">
                      <Envelope className="me-2 text-muted" />
                      <span>{user.email}</span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <Person className="me-2 text-muted" />
                      <span>{user.username}</span>
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-2 mt-3 ps-2">
                    <Button 
                      variant="link" 
                      className="text-start p-0 text-decoration-none text-body"
                      onClick={handleChangePassword}>
                      <div className="d-flex align-items">
                        <Lock className="me-2" />
                        <span>Cambiar contraseña</span>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="link" 
                      className="text-start p-0 text-decoration-none text-danger"
                      onClick={handleDeleteAccount}>
                      <div className="d-flex align-items-center">
                        <Trash className="me-2" />
                        <span>Eliminar cuenta</span>
                      </div>
                    </Button>
                  </div>
                </>
              )}
            </Col>

            <Col md={6}>
              <div className="incidents-section">
                <h5 className="d-flex align-items-center">
                  <ExclamationTriangle className="me-2 field-icon" /> Reporte de Incidentes
                </h5>
                {user.incidents.length === 0 ? (
                  <div className="no-incidents">
                    No has reportado incidentes
                  </div>
                ) : (
                  <div className="incidents-list">
                    {/* Aquí iría la lista de incidentes */}
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserProfilePage;