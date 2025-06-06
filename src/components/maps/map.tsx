import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, ZoomControl, useMap } from 'react-leaflet';
import L, { LatLngLiteral } from 'leaflet';
import ReportIncidentModal from '../../layout/report-incident/report-incident';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './map.css';
import { Navbar, Container } from 'react-bootstrap';
import Filter from '../filter/filter';
import { IncidentService } from '../../services/incident.service';
import { IncidentDTO } from '../../models/dto-incident';
import { IncidentPopup } from './incident-popup/incident-popup';
import { IncidentPin } from './pin/pin';
import SelectLocationPin from '../figures/select-location-pin/select-location-pin';
import SISREP_ICON from '../../assets/SISREP_ICON.svg'
import SearchBar from '../searchbar/searchbar';

const SetInitialView = ({ center, zoom }: { center: LatLngLiteral; zoom: number }) => {
  const map = useMap();
  const initializedRef = useRef(false);
  
  useEffect(() => {
    if (!initializedRef.current) {
      map.setView(center, zoom, { animate: true, duration: 1 });
      initializedRef.current = true;
    }
  }, [center, zoom, map]);
  return null;
};

type IncidentFilters = {
  reportado: boolean;
  revision: boolean;
  resuelto: boolean;
  categories: Record<number, boolean>;
};

const MapComponent: React.FC = () => {
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidents, setIncidents] = useState<IncidentDTO[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [selectedIncident, setSelectedIncident] = useState<IncidentDTO | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const [searchLocation, setSearchLocation] = useState<LatLngLiteral | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const [dragMode, setDragMode] = useState(false);
  const [dragMarkerPosition, setDragMarkerPosition] = useState<LatLngLiteral | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LatLngLiteral | null>(null);
  const dragTimer = useRef<NodeJS.Timeout | null>(null);

  const initialCenter: LatLngLiteral = { lat: 19.4063, lng: -99.1631 };
  const initialZoom = 18;
  const maxZoom = 22;

  const [filters, setFilters] = useState<IncidentFilters>({
    reportado: true,
    revision: true,
    resuelto: true,
    categories: {}
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsAuthenticated(!!token); 
    const loadIncidents = async () => {
      const data = await IncidentService.fetchIncidents();
      setIncidents(data); };
    loadIncidents();
  }, []);

  const handleMouseDown = () => {
    dragTimer.current = setTimeout(() => {
      setDragMode(true);
    }, 500); 
  };

  const handleMouseUp = () => {
    if (dragTimer.current) {
      clearTimeout(dragTimer.current);
      dragTimer.current = null;
    }
    if (!dragMode) {
      // Abrir modal sin ubicación específica (modo normal)
      setSelectedLocation(null);
      setShowIncidentModal(true);
    }
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (dragMode) {
      setDragMode(false);
      setSelectedLocation(e.latlng); // Guardar la ubicación seleccionada
      setDragMarkerPosition(null); // Limpiar el marcador de arrastre
      setShowIncidentModal(true);
    }
  };

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

  // Función para manejar la selección de ubicación desde SearchBar
  const handleLocationSelect = (location: LatLngLiteral) => {
    setSearchLocation(location);
    if (mapRef.current) {
      mapRef.current.flyTo(location, 18, {
        animate: true,
        duration: 1
      });
    }
  };

  const MapRefHandler = () => {
    const map = useMap();
    useEffect(() => {
      mapRef.current = map;
      return () => {
        mapRef.current = null;
      };
    }, [map]);
    return null;
  };

  // Función para manejar cambios en los filtros
  const handleFilterChange = (statusFilters: Filters) => {
    setFilters(prev => ({
      ...prev,
      ...statusFilters
    }));
  };

  // Función para manejar cambios en categorías
  const handleCategoryChange = (categoryStates: Record<number, boolean>) => {
    setFilters(prev => ({
      ...prev,
      categories: categoryStates
    }));
  };

  // Filtrar incidentes basado en los filtros actuales
  const filteredIncidents = incidents.filter(incident => {
    // Filtrar por estado
    const statusMatch = 
      (incident.estado === 'reportado' && filters.reportado) ||
      (incident.estado === 'en revisión' && filters.revision) ||
      (incident.estado === 'resuelto' && filters.resuelto);
    
    // Filtrar por categoría
    const categoryMatch = 
      Object.keys(filters.categories).length === 0 || // Si no hay categorías seleccionadas
      (incident.categoriaID && filters.categories[incident.categoriaID]);
    
    return statusMatch && categoryMatch;
  });

  return (
    <div className="map-container">
      <Navbar collapseOnSelect expand="lg" variant="dark" className="navbar-custom" style={{ zIndex: 900000 }}>
        <Container>
          <div className="search-container" style={{ zIndex: 900000 }}>
            <div className="menuH">
              <Filter onFilterChange={handleFilterChange} onCategoryChange={() => {}} />
            </div>
            <SearchBar onLocationSelect={handleLocationSelect}/>
          </div>
        </Container>
      </Navbar>
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        maxZoom={maxZoom}
        className="h-100 w-100"
        zoomControl={false}
        doubleClickZoom={false}
        zoomSnap={0.5}
        whenReady={() => setMapReady(true)}
        ref={mapRef} 
      >
        
        <MapRefHandler />

        {mapReady && <SetInitialView center={initialCenter} zoom={initialZoom} />}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          detectRetina={true}
          maxZoom={maxZoom}
        />

        <ZoomControl position="bottomright" />

        {isAuthenticated ? (
        <div className="incident-button-wrapper" style={{ zIndex: 900000 }}>
          <button
            className="incident-button"
            onMouseDown={handleMouseDown}
            onClick={handleMouseUp}
          >
            <SelectLocationPin size={40} />
          </button>
          <span className="incident-tooltip">Agregar incidente</span>
        </div>
        ) : (
        <div className="incident-button-wrapper" style={{ zIndex: 900000 }}>
          <button
            className="incident-button"
            style={{ cursor: "not-allowed" }}
          >
            <SelectLocationPin size={40} />
          </button>
          <span className="incident-tooltip">Agregar incidente</span>
        </div>
      )}
        
        {filteredIncidents.map((incident) => (
          <Marker
            key={incident.incidenteid}
            position={[incident.latitud, incident.longitud]}
            icon={IncidentPin.getIcon(incident.estado)}
            eventHandlers={{
              click: () => setSelectedIncident(incident)
            }}
          >
            {selectedIncident?.incidenteid === incident.incidenteid && (
              <IncidentPopup
                incident={incident}
                onClose={() => setSelectedIncident(null)}
              />
            )}
          </Marker>
        ))} 
        <MapClickHandler />

        {/* Mostrar el pin flotante mientras arrastra */}
        {dragMode && dragMarkerPosition && (
          <Marker
            position={dragMarkerPosition}
            icon={L.icon({
              iconUrl: SISREP_ICON,  
              iconSize: [40, 40],
              iconAnchor: [20, 40]
            })}
          />
        )}
        
        {/* Modal de reporte */}
        <ReportIncidentModal
          show={showIncidentModal}
          onHide={() => {
            setShowIncidentModal(false);
            setSelectedLocation(null); // Limpiar la ubicación al cerrar
          }}
          mapLocation={selectedLocation || undefined}
          isMapSelected={!!selectedLocation} // true si hay ubicación seleccionada
        />


        
      </MapContainer>
    </div>
  );
};

export default MapComponent;