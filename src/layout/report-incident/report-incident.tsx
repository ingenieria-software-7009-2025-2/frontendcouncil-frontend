import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Carousel, Spinner } from 'react-bootstrap';
import { XCircle, GeoAlt, Upload } from 'react-bootstrap-icons';
import './report-incidents.css';

class PhotoService {
  private baseUrl: string = 'http://localhost:8080/v1/photos';

  async uploadPhotos(incidentId: string, files: File[]): Promise<void> {
    const token = sessionStorage.getItem("token");
    
    await Promise.all(files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const photoBody = {
        fotoid: Array.from(new Uint8Array(arrayBuffer)),
        incidenteid: incidentId
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(photoBody)
      });

      if (!response.ok) {
        throw new Error(`Error al subir foto: ${response.status}`);
      }
    }));
  }
}

interface ReportIncidentModalProps {
  show: boolean;
  onHide: () => void;
  mapLocation?: { lat: number; lng: number };
  isMapSelected?: boolean;
}

const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({ 
  show, 
  onHide, 
  mapLocation, 
  isMapSelected = false 
}) => {
  const [step, setStep] = useState<'category' | 'details'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]); 
  const [hour, setHour] = useState<string>(new Date().toTimeString().split(' ')[0].substring(0, 8));
  const [photos, setPhotos] = useState<File[]>([]);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [address, setAddress] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [locationLocked, setLocationLocked] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoService = new PhotoService();

  useEffect(() => {
    if (mapLocation && isMapSelected) {
      setLatitud(mapLocation.lat.toString());
      setLongitud(mapLocation.lng.toString());
      setLocationLocked(true);
    }
  }, [mapLocation, isMapSelected]);

  const categories = [
    { id: '1', name: 'Bache en la vía', icon: '🕳️' },
    { id: '2', name: 'Alumbrado público', icon: '💡' },
    { id: '3', name: 'Basura acumulada', icon: '🗑️' },
    { id: '4', name: 'Fuga de agua', icon: '💧' },
    { id: '5', name: 'Vandalismo', icon: '🏴‍☠️' },
    { id: '6', name: 'Otro', icon: '❓' },
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setStep('details');
  };

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

  const handleSubmit = async () => {
    if (!latitud || !longitud) {
      alert('Por favor ingresa una ubicación válida');
      return;
    }

    setIsLoading(true);
    
    const reportData = {
      token: '043fbb63-e370-40ea-a0b0-50889681f546', 
      nombre: name,
      descripcion: description,
      fecha: date, 
      hora: hour, 
      latitud: latitud, 
      longitud: longitud,
    };

    try {
      const token1 = sessionStorage.getItem("token");
      
      // 1. Crear el incidente
      const incidentResponse = await fetch('http://localhost:8080/v1/incident', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token1}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportData)
      });

      if (!incidentResponse.ok) {
        const errorData = await incidentResponse.json();
        throw new Error(errorData.message || 'Error al enviar el incidente');
      }

      const incidentData = await incidentResponse.json();
      const incidentId = String (incidentData.id);

      // 2. Subir fotos si existen
      if (photos.length > 0) {
        try {
          await photoService.uploadPhotos(incidentId, photos);
        } catch (photoError) {
          console.error('Error al subir fotos:', photoError);
          alert('Incidente creado pero hubo errores al subir las fotos');
        }
      }

      alert('Incidente reportado correctamente');
      resetForm();
      onHide();
    } catch (error) {
      console.error('Error general:', error);
      alert(error.message || 'Ocurrió un error al enviar el incidente');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep('category');
    setSelectedCategory(null);
    setName('');
    setDescription('');
    setPhotos([]);
    setUseCurrentLocation(false);
    setAddress('');
    setLatitud(''); 
    setLongitud('');
    setLocationLocked(false);

    const now = new Date();
    setDate(now.toISOString().split('T')[0]);
    setHour(now.toTimeString().split(' ')[0].substring(0, 8));
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  return (
    <Modal className="custom-modal-r" show={show} onHide={handleClose} size="lg" centered style={{ zIndex: 900000 }}>
      <Modal.Header closeButton> </Modal.Header>
      
      <Modal.Body>
        <h2 className="select-category-title">
          {step === 'category' ? 'Selecciona una categoría' : 'Detalles del incidente'}
        </h2>
        
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
        
        {step === 'details' && (
          <div className="incident-details">
            <Form.Group className="mb-4">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del incidente"
              />
            </Form.Group>
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
                <p>Haz clic para subir fotos</p>
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
            
            <Form.Group className="mb-3">
              <Form.Label>Ubicación</Form.Label>
              {locationLocked && (
                <div className="alert alert-info mb-3">
                  <GeoAlt className="me-2" />
                  Ubicación seleccionada desde el mapa (no editable)
                </div>
              )}
              <div className="d-flex flex-column gap-2">
                <div className="row g-2">
                  <div className="col-md-6">
                    <Form.Control
                      type="number"
                      value={latitud}
                      onChange={(e) => setLatitud(e.target.value)}
                      placeholder="Latitud (ej: 19.4326)"
                      step="any"
                      readOnly={locationLocked}
                      disabled={locationLocked}
                    />
                  </div>
                  <div className="col-md-6">
                    <Form.Control
                      type="number"
                      value={longitud}
                      onChange={(e) => setLongitud(e.target.value)}
                      placeholder="Longitud (ej: -99.1332)"
                      step="any"
                      readOnly={locationLocked}
                      disabled={locationLocked}
                    />
                  </div>
                </div>
              </div>
            </Form.Group>
          </div>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        {step === 'details' && (
          <Button className='btn-back' onClick={() => setStep('category')}>
            Volver
          </Button>
        )}
        
        {step === 'category' ? (
          <Button 
            className="btn-send-status" 
            disabled={!selectedCategory}
            onClick={() => setStep('details')}
          >
            Siguiente
          </Button>
        ) : (
          <Button 
            className="btn-send-status" 
            onClick={handleSubmit}
            disabled={!latitud || !longitud}
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