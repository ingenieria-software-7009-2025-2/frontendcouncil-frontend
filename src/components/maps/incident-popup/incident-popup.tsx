import React from 'react';
import { IncidentDTO } from '../../../models/dto-incident';
import { Popup } from 'react-leaflet';
import './incident-popup.css'; // Archivo CSS personalizado

interface IncidentPopupProps {
  incident: IncidentDTO;
  onClose: () => void;
}

export const IncidentPopup: React.FC<IncidentPopupProps> = ({ incident, onClose }) => {
  return (
    <Popup
      className="incident-popup-custom"
      closeButton={false}
      onClose={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="popup-container">
        <div className="popup-header">
          <button 
            type="button" 
            className="btn-close popup-close-btn" 
            onClick={onClose}
          />
        </div>
        
        <div className="popup-category">
          {incident.nombre}
        </div>

        <div className="popup-content">
          <p><strong>Fecha:</strong> {new Date(incident.fecha).toLocaleDateString()}</p>
          <p><strong>Ubicación:</strong> {incident.latitud.toFixed(4)}, {incident.longitud.toFixed(4)}</p>
        </div>
        
        <div className="popup-footer">
          <a href="#" className="popup-report-link">Ver reporte completo</a>
        </div>
      </div>
    </Popup>
  );
};