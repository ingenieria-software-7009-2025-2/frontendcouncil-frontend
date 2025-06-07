import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';
import { FaEye, FaEyeSlash, FaPlus, FaTimes } from 'react-icons/fa';
import { IncidentDTO } from '../../../../models/dto-incident';
import { PhotoDTO } from '../../../../models/dto-photo';
import { PhotoService } from '../../../../services/photo.service';
import './incidentview.css'

interface ModalFullIncidentViewProps {
  mostrar: boolean;
  onHide: () => void;
  incident: IncidentDTO;
}

const ModalFullIncidentView: React.FC<ModalFullIncidentViewProps> = ({
  mostrar, 
  onHide,
  incident,
}) => {
  const [error, setError] = useState('');
  const [calle, setCalle] = useState<string>('Cargando...');
  const [colonia, setColonia] = useState<string>('Cargando...');
  const [ciudad, setCiudad] = useState<string>('Cargando...');
  const [photos, setPhotos] = useState<PhotoDTO[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photoService = new PhotoService();
  
  useEffect(() => {
    const fetchDireccion = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${incident.latitud}&lon=${incident.longitud}`
        );
        
        if (!response.ok) {
          throw new Error('Error al obtener la dirección');
        }
        
        const data = await response.json();
        const address = data.address || {};
  
        setCalle(address.road || address.pedestrian || address.path || 'No disponible');
        setColonia(address.neighbourhood || address.suburb || address.village || 'No disponible');
        setCiudad(address.city || address.town || address.village || address.county || 'No disponible');
      } catch (error) {
        console.error('Error al obtener la dirección:', error);
        setCalle('No disponible');
        setColonia('No disponible');
        setCiudad('No disponible');
      }
    };
  
    if (incident.latitud && incident.longitud) {
      fetchDireccion();
    }
  }, [incident.latitud, incident.longitud]);

  useEffect(() => {
    if (mostrar && incident.incidenteid) {
      loadPhotos();
    }
  }, [mostrar, incident.incidenteid]);

  const loadPhotos = async () => {
    try {
      const idString = String(incident.incidenteid);
      const photos = await photoService.getPhotosByIncident(idString);
      setPhotos(photos);
    } catch (error) {
      console.error('Error al cargar fotos:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      try {
        const file = e.target.files[0];
        const idString = String (incident.incidenteid);
        const uploadedPhoto = await photoService.uploadPhoto(idString, file);
        setPhotos([...photos, uploadedPhoto]);
      } catch (error) {
        console.error('Error al subir foto:', error);
        setError('Error al subir la foto');
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset input para permitir subir el mismo archivo otra vez
        }
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Convertir Uint8Array a base64 para mostrar las imágenes
  const byteArrayToBase64 = (bytes: Uint8Array): string => {
  const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
  return window.btoa(binary);
};

  return (
    <Modal show={mostrar} onHide={onHide} centered backdrop="static" dialogClassName="modal-wide" style={{ zIndex: 900000 }}>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center"> </Modal.Title>
      </Modal.Header>
      <span className="commments-title mb-2 fw-bold">{incident.nombre}</span>
      <div className="incident-info">
        <p className="location">{ciudad}, {colonia}, {calle}</p>
        <p className="date-style">
            <strong>Fecha: </strong> 
            {new Date(incident.fecha).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            }).replace(/\//g, '-')}
        </p>
        <p className={`status-badge ${incident.estado.toLowerCase().replace(/\s+/g, '-')}`}>
            <span className="status-bullet"></span>
            <span className="status-text">{incident.estado}</span>
        </p>
      </div>
      <Modal.Body>
        {error && (
          <div className="alert alert-danger">
            <ExclamationTriangleFill className="me-2" />
            {error}
          </div>
        )}
        <div className="row mb-3">
          <div className="col-md-6">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            
            {photos.length > 0 ? (
              <div className="photo-gallery">
                <div className="row">
                  {photos.map((photo, index) => (
                    <div key={index} className="col-6 mb-3 position-relative">
                      <img 
                        src={`data:image/jpeg;base64,${byteArrayToBase64(photo.fotoid)}`} 
                        alt={`Foto del incidente ${incident.incidenteid}`}
                        className="img-thumbnail"
                        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
                <div className="text-center mt-2">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={triggerFileInput}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Subiendo...' : 'Agregar más fotos'}
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="photo-upload-area"
                style={{
                  backgroundColor: '#f0f0f0',
                  borderRadius: '8px',
                  padding: '20px',
                  height: '250px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  border: '2px dashed #ccc',
                  position: 'relative',
                  cursor: 'pointer'
                }}
                onClick={triggerFileInput}
              >
                <div style={{ marginBottom: '15px' }}>
                  No hay fotos disponibles
                </div>
                <div 
                  className="upload-box"
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d0d0d0'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                >
                  <FaPlus size={24} style={{ marginBottom: '5px' }} />
                  <span style={{ fontSize: '12px' }}>Subir fotos</span>
                </div>
                {isUploading && (
                  <div className="mt-2">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Subiendo...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="col-md-6">
            <p><strong>Descripción:</strong></p> 
            <p>{incident.descripcion}</p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalFullIncidentView;