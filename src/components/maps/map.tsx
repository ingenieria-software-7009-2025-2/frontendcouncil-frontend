// src/components/map/MapComponent.tsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl, useMap } from 'react-leaflet';
import L, { LatLngLiteral, Icon } from 'leaflet';
import ReportIncidentModal from '../../layout/report-incident/report-incident';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import pin from './../../assets/pin.png'
import SearchBar from '../searchbar/searchbar';
import './map.css';

type IncidentStatus = 'activo' | 'en_proceso' | 'resuelto';

interface Incident {
  incidenteID: number;
  clienteID: number;
  categoriaID: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  hora: string;
  longitud: number;
  latitud: number;
  estado: IncidentStatus;
}

// Componente para manejar el viewport inicial
const SetInitialView = ({ center, zoom }: { center: LatLngLiteral; zoom: number }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, {
      animate: true,
      duration: 1
    });
  }, [center, zoom, map]);

  return null;
};

// Clase encargada de manejar íconos personalizados para los incidentes
class IncidentManager {
  static getIcon(estado: IncidentStatus): Icon {
    const colorMap: Record<IncidentStatus, string> = {
      activo: 'red',
      en_proceso: 'yellow',
      resuelto: 'green'
    };

    const circleColor = colorMap[estado];
    const pinUrl = new URL(pin, import.meta.url).href;

    return L.divIcon({
      className: '',
      html: `
        <div style="position: relative; width: 32px; height: 32px;">
          <img src="${pinUrl}" style="width: 100%; height: 100%;" />
          <div style="
            position: absolute;
            top: 2px;
            left: 2px;
            width: 12px;
            height: 12px;
            background-color: ${circleColor};
            border-radius: 50%;
            border: 1px solid white;
          "></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });
  }

  static async fetchIncidents(): Promise<Incident[]> {
    // Aquí va tu implementación del backend
    return [
      {
        incidenteID: 1,
        clienteID: 101,
        categoriaID: 5,
        nombre: "Fuga de agua",
        descripcion: "Se detectó una fuga cerca del parque",
        fecha: "2025-04-24",
        hora: "10:00",
        latitud: 19.4065,
        longitud: -99.1632,
        estado: "activo"
      },
      {
        incidenteID: 2,
        clienteID: 102,
        categoriaID: 3,
        nombre: "Corte eléctrico",
        descripcion: "Zona sin luz por varias horas",
        fecha: "2025-04-24",
        hora: "09:30",
        latitud: 19.4060,
        longitud: -99.1635,
        estado: "en_proceso"
      },
      {
        incidenteID: 3,
        clienteID: 103,
        categoriaID: 2,
        nombre: "Semáforo descompuesto",
        descripcion: "Semáforo fuera de servicio en la esquina",
        fecha: "2025-04-23",
        hora: "18:20",
        latitud: 19.4068,
        longitud: -99.1630,
        estado: "resuelto"
      }
    ];
  }
}


const MapComponent: React.FC = () => {
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [mapReady, setMapReady] = useState(false);

  const initialCenter: LatLngLiteral = { lat: 19.4063, lng: -99.1631 };
  const initialZoom = 18;
  const maxZoom = 22;

  useEffect(() => {
    const loadIncidents = async () => {
      const data = await IncidentManager.fetchIncidents();
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
            icon={IncidentManager.getIcon(incident.estado)}
            eventHandlers={{
              click: () => {
                console.log('Incidente:', incident);
              }
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
