import { useState } from 'react';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import { ExclamationTriangle } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import ModalDeleteAccount from './delete-account/delete-account';
import { ChangePasswordModal } from './change-password/change-password';
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

  const [tempUser, setTempUser] = useState<UserProfile>({ ...user });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate('/edit-profile');
    //setTempUser({ ...user });
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
      localStorage.setItem("correo", updatedUser.correo);
      localStorage.setItem("nombre", updatedUser.nombre);
      localStorage.setItem("apPaterno", updatedUser.apPaterno);
      localStorage.setItem("apMaterno", updatedUser.apMaterno);
      localStorage.setItem("userName", updatedUser.userName);
      window.location.reload();
    } catch (error) {
      console.error("Error en la actualización:", error);
    }
  };

  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
  };
  
  const handleCloseChangePasswordModal = () => {
    setShowChangePasswordModal(false);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempUser({
      ...tempUser,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container fluid className="user-profile-container">
      <Card className="profile-card">
        <Card.Body>
        <div className="logo-picture">
          <img src={logo} alt="Logo" onError={(e) => { e.currentTarget.src = '/default-logo.png';}}
        />
        </div>
          <Row>
            <Col md={3}>
              <div className="user-name-text  text-start"> 
                <h4 className="mb-0 fw-bold name-text">
                  {`${user.firstName} ${user.lastName} ${user.motherLastName}`}
                </h4>
                <div className="profile-info py-2">
                  <div className="user-info-item">
                    <span>{user.email}</span>
                  </div>
                  <div className="user-info-item">
                    <span>{user.username}</span>
                  </div>
                  <hr className="my-2" />
                </div>
              </div>

              <div className="profile-info  py-2">
                <div className="d-flex align-items-center mb-2 py-2">
                    <Button 
                        variant="link" 
                        className="text-start p-0 text-decoration-none text-body"
                        onClick={handleEdit}>
                        <div className="d-flex align-items">
                          <span>Editar perfil</span>
                        </div>
                      </Button>
                    </div>
                    <div className="d-flex align-items-center mb-2 py-2">
                      <Button 
                        variant="link" 
                        className="text-start p-0 text-decoration-none text-body"
                        onClick={handleChangePassword}>
                        <div className="d-flex align-items">
                          <span>Cambiar contraseña</span>
                        </div>
                      </Button>
                    </div>
                    <div className="d-flex align-items-center mb-2 py-2">
                      <Button 
                        variant="link" 
                        className="text-start p-0 text-decoration-none text-body"
                        onClick={() => navigate('/join-team')}>
                        <div className="d-flex align-items">
                          <span>Unete a nuestro equipo</span>
                        </div>
                      </Button>
                    </div>
                    <div className="d-flex align-items-center mb-2 py-2">
                      <Button 
                        variant="link" 
                        className="text-start p-0 text-decoration-none text-danger"
                        onClick={handleDeleteAccount}>
                        <div className="d-flex align-items-center">
                          <span>Eliminar cuenta</span>
                        </div>
                      </Button>
                    </div>
                  </div>
            </Col>
            <Col md={1}></Col>
            <Col md={8}>
              <div className="incidents-section">
                <h5 className="d-flex align-items-center mb-4 report-title">
                  <ExclamationTriangle className="me-2 field-icon" /> 
                  Tus Reportes
                </h5>
                <Row className="mb-4 text-center"></Row>
                {/* Sección de estadísticas */}
                <div className="stats-wrapper">
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
                </div>
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

      {/* Modal de eliminación de cuenta */}
      <ModalDeleteAccount 
        mostrar={showDeleteModal}
        onCancelar={handleCloseDeleteModal}/>

      <ChangePasswordModal 
        show={showChangePasswordModal}
        onHide={handleCloseChangePasswordModal}
        onSubmit={async () => {}}/>
    </Container>
  );
};

export default UserProfilePage;