import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Carousel, Spinner } from 'react-bootstrap';
import { XCircle, GeoAlt, Upload } from 'react-bootstrap-icons';
import { PhotoService } from '../../services/photo.service';
import './report-incidents.css'

interface ReportIncidentModalProps {
  show: boolean;
  onHide: () => void;
  mapLocation?: { lat: number; lng: number }; // Nuevo prop para ubicación desde mapa
  isMapSelected?: boolean; // Indica si la ubicación viene del mapa
}

const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({ 
  show, 
  onHide, 
  mapLocation, 
  isMapSelected = false 
}) => {
  // Estados del modal
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
  const [locationLocked, setLocationLocked] = useState(false); // Nuevo estado para bloquear ubicación
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Efecto para actualizar las coordenadas cuando cambia mapLocation
  useEffect(() => {
    if (mapLocation && isMapSelected) {
      setLatitud(mapLocation.lat.toString());
      setLongitud(mapLocation.lng.toString());
      setLocationLocked(true); // Bloquear la edición de ubicación
    }
  }, [mapLocation, isMapSelected]);

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
  const handleSubmit = async () => {
    setIsLoading(true);
  
    const reportData = {
      token: '043fbb63-e370-40ea-a0b0-50889681f546', 
      nombre: name,
      descripcion: description,
      fecha: date, 
      hora: hour, 
      latitud: latitud, 
      longitud: longitud,
      categoriaid: (selectedCategory != null) ? parseInt(selectedCategory) : 6,
    };

    console.log(reportData);
  
    try {
      const token1 = sessionStorage.getItem("token")
      const response = await fetch('http://localhost:8080/v1/incident', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token1}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportData)
      });
  
      if (!response.ok) {
        throw new Error('Error al enviar el incidente');
      }
      const incidentData = await response.json();
      const incidentId = incidentData.incidenteid;

    // 2. Subir cada foto asociada al incidente
    if (photos.length > 0) {
      const photoService = new PhotoService();
      const uploadPromises = photos.map(photo => 
        photoService.uploadPhoto(incidentId, photo)
      );
      
      await Promise.all(uploadPromises);
    }

    alert('Incidente reportado correctamente con las fotos');
    resetForm();
    onHide();
  } catch (error) {
    console.error(error);
    alert('Ocurrió un error al enviar el incidente o las fotos');
  } finally {
    setIsLoading(false);
  }
};
  
  // Resetear formulario al cerrar
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
    setLocationLocked(false); // Desbloquear ubicación al resetear

    const now = new Date();
    setDate(now.toISOString().split('T')[0]);
    setHour(now.toTimeString().split(' ')[0].substring(0, 8));
  };

  // Manejar cierre del modal
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
              {locationLocked && (
                <div className="alert alert-info mb-3">
                  <GeoAlt className="me-2" />
                  Ubicación seleccionada desde el mapa (no editable)
                </div>
              )}
              <div className="d-flex flex-column gap-2">
                {/* Fila para latitud y longitud */}
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
            disabled={!latitud || !longitud} // Deshabilitar si no hay ubicación
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