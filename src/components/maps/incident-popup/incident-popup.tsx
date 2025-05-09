import React, { useState } from 'react';
import { IncidentDTO } from '../../../models/dto-incident';
import { Popup } from 'react-leaflet';
import { FaComment, FaRegComment, FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa';
import { ChangeStatus } from './change-status/change-status';
import './incident-popup.css'; 

interface IncidentPopupProps {
  incident: IncidentDTO;
  onClose: () => void;
}

export const IncidentPopup: React.FC<IncidentPopupProps> = ({ incident, onClose }) => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const handleStatusChange = (newStatus: string, evidenceFiles: File[]) => {
    // Aquí va la lógica para enviar el reporte al backend
    console.log("Nuevo estado:", newStatus, "Evidencia:", evidenceFiles);
  };

  const handleLikeClick = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

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
          <a href="/#" className="category-link">{incident.nombre}</a>  
        </div>
    
        <div className="popup-content">
          <p><strong>Fecha:</strong> {new Date(incident.fecha).toLocaleDateString()}</p>
          <p><strong>Ubicación:</strong> {incident.latitud.toFixed(4)}, {incident.longitud.toFixed(4)}</p>
        </div>
        
        <div className="popup-footer" style={{ zIndex: 900000 }}>
        <button className="change-status-report" onClick={() => setShowStatusModal(true)}>
          Cambio de estado
        </button>
          <div className="popup-icons-left">
            <span className="like-container" onClick={handleLikeClick}>
              {isLiked ? (
                <FaThumbsUp className="incident-popup-like liked" />
              ) : (
                <FaRegThumbsUp className="incident-popup-like" />
              )}
              <span className="like-count">{likes}</span>
            </span>
            <FaRegComment className="incident-popup-comment" />
          </div>
        </div>
      </div>

      <ChangeStatus show={showStatusModal} onHide={() => setShowStatusModal(false)}/>
    </Popup>
  );
};