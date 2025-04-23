import React, { useState, useRef } from 'react';
import { Modal, Button, Form, Carousel, Spinner } from 'react-bootstrap';
import { XCircle, GeoAlt, Upload } from 'react-bootstrap-icons';

interface ReportIncidentModalProps {
  show: boolean;
  onHide: () => void;
}

const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({ show, onHide }) => {
  // Estados del modal
  const [step, setStep] = useState<'category' | 'details'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Categorías temporales (simulando backend)
  const categories = [
    { id: '1', name: 'Bache en la vía', icon: '🕳️' },
    { id: '2', name: 'Alumbrado público', icon: '💡' },
    { id: '3', name: 'Basura acumulada', icon: '🗑️' },
    { id: '4', name: 'Fuga de agua', icon: '💧' },
    { id: '5', name: 'Vandalismo', icon: '🏴‍☠️' },
    { id: '6', name: 'Otro', icon: '❓' },
  ];

  // Manejar selección de categoría
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setStep('details');
  };

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

  // Enviar reporte
  const handleSubmit = () => {
    setIsLoading(true);
    // Simular envío al backend
    setTimeout(() => {
      setIsLoading(false);
      onHide();
      resetForm();
    }, 2000);
  };

  // Resetear formulario al cerrar
  const resetForm = () => {
    setStep('category');
    setSelectedCategory(null);
    setDescription('');
    setPhotos([]);
    setUseCurrentLocation(false);
    setAddress('');
  };

  // Manejar cierre del modal
  const handleClose = () => {
    resetForm();
    onHide();
  };

  return (
    <Modal className="custom-modal" show={show} onHide={handleClose} size="lg" centered style={{ zIndex: 900000 }}>
      <Modal.Header closeButton>
        <Modal.Title>
          {step === 'category' ? 'Selecciona una categoría' : 'Detalles del incidente'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {/* Paso 1: Selección de categoría */}
        {step === 'category' && (
          <div className="category-selection">
            <div className="row">
              {categories.map((category) => (
                <div key={category.id} className="col-4 mb-3">
                  <div 
                    className={`category-card text-center p-3 rounded-circle ${selectedCategory === category.id ? 'bg-primary text-white' : 'bg-light'}`}
                    style={{ cursor: 'pointer', height: '100px', width: '100px', margin: '0 auto' }}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <div style={{ fontSize: '24px' }}>{category.icon}</div>
                    <div style={{ fontSize: '12px' }}>{category.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Paso 2: Detalles del incidente */}
        {step === 'details' && (
          <div className="incident-details">
            <Form.Group className="mb-4">
              <Form.Label>Descripción del incidente</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el incidente con detalle..."
              />
            </Form.Group>
            
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
            
            <Form.Group className="mb-3">
              <Form.Label>Ubicación</Form.Label>
              <div className="d-flex flex-column gap-2">
                <Button
                  variant={useCurrentLocation ? 'primary' : 'outline-primary'}
                  onClick={() => setUseCurrentLocation(!useCurrentLocation)}
                >
                  <GeoAlt className="me-2" />
                  {useCurrentLocation ? 'Usando ubicación actual' : 'Utilizar ubicación actual'}
                </Button>
                
                <div className="text-center">o</div>
                
                <Form.Control
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ingresar una dirección"
                  disabled={useCurrentLocation}
                />
              </div>
            </Form.Group>
          </div>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        {step === 'details' && (
          <Button variant="secondary" onClick={() => setStep('category')}>
            Volver
          </Button>
        )}
        
        {step === 'category' ? (
          <Button 
            variant="primary" 
            disabled={!selectedCategory}
            onClick={() => setStep('details')}
          >
            Siguiente
          </Button>
        ) : (
          <Button 
            variant="primary" 
            disabled={!description || (!useCurrentLocation && !address)}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Enviando...</span>
              </>
            ) : 'Reportar Incidente'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ReportIncidentModal;