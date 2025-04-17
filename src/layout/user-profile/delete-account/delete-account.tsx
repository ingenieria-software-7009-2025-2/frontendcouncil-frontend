import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';

interface ModalDeleteAccount {
  mostrar: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

const ModalDeleteAccount: React.FC<ModalDeleteAccount> = ({
  mostrar,
  onConfirmar,
  onCancelar
}) => {
  return (
    <Modal show={mostrar} onHide={onCancelar} centered backdrop="static" dialogClassName="modal-superior">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center">
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <ExclamationTriangleFill className="text-warning" size={48} />
        <h4 className="mb-3 fw-bold">Eliminar cuenta</h4>
        <p className="text-muted">
          Esta acción eliminará permanentemente todos tus datos, historial y contenido asociado.
          <br />
          <strong>No podrás recuperar tu cuenta después de esto.</strong>
        </p>
        <input
            type={'password'}
            className={`form-control custom-input pe-4`}
            id="passwordLogin"
            name="password"
            placeholder="Para continuar ingresa tu contraseña"/>
        <h4 className="question">¿Estás seguro de eliminar tu cuenta?</h4>
        
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-center">
        <Button variant="outline-secondary" onClick={onCancelar} className="px-4">
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirmar} className="px-4">
          Sí, eliminar cuenta
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDeleteAccount;