import { useState } from 'react';
import { Card, Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './edit-profile.css';

type UserProfile = {
  username: string;
  firstName: string;
  lastName: string;
  motherLastName: string;
  email: string;
};

const EditProfile = () => {
  const navigate = useNavigate();
  const [tempUser, setTempUser] = useState<UserProfile>({
    username: 'username',
    firstName: 'Nombre',
    lastName: 'Apellido',
    motherLastName: 'Apellido',
    email: 'correo_ejemplo@gmail.com',
  });

  const handleSave = () => {
    console.log('Guardando cambios:', tempUser);
    navigate('/profile');
  };

  const handleCancel = () => {
    navigate('/profile');
  };

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

export default EditProfile;