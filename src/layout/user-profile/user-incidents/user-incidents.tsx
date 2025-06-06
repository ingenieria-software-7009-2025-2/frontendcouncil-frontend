import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { ExclamationTriangle } from 'react-bootstrap-icons';
import { IncidentService } from '../../../services/incident.service';
import { IncidentDTO, IncidentStatus } from '../../../models/dto-incident';


const UserIncidents: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userIdStr = sessionStorage.getItem("clienteid");
  const userId = Number(userIdStr);
  
  useEffect(() => {
  const loadIncidents = async () => {
    try {
      setLoading(true); // Activamos el estado de carga
      const incidents = await IncidentService.getIncidentsByUser(userId);
      setIncidents(incidents); // Guardamos los datos
      setError(null); // Limpiamos errores previos
    } catch (err) {
      setError('Error al cargar los incidentes'); // Mostramos error
      setIncidents([]); // Opcional: Resetear lista si falla
    } finally {
      setLoading(false); // Desactivamos carga (éxito o error)
    }
  };

  loadIncidents();
}, [userId]);

   /**  IncidentService.subscribe(handleIncidentsUpdate);
    IncidentService.connect().catch(err => {
      setError('Error al conectar con el servicio de incidentes');
      setLoading(false);
    });

    return () => {
      IncidentService.unsubscribe(handleIncidentsUpdate);
      IncidentService.disconnect();
    };
  }, [userId]);

  // Función para traducir el estado a un texto más amigable
  const getStatusText = (status: IncidentStatus): string => {
    const statusMap: Record<IncidentStatus, string> = {
      'reportado': 'Reportado',
      'revision': 'En revisión',
      'resuelto': 'Resuelto'
    };
    return statusMap[status] || status;
  };

  // Función para obtener el nombre de la categoría basado en el ID (NOTA HAY QUE MANEJARLO DESDE EL BACK)
  const getCategoryName = (categoryId: number): string => {
    const categories: Record<number, string> = {
      1: 'Agua'
    };
    return categories[categoryId] || `Categoría ${categoryId}`;
  };

  if (loading) {
    return <div>Cargando incidentes...</div>;
  }*/

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="incidents-section">
      <h5 className="d-flex align-items-center mb-4 report-title">
        <ExclamationTriangle className="me-2 field-icon" /> 
        Tus Reportes
      </h5>
      <Row className="mb-4 text-center"></Row>
      {/* Sección de estadísticas */}
      <div className="stats-wrapper">
        <Row className="mb-4 text-center">
          <Col md={4}>
            <div className="incident-stat-card">
              <h3 className="stat-number">0</h3>
              <p className="stat-label">Reportados</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="incident-stat-card">
              <h3 className="stat-number">0</h3>
              <p className="stat-label">En revisión</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="incident-stat-card">
              <h3 className="stat-number">0</h3>
              <p className="stat-label">Resueltos</p>
            </div>
          </Col>              
        </Row>              
      </div>
      <Row className="mb-4 text-center"></Row>
                    
      {/* Sección de lista de incidentes con scroll */}
      {incidents.length === 0 ? (
        <div> No se encontraron incidentes para este usuario. {userId}</div>
      ) : (
      <div className="incidents-list-scroll">
        <div className="incidents-list-container">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b border-gray-200 text-left">Nombre</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left">Categoría</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left">Ubicación</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left">Estatus</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left">Fecha de publicación</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.incidenteid} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b border-gray-200">{incident.nombre}</td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {incident.categoriaID}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      Lat: {incident.latitud.toFixed(4)}, Long: {incident.longitud.toFixed(4)}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${ 
                        incident.estado === 'resuelto' ? 'bg-green-100 text-green-800' : 
                        incident.estado === 'en revisión' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                        {incident.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
          </div>
        </div>
      </div>
    )}
  </div>
)};

export default UserIncidents;