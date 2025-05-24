import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, ZoomControl, useMap } from 'react-leaflet';
import L, { LatLngLiteral } from 'leaflet';
import ReportIncidentModal from '../../layout/report-incident/report-incident';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './map.css';
import { IncidentService } from '../../services/incident.service';
import { IncidentDTO } from '../../models/dto-incident';
import { IncidentPopup } from './incident-popup/incident-popup';
import { IncidentPin } from './pin/pin';
import SelectLocationPin from '../figures/select-location-pin/select-location-pin';

/**
 * @global
 * Asigna la vista inicial.
 * 
 * @param {LatLngLiteral} center - Coordenada centrica de la vista.
 * @param {number} zoom - Zoom de la vista.
 * 
 * @returns {null} null
 * 
 * @alpha
 */
const SetInitialView = ({ center, zoom }: { center: LatLngLiteral; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom, map]);
  return null;
};

/**
 * @global
 * Inicializador de mapa.
 * 
 * @see {@link leaflet}
 * 
 * @returns {JSX.Element} Elemento correspondiente.
 * 
 * @eventProperty
 */
const MapComponent: React.FC = () => {
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidents, setIncidents] = useState<IncidentDTO[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<IncidentDTO | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const [dragMode, setDragMode] = useState(false);
  const [dragMarkerPosition, setDragMarkerPosition] = useState<LatLngLiteral | null>(null);
  const dragTimer = useRef<NodeJS.Timeout | null>(null);

  const initialCenter: LatLngLiteral = { lat: 19.4063, lng: -99.1631 };
  const initialZoom = 18;
  const maxZoom = 22;

  useEffect(() => {
    const loadIncidents = async () => {
      const data = await IncidentService.fetchIncidents();
      setIncidents(data);
    };
    loadIncidents();
  }, []);

  /**
   * Manejador de scroll-down.
   */
  const handleMouseDown = () => {
    dragTimer.current = setTimeout(() => {
      setDragMode(true);
    }, 500);
  };

  /**
   * Manejador de scroll-up
   */
  const handleMouseUp = () => {
    if (dragTimer.current) {
      clearTimeout(dragTimer.current);
      dragTimer.current = null;
    }
    if (!dragMode) {
      setShowIncidentModal(true);
    }
  };

  /**
   * Maneja clic en el mapa.
   * 
   * @param {L.LeafletMouseEvent} e - Evento de mouse en el mapa.
   * 
   * @eventProperty
   */
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (dragMode) {
      setDragMode(false);
      setDragMarkerPosition(e.latlng);
      setShowIncidentModal(true);
    }
  };

  /**
   * Manejador de clic en el mapa.
   * 
   * @param {L.LeafletMouseEvent} e - Evento de mouse en el mapa.
   * 
   * @returns {null} null
   * 
   * @eventProperty
   */
  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick,
      mousemove: (e) => {
        if (dragMode) {
          setDragMarkerPosition(e.latlng);
        }
      }
    });
    return null;
  };

  return (
    <div className="map-container">
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        maxZoom={maxZoom}
        className="h-100 w-100"
        zoomControl={false}
        doubleClickZoom={false}
        zoomSnap={0.5}
        whenReady={() => setMapReady(true)}
      >
        {mapReady && <SetInitialView center={initialCenter} zoom={initialZoom} />}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          detectRetina={true}
          maxZoom={maxZoom}
        />

        <ZoomControl position="bottomright" />

        <div className="incident-button-wrapper" style={{ zIndex: 900000 }}>
          <button
            className="incident-button"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // Para cancelar si suelta fuera del botón
          >
            <SelectLocationPin size={40} />
          </button>
          <span className="incident-tooltip">Agregar incidente</span>
        </div>

        {incidents.map((incident) => (
          <Marker
            key={incident.incidenteID}
            position={[incident.latitud, incident.longitud]}
            icon={IncidentPin.getIcon(incident.estado)}
            eventHandlers={{
              click: () => setSelectedIncident(incident)
            }}
          >
            {selectedIncident?.incidenteID === incident.incidenteID && (
              <IncidentPopup
                incident={incident}
                onClose={() => setSelectedIncident(null)}
              />
            )}
          </Marker>
        ))}

        {/* Manejador de clicks y movimientos */}
        <MapClickHandler />

        {/* Mostrar el pin flotante mientras arrastra */}
        {dragMode && dragMarkerPosition && (
          <Marker
            position={dragMarkerPosition}
            icon={L.icon({
              iconUrl: '/path-to-your-pin-icon.svg',
              iconSize: [40, 40],
              iconAnchor: [20, 40]
            })}
          />
        )}

        <ReportIncidentModal
          show={showIncidentModal}
          onHide={() => setShowIncidentModal(false)}
        />
      </MapContainer>
    </div>
  );
};

/**
 * @module map
 * 
 * Mapa.
 * 
 * @remarks Módulo especializado en el manejo del mapa.
 */
export default MapComponent;
