import { useState } from 'react';
import { Modal, Form, Button, InputGroup } from 'react-bootstrap';
import { Eye, EyeSlash, Lock } from 'react-bootstrap-icons';

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
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center">
          <Lock size={32} className="text-primary mb-3" />
          <h4 className="fw-bold">Cambiar contraseña</h4>
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <div className="alert alert-danger text-center">
              {error}
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Contraseña actual</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword.current ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="Ingresa tu contraseña actual"
              />
              <Button 
                variant="outline-secondary"
                onClick={() => toggleShowPassword('current')}
              >
                {showPassword.current ? <EyeSlash /> : <Eye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nueva contraseña</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword.new ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Mínimo 8 caracteres"
              />
              <Button 
                variant="outline-secondary"
                onClick={() => toggleShowPassword('new')}
              >
                {showPassword.new ? <EyeSlash /> : <Eye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirmar nueva contraseña</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword.confirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repite la nueva contraseña"
              />
              <Button 
                variant="outline-secondary"
                onClick={() => toggleShowPassword('confirm')}
              >
                {showPassword.confirm ? <EyeSlash /> : <Eye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <div className="password-requirements mt-4">
            <p className="small text-muted mb-1">La contraseña debe contener:</p>
            <ul className="small text-muted ps-3">
              <li className={newPassword.length >= 8 ? 'text-success' : ''}>
                Mínimo 8 caracteres
              </li>
            </ul>
          </div>
        </Modal.Body>
        
        <Modal.Footer className="border-0 justify-content-center">
          <Button 
            variant="outline-secondary" 
            onClick={onHide}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
          >
            {isLoading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};