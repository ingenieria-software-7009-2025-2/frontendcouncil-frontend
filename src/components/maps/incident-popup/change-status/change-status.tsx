import React, { useState, useRef } from 'react';
import { Modal, Button, Form, Carousel, ButtonGroup } from 'react-bootstrap';
import { XCircle, Upload } from 'react-bootstrap-icons';
import { useSwalMessages } from '../../../../shared/swal-messages';
import './change-status.css';

interface ChangeStatusProps {
  show: boolean;
  onHide: () => void;
}

export const ChangeStatus: React.FC<ChangeStatusProps> = ({ show, onHide }) => {
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [photos, setPhotos] = useState<File[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { successMessage } = useSwalMessages();
    
    const handleClose = () => {
        onHide();
    };

    const handleSubmit = () => {
        console.log('Opción seleccionada:', selectedOption);
        onHide();
        successMessage('¡Su reporte ha sido enviado! Gracias por su colaboración, nuestros administradores lo están revisando.');
    }

    const handleOptionSelect = (option: string) => {
        setSelectedOption(option);
    }

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          const newPhotos = Array.from(e.target.files);
          setPhotos([...photos, ...newPhotos]);
        }
    };
    
    const handleRemovePhoto = (index: number) => {
        const newPhotos = [...photos];
        newPhotos.splice(index, 1);
        setPhotos(newPhotos);
        if (activeIndex >= newPhotos.length) {
            setActiveIndex(newPhotos.length - 1);
        }
    };
    
    return (
    <Modal show={show} onHide={handleClose} centered style={{ zIndex: 900000 }} className="custoom-modal">
      <Modal.Header closeButton> </Modal.Header>
      <Modal.Body>
        <Form>
          <h2 className="change-status-title">NOTIFICAR CAMBIO DE ESTADO</h2>
          <div className="select-status mb-3">
            <Form.Label>Seleccione el nuevo estado del incidente:</Form.Label>
            <ButtonGroup className="w-100 mt-2">
              <Button className={`status-button me-2 ${selectedOption === "Reportado" ? "btn-custom-selected" : "btn-custom-unselected"}`}
                onClick={() => handleOptionSelect("Reportado")}>
                Reportado
              </Button>
              <Button className={`status-button mx-2 ${selectedOption === "En revisión" ? "btn-custom-selected" : "btn-custom-unselected"}`}
                onClick={() => handleOptionSelect("En revisión")}>
                En revisión
              </Button>
              <Button className={`status-button ms-2 ${selectedOption === "Resuelto" ? "btn-custom-selected" : "btn-custom-unselected"}`}
                onClick={() => handleOptionSelect("Resuelto")}>
                Resuelto
              </Button>
            </ButtonGroup>
          </div>
        </Form>

        <Form.Group className="mb-4">
          <Form.Label>Fotos (opcional)</Form.Label>
            <div className="border rounded p-3 text-center" style={{ cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
              <Upload size={24} className="mb-2" />
              <p>Haz clic para subir fotos </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                multiple
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
              
            {photos.length > 0 && (
              <div className="mt-3">
                <Carousel controls={false} indicators={false} interval={null}>
                  {photos.map((photo, index) => (
                    <Carousel.Item key={index}>
                      <div className="position-relative" style={{ height: '150px' }}>
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Foto ${index + 1}`}
                          className="d-block w-100 h-100"
                          style={{ objectFit: 'cover' }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0 m-1"
                          onClick={() => handleRemovePhoto(index)}
                          style={{ borderRadius: '50%' }}
                        >
                          <XCircle />
                        </Button>
                      </div>
                      </Carousel.Item>
                  ))}
                </Carousel>
              </div>
            )}
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-send-status" onClick={handleSubmit}>
          Enviar solicitud
        </Button>
      </Modal.Footer>
    </Modal>
  );
};