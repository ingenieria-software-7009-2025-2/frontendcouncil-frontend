import { useState } from 'react';
import { Modal, Form, Button, InputGroup } from 'react-bootstrap';
import { Lock } from 'react-bootstrap-icons';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './change-password.css'

type ChangePasswordModalProps = {
  show: boolean;
  onHide: () => void;
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void>;
};

export const ChangePasswordModal = ({ show, onHide, onSubmit }: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleShowPassword = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      return setError('Las contraseñas nuevas no coinciden');
    }

    try {
      setIsLoading(true);
      await onSubmit(currentPassword, newPassword);
      onHide();
      // Limpiar formulario después de enviar
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" style={{ zIndex: 900000 }} className="custoom-modal">
      <Modal.Header closeButton className="border-0 pb-0"></Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <h2 className="change-password-title"><Lock size={25} className='lock-icon'/> CAMBIAR CONTRASEÑA </h2>
        <Modal.Body>
          {error && (
            <div className="alert alert-danger text-center">
              {error}
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label className="input-label">Contraseña actual</Form.Label>
            <InputGroup>
              <input
                type={showPassword.current ? 'text' : 'password'}
                className={`form-control custom-input pe-4` }
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="Ingresa tu contraseña actual"/>
              <span
                className="position-absolute top-50 end-0 translate-middle-y me-2"
                style={{cursor: 'pointer', color: '#9aaaba'} } onClick={() => toggleShowPassword('current')}>
                {showPassword.current ? <FaEyeSlash /> : <FaEye />}
              </span>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="input-label">Nueva contraseña</Form.Label>
            <InputGroup>
              <input
                type={showPassword.new ? 'text' : 'password'}
                className={`form-control custom-input pe-4` }
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Mínimo 8 caracteres"/>
              <span
                className="position-absolute top-50 end-0 translate-middle-y me-2"
                style={{cursor: 'pointer', color: '#9aaaba'}} onClick={() => toggleShowPassword('new')}>
                {showPassword.new ? <FaEyeSlash /> : <FaEye />}
              </span>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="input-label">Confirmar nueva contraseña</Form.Label>
            <InputGroup>
              <input
                type={showPassword.confirm ? 'text' : 'password'}
                className={`form-control custom-input pe-4` }
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repite la nueva contraseña"/>
              <span
                className="position-absolute top-50 end-0 translate-middle-y me-2"
                style={{cursor: 'pointer', color: '#9aaaba'}} onClick={() => toggleShowPassword('confirm')}>
                {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </InputGroup>
          </Form.Group>

          <div className="password-requirements mt-4">
            <p className="small text-muted mb-1">La contraseña debe contener:</p>
            <ul className="small text-muted ps-3">
              <li className={newPassword.length >= 8 ? 'text-success' : ''}>
                Mínimo 8 caracteres
              </li>
               <li className={newPassword.length >= 8 ? 'text-success' : ''}>
                Un número
              </li>
              <li className={newPassword.length >= 8 ? 'text-success' : ''}>
                Una mayúscula
              </li>
              <li className={newPassword.length >= 8 ? 'text-success' : ''}>
                Un caracter especial: !@#$%^&*(),.?":{}|
              </li>
            </ul>
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          <Button 
            className="btn-send-status"
            type="submit"
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}>
            {isLoading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};