import React, { useState, useEffect } from 'react';
import { IncidentDTO } from '../../../models/dto-incident';
import { Popup } from 'react-leaflet';
import { FaRegComment, FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa';
import { ChangeStatus } from './change-status/change-status';
import { CommentSection } from './comment-section/comment-section';
import './incident-popup.css';

interface IncidentPopupProps {
  incident: IncidentDTO;
  onClose: () => void;
}

export const IncidentPopup: React.FC<IncidentPopupProps> = ({ incident, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCommentSectionModal, setShowCommentSectionModal] = useState(false);
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [comment_count, setCommentCount] = useState<number>(0);
  const [calle, setCalle] = useState<string>('...');
  const [colonia, setColonia] = useState<string>('...');
  const [ciudad, setCiudad] = useState<string>('...');

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsAuthenticated(!!token); 
  }, []);

  useEffect(() => {
    const fetchDireccion = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${incident.latitud}&lon=${incident.longitud}`
        );
        const data = await response.json();
        const address = data.address;

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

    fetchDireccion();
  }, [incident.latitud, incident.longitud]);

  const handleStatusChange = (newStatus: string, evidenceFiles: File[]) => {
    console.log("Nuevo estado:", newStatus, "Evidencia:", evidenceFiles);
  };

  const handleLikeClick = () => {
    setLikes((prev) => isLiked ? prev - 1 : prev + 1);
    setIsLiked(!isLiked);
  };

  return (
    <Popup className="incident-popup-custom" closeButton={true}>
      <div onClick={(e) => e.stopPropagation()} className="popup-container">
        <div className="popup-header"></div>

        <div className="popup-category">
          <a
            href="/#"
            className={`category-link ${!isAuthenticated ? 'disabled' : ''}`}
            onClick={(e) => !isAuthenticated && e.preventDefault()}
          >
            {incident.nombre}
          </a>
        </div>

        <div className="popup-content">
          <p><strong>Fecha:</strong> {new Date(incident.fecha).toLocaleDateString()}</p>
          <p><strong>Coordenadas:</strong> {incident.latitud.toFixed(4)}, {incident.longitud.toFixed(4)}</p>
          <p>{ciudad}, {colonia}, {calle}</p>
        </div>

        {isAuthenticated && (
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
              <span className="comment-container" onClick={() => setShowCommentSectionModal(true)}>
                <FaRegComment className="incident-popup-comment" />
                <span className="comment-count">{comment_count}</span>
              </span>
            </div>
          </div>
        )}
      </div>

      <ChangeStatus show={showStatusModal} onHide={() => setShowStatusModal(false)} />
      <CommentSection
        show={showCommentSectionModal}
        onHide={() => setShowCommentSectionModal(false)}
        incidenteID={incident.incidenteID}
        currentUserID={1} // Asegúrate de reemplazarlo dinámicamente si tienes usuario activo
      />
    </Popup>
  );
};
