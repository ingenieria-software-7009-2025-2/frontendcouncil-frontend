import React, { useState, useRef } from 'react';
import { Modal, Button, Form, Carousel } from 'react-bootstrap';
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
        // Lógica para manejar la opción seleccionada
        console.log('Opción seleccionada:', selectedOption);
        onHide();
        successMessage('¡Su reporte ha sido enviado! Gracias por su colaboración, nuestros administradores lo están revisando.');
    }

    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(e.target.value);
    }

    // Manejar subida de fotos
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          const newPhotos = Array.from(e.target.files);
          setPhotos([...photos, ...newPhotos]);
        }
    };
    
    // Eliminar foto
    const handleRemovePhoto = (index: number) => {
        const newPhotos = [...photos];
        newPhotos.splice(index, 1);
        setPhotos(newPhotos);
        if (activeIndex >= newPhotos.length) {
            setActiveIndex(newPhotos.length - 1);
        }
    };
    
    return (
    <Modal show={show} onHide={handleClose} centered style={{ zIndex: 900000 }}>
      <Modal.Header closeButton>
        <Modal.Title>Notificar cambio en el estado del reporte</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="mb-3">
            <Form.Label>Seleccione el nuevo estado del incidente:</Form.Label>
            <div className="ms-4">
              <Form.Check
                type="radio"
                id="option1"
                label="Reportado"
                value="Reportado"
                checked={selectedOption === "Reportado"}
                onChange={handleOptionChange}
                className="mb-2"
              />
              <Form.Check
                type="radio"
                id="option2"
                label="En revisión"
                value="En revisión"
                checked={selectedOption === "En revisión"}
                onChange={handleOptionChange}
                className="mb-2"
              />
              <Form.Check
                type="radio"
                id="option3"
                label="Resuelto"
                value="Resuelto"
                checked={selectedOption === "Resuelto"}
                onChange={handleOptionChange}
                className="mb-2"
              />
            </div>
          </div>
        </Form>

        <Form.Group className="mb-4">
              <Form.Label>Fotos (opcional)</Form.Label>
              <div 
                className="border rounded p-3 text-center"
                style={{ cursor: 'pointer' }}
                onClick={() => fileInputRef.current?.click()}
              >
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
              
              {/* Carrusel de fotos */}
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
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Enviar solicitud
        </Button>
      </Modal.Footer>
    </Modal>
  );
};