import { useState } from 'react';
import { Card, Form, Button, Row, Col, Container } from 'react-bootstrap';
import { Pencil, Envelope, Person, Lock, ShieldLock, ExclamationTriangle } from 'react-bootstrap-icons';
import './user-profile.css';

type UserProfile = {
  username: string;
  firstName: string;
  lastName: string;
  motherLastName: string;
  email: string;
  incidents: any[]; // Tipo más específico según tu necesidad
};

const UserProfilePage = () => {
  // Datos del usuario 
  const [user, setUser] = useState<UserProfile>({
    username: 'jperez123',
    firstName: 'Juan',
    lastName: 'Pérez',
    motherLastName: 'Gómez',
    email: 'juan.perez@example.com',
    incidents: []
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState<UserProfile>({ ...user });

  const handleEdit = () => {
    setTempUser({ ...user });
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser({ ...tempUser });
    setIsEditing(false);
    // Aquí iría la llamada a la API para guardar los cambios
  };

  const handleCancel = () => {
    setIsEditing(false);
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
        <Card.Header className="profile-header">
          <h2>Perfil de Usuario</h2>
          {!isEditing ? (
            <Button variant="outline-primary" onClick={handleEdit}>
              <Pencil className="me-2" /> Editar
            </Button>
          ) : (
            <div>
              <Button variant="success" className="me-2" onClick={handleSave}>
                Guardar
              </Button>
              <Button variant="outline-secondary" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          )}
        </Card.Header>

        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="d-flex align-items-center">
                  <Person className="me-2 field-icon" /> Nombre de usuario
                </Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="username"
                    value={tempUser.username}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="profile-field-value">{user.username}</div>
                )}
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Nombre completo</Form.Label>
                {isEditing ? (
                  <>
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
                  </>
                ) : (
                  <div className="profile-field-value">
                    {`${user.firstName} ${user.lastName} ${user.motherLastName}`}
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="d-flex align-items-center">
                  <Envelope className="me-2 field-icon" /> Correo electrónico
                </Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="email"
                    name="email"
                    value={tempUser.email}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="profile-field-value">{user.email}</div>
                )}
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="d-flex align-items-center">
                  <Lock className="me-2 field-icon" /> Contraseña
                </Form.Label>
                <Button variant="outline-secondary">
                  Cambiar contraseña
                </Button>
              </Form.Group>
            </Col>

            <Col md={6}>
              <div className="incidents-section">
                <h5 className="d-flex align-items-center">
                  <ExclamationTriangle className="me-2 field-icon" /> Reporte de Incidentes
                </h5>
                {user.incidents.length === 0 ? (
                  <div className="no-incidents">
                    No hay incidentes reportados
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