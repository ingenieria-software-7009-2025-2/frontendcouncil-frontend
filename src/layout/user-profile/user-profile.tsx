import { useState } from 'react';
import { Card, Button, Row, Col, Container, Modal } from 'react-bootstrap';
import { Pencil, Envelope, Person, Lock, ExclamationTriangle, Trash } from 'react-bootstrap-icons';
import { href, Link, useNavigate } from 'react-router-dom';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';
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
  const [user] = useState<UserProfile>({
    username: 'username',
    firstName: 'Nombre',
    lastName: 'Apellido',
    motherLastName: 'Apellido',
    email: 'correo_ejemplo@gmail.com',
    incidents: []
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = () => {
    // Lógica para cambiar contraseña
    console.log('Cambiar contraseña');
  };

  const handleDeleteAccount = () => {
    // Lógica para eliminar una cuenta 
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    console.log('Cuenta eliminada');
    setShowDeleteModal(false);
    // Manejar el eliminar la cuenta con la BD
    navigate('/');
  };

  return (
    <Container fluid className="user-profile-container p-0">
      <Card className="profile-card">
        <Card.Body>
          <Row>
            <Col md={5}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0 fw-bold">
                  {`${user.firstName} ${user.lastName} ${user.motherLastName}`}
                </h4>
                <Link to="/edit-profile" className="btn btn-outline-primary edit-profile-button">
                  <Pencil className="me-2"/> Editar
                </Link>
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

      {/* Modal de confirmación para eliminar cuenta */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered backdrop="static">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="w-100 text-center">
            <ExclamationTriangleFill className="text-warning" size={48} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h4 className="mb-3 fw-bold">¿Estás seguro de eliminar tu cuenta?</h4>
          <p className="text-muted">
            Esta acción eliminará permanentemente todos tus datos, historial y contenido asociado.
            <br />
            <strong>No podrás recuperar tu cuenta después de esto.</strong>
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)} className="px-4">
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDeleteAccount} className="px-4">
            Sí, eliminar cuenta
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserProfilePage;