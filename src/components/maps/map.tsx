// src/components/map/MapComponent.tsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl, useMap } from 'react-leaflet';
import L, { LatLngLiteral } from 'leaflet';
import ReportIncidentModal from '../../layout/report-incident/report-incident';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './map.css';
import { IncidentService } from '../../services/incident.service';
import { IncidentDTO } from '../../models/dto-incident';
import { IncidentPin } from './pin/pin';

// Componente para manejar el viewport inicial (igual que antes)
const SetInitialView = ({ center, zoom }: { center: LatLngLiteral; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom, map]);
  return null;
};

const MapComponent: React.FC = () => {
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidents, setIncidents] = useState<IncidentDTO[]>([]);
  const [mapReady, setMapReady] = useState(false);

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
          <button className="incident-button" onClick={() => setShowIncidentModal(true)}>
            +
          </button>
          <span className="incident-tooltip">Agregar incidente</span>
        </div>

        {incidents.map((incident) => (
          <Marker
            key={incident.incidenteID}
            position={{ lat: incident.latitud, lng: incident.longitud }}
            icon={IncidentPin.getIcon(incident.estado)}
            eventHandlers={{
              click: () => console.log('Incidente:', incident)
            }}
          />
        ))}

        <ReportIncidentModal
          show={showIncidentModal}
          onHide={() => setShowIncidentModal(false)}
        />
      </MapContainer>
    </div>
  );
};

export default MapComponent;