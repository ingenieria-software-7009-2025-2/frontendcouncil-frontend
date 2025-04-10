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
    <Modal show={mostrar} onHide={onCancelar} centered backdrop="static">
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