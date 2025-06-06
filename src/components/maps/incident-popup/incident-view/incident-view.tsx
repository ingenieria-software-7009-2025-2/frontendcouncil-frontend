import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IncidentDTO } from '../../../../models/dto-incident';
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
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [calle, setCalle] = useState<string>('Cargando...');
  const [colonia, setColonia] = useState<string>('Cargando...');
  const [ciudad, setCiudad] = useState<string>('Cargando...');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const userEmail = sessionStorage.getItem('correo');
  
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

  return (
    <Modal show={mostrar} onHide={onHide} centered backdrop="static" size="lg" style={{ zIndex: 900000 }}>
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
        <div className="row mb-3">
          <div className="col-md-6">
            {/** Aquí van las fotos */}
          </div>
          <div className="col-md-6">
            <p><strong>Descripción:</strong></p> <p> {incident.descripcion}</p>
          </div>
        </div>

      </Modal.Body>
    </Modal>
  );
};

export default ModalFullIncidentView;