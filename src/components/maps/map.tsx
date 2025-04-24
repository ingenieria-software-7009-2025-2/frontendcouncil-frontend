import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, CircleMarker, ZoomControl } from 'react-leaflet';
import L, { LatLngLiteral } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './map.css';
import ReportIncidentModal from '../../layout/report-incident/report-incident';

// Configuración del icono para el marcador arrastrable que no sirve aún y lo voy a cambiar con algo diseñado en figma
const draggableIcon = new L.DivIcon({
  className: 'custom-draggable-icon',
  html: `<div style="font-size: 24px; filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));">👤</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

// Icono para incidentes reportados
const incidentIcon = new L.DivIcon({
  className: 'incident-icon',
  html: `<div style="
    background: red;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 0 5px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

interface Incident {
  id: number;
  position: LatLngLiteral;
  category?: string;
  description?: string;
}

const MapComponent: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newPosition, setNewPosition] = useState<LatLngLiteral | null>(null);
  const [dragging, setDragging] = useState(false);

  const draggableMarkerRef = useRef<L.Marker<any>>(null);
  const mapRef = useRef<L.Map>(null);

  const handleDragEnd = () => {
    const marker = draggableMarkerRef.current;
    if (marker) {
      const position = marker.getLatLng();
      setNewPosition(position);
      setShowModal(true);
      setDragging(false);
    }
  };

  const handleIncidentCreated = (incidentData: {
    category: string;
    description: string;
    location: LatLngLiteral;
  }) => {
    setIncidents(prev => [
      ...prev, 
      {
        id: Date.now(),
        position: incidentData.location,
        category: incidentData.category,
        description: incidentData.description
      }
    ]);
    setNewPosition(null);
    setShowModal(false);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        if (!dragging) {
          setNewPosition(e.latlng);
          setShowModal(true);
        }
      }
    });
    return null;
  };

  return (
    <div className="map-container">
      <MapContainer
        ref={mapRef}
        center={[23.6345, -102.5528]}
        zoom={5}
        className="h-100 w-100"
        zoomControl={false}
        doubleClickZoom={false}  
        zoomSnap={0.5} >

        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        detectRetina={true}
        />


        {/* QUITAR ESTOS DOS SI SE TARDA MUCHO EN CARGAR EL MAPA PARA HACER ZOOM */}
        <TileLayer
        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=TU_API_KEY`}
        attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'/>
        <TileLayer
        url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png"
        attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>'/>
        {/* HASTA AQUI */}

        <MapClickHandler />

        <ZoomControl position="bottomright" />

        {newPosition && (
          <Marker
            draggable
            eventHandlers={{
              dragstart: () => setDragging(true),
              dragend: handleDragEnd,
            }}
            position={newPosition}
            icon={draggableIcon}
            ref={draggableMarkerRef}
            zIndexOffset={1000}
          />
        )}

        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            position={incident.position}
            icon={incidentIcon}
            eventHandlers={{
              click: () => {
                console.log('Incidente:', incident);
              }
            }}
          />
        ))}
      </MapContainer>

      <ReportIncidentModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setNewPosition(null);
        }}
        onIncidentCreated={handleIncidentCreated}
        initialLocation={newPosition}
      />
    </div>
  );
};

export default MapComponent;
