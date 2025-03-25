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
  const [user, setUser] = useState<UserProfile>({
    username: 'username',
    firstName: 'Nombre',
    lastName: 'Apellido',
    motherLastName: 'Apellido',
    email: 'correo_ejemplo@gmail.com',
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
    <Container fluid className="user-profile-container p-0">
      <Card className="profile-card">
        <Card.Body>
          <Row>
            <Col md={5}>
              {isEditing ? (
                <>
                  <Form.Group className="mb-4">
                  <h4 className="mb-0 fw-bold">Editar cuenta</h4>
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
                    <Button variant="outline-primary" onClick={handleEdit} className="edit-profile-button"> <Pencil className="me-2"/> Editar</Button>
                  </div>

                  <div className="profile-info mb-4 py-2">
                    <div className="d-flex align-items-center mb-2">
                      <Envelope className="me-2 text-muted" />
                      <span>{user.email}</span>
                    </div>
                    <div className="d-flex align-items-center mb-2 py-2">
                      <Person className="me-2 fw-semiboldfw-semibold" />
                      <span>{user.username}</span>
                    </div>
                    <div className="d-flex align-items-center mb-2 py-2">
                    <Button 
                      variant="link" 
                      className="text-start p-0 text-decoration-none text-body"
                      onClick={handleChangePassword}>
                      <div className="d-flex align-items">
                        <Lock className="me-2" />
                        <span>Cambiar contraseña</span>
                      </div>
                    </Button>
                    </div>
                    <div className="d-flex align-items-center mb-2 py-2">
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
                  </div>

                </>
              )}
            </Col>
            <Col md={1}></Col>
            <Col md={6}>
              <div className="incidents-section">
                <h5 className="d-flex align-items-center mb-4">
                  <ExclamationTriangle className="me-2 field-icon" /> Tus Reportes
                </h5>
                <Row className="mb-4 text-center"></Row>
                {/* Sección de estadísticas */}
                <Row className="mb-4 text-center">
                  <Col md={4}>
                    <div className="incident-stat-card">
                      <h3 className="stat-number">0</h3>
                      <p className="stat-label">Reportados</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="incident-stat-card">
                      <h3 className="stat-number">0</h3>
                      <p className="stat-label">En revisión</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="incident-stat-card">
                      <h3 className="stat-number">0</h3>
                      <p className="stat-label">Resueltos</p>
                    </div>
                  </Col>
                </Row>
                <Row className="mb-4 text-center"></Row>
                
                {/* Sección de lista de incidentes con scroll */}
                <div className="incidents-list-scroll">
                  <div className="incidents-list-container">
                    <div className="no-incidents">
                      No tienes incidentes reportados
                    </div>
                </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserProfilePage;