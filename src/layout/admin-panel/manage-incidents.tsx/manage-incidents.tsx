import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Search } from "lucide-react";
import DropdownCategories from '../../../components/admin-categories/dropdown/categories-dropdown';
import './manage-incidents.css'

/**
 * @global
 * Interfaz que mantiene los datos del modelo de incidente
 * 
 * @param {number} incidenteid - ID del incidente.
 * @param {number} clienteid - ID del cliente.
 * @param {string} categoriaid - ID de la categoría.
 * @param {string} nombre - Nombre del incidente.
 * @param {string} descripcion - Descripción del incidente.
 * @param {string} fecha - Fecha del incidente
 * @param {string} hora - Hora del incidente.
 * @param {number} longitud - Longitud de la ubicación del incidente.
 * @param {number} latitud - Latitud de la ubicación del incidente.
 * @param {string} [estatus = 'creado' | 'en revisión' | 'resuelto'] - Estado del incidente.
 * 
 * @interface
 */
interface Incident {
    incidenteid: number;
    clienteid: number;
    categoriaid: string;
    nombre: string;
    descripcion: string;
    fecha: string;
    hora: string;
    longitud: number;
    latitud: number;
    estatus: 'creado' | 'en revisión' | 'resuelto';
  }
  
  /**
   * @global
   * Lay-out y manejador de incidentes.
   * 
   * @apicall GET - `http://localhost:8080/v1/incident/toolkit`
   * @apicall PUT - `http://localhost:8080/v1/incident/toolkit`
   * @apicall DELETE - `http://localhost:8080/v1/incident/toolkit`
   * 
   * @returns {JSX.Element} Elemento correspondiente.
   */
  const ManageIncidents = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Incident; direction: 'ascending' | 'descending' } | null>(null);
    const [moreDropdownOpen, setMoreDropdownOpen] = useState<number | null>(null);
  
    // Simulación de datos temporales
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Simulando retraso de red
          //await new Promise(resolve => setTimeout(resolve, 500));
          const fetchedIncidents = await fetchIncidentsFromBackend();
          setIncidents(fetchedIncidents);
          // Datos temporales de ejemplo
          /*
          const tempIncidents: Incident[] = [
            {
              incidenteid: 56478,
              clienteid: 24323,
              categoriaid: 'Infraestructura',
              nombre: 'trivial',
              descripcion: 'Bache en la calle principal',
              fecha: '2023-05-15',
              hora: '14:30',
              longitud: -99.1332,
              latitud: 19.4326,
              estado: 'Creado'
            },
            {
              incidenteid: 2,
              clienteid: 24323,
              nombre: 'trivial',
              categoriaid: 'Seguridad',
              descripcion: 'Alumbrado público dañado',
              fecha: '2023-05-16',
              hora: '20:15',
              longitud: -99.1345,
              latitud: 19.4312,
              estado: 'En revisión'
            },
          ];
          */

          //setIncidents(tempIncidents);
          setLoading(false);
        } catch (err) {
          setError('Error de conexión con la BD');
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    /**
     * Busca incidentes.
     * 
     * @apicall GET - `http://localhost:8080/v1/incident/toolkit`
     * 
     * @returns {Promise<Incident[]>} - Representación de una operación asíncrona completada con éxito con el resultado.
    */
   const fetchIncidentsFromBackend = async (): Promise<Incident[]> => {
      const token = sessionStorage.getItem("token");
      const response = await fetch("http://localhost:8080/v1/incident/toolkit", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener usuarios');
    }

    const incidents: Incident[] = await response.json();
    return incidents;

    // return [];
    };
    
    /**
     * Actualiza incidentes.
     * 
     * @apicall PUT - `http://localhost:8080/v1/incident/toolkit`
     * 
     * @param {number} incidentid - ID del incidente.
     * @param {['creado' | 'en revisión' | 'resuelto']} newStatus - Nuevo estado del incidente.
     * 
     * @returns {Promise<boolean>} - Representación de una operación asíncrona completada con éxito con el resultado.
     */
    const updateIncidentStatus = async (incidentId: number, newStatus: 'creado' | 'en revisión' | 'resuelto'): Promise<boolean> => {
      try {
        const token = sessionStorage.getItem("token");
        const peticion = {

          incidenteid: incidentId,
          clienteid: 24323,
          categoriaid: 'Infraestructura',
          nombre: 'trivial',
          descripcion: 'Bache en la calle principal',
          fecha: '2023-05-15',
          hora: '14:30',
          longitud: -99.1332,
          latitud: 19.4326,
          estatus: newStatus
        }
        
        const response = await fetch("http://localhost:8080/v1/incident/toolkit", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            incidenteid: peticion.incidenteid,
            estatus: peticion.estatus
          })
        });

        if (!response.ok) {
          throw new Error("no se pudo cambiar");
        }
      } catch (error) {
        console.log("fallo")
      }
      console.log(`Actualizando estado del incidente ${incidentId} a ${newStatus}`);
      window.location.reload();
      return true;
    };
  
    /**
     * Borra incidentes.
     * 
     * @apicall DELETE - `http://localhost:8080/v1/incident/toolkit`
     * 
     * @param {number} incidentid - ID del incidente
     * 
     * @returns {Promise<boolean>} - Representación de una operación asíncrona completada con éxito con el resultado.
     */
    const deleteIncident = async (incidentId: number): Promise<boolean> => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch("http://localhost:8080/v1/incident/toolkit", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            incidenteid: incidentId,
            estatus: "resuelto"
          })
        });

        if (!response.ok) {
          throw new Error("no se pudo cambiar");
        }
      } catch (error) {
        console.log("fallo")
      }
      console.log(`Eliminando incidente ${incidentId}`);
      window.location.reload();
      return true;
    };
  
    /**
     * Filtrado y ordenado de incidentes.
     * 
     * @returns {Incidents[]} - Lista de incidentes filtrada y ordenada.
     */
    const filteredIncidents = incidents.filter(incident => {
      const searchLower = searchTerm.toLowerCase();
      return (
        incident.incidenteid.toString().includes(searchLower) ||
        incident.categoriaid.toLowerCase().includes(searchLower) ||
        incident.descripcion.toLowerCase().includes(searchLower) ||
        incident.fecha.toLowerCase().includes(searchLower) ||
        incident.hora.toLowerCase().includes(searchLower) ||
        incident.estado.toLowerCase().includes(searchLower)
      );
    });
  
    /**
     * Ordenado de incidentes.
     * 
     * @returns {Incidents[]} - Lista de incidentes ordenada.
     */
    const sortedIncidents = React.useMemo(() => {
      if (!sortConfig) return filteredIncidents;
      
      return [...filteredIncidents].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }, [filteredIncidents, sortConfig]);
  
    /**
     * Solicitar ordenado.
     * 
     * @param key - Llave del incidente,
     */
    const requestSort = (key: keyof Incident) => {
      let direction: 'ascending' | 'descending' = 'ascending';
      if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
      }
      setSortConfig({ key, direction });
    };
  
    /**
     * Númerado de páginas. Evita recálculos innecesarios.
     * 
     * @param {number} totalPages - Número total de página.
     * @param {number} paginatedIncidents - Incidentes páginados.
     * 
     * @returns {{total, paginated}}
     */
    const { totalPages, paginatedIncidents } = React.useMemo(() => {
      const total = Math.ceil(sortedIncidents.length / itemsPerPage);
      const paginated = sortedIncidents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
      return { totalPages: total, paginatedIncidents: paginated };
    }, [sortedIncidents, currentPage, itemsPerPage]);
  
    /**
     * Manejador de items por cambio de página.
     * 
     * @param {React.ChangeEvent<HTMLSelectElement>} e - Evento de cambio.
     * 
     * @eventProperty
     */
    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = Number(e.target.value);
      setItemsPerPage(newValue);
      setCurrentPage(1);
    };
  
    /**
     * Ir a `n` página.
     * 
     * @param {number} page - Número de página.
     */
    const goToPage = (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };
  
    /**
     * Manejo de dropdowns.
     * 
     * @param {number} incidentId - ID del incidente.
     */
    const toggleMoreDropdown = (incidentId: number) => {
      setMoreDropdownOpen(moreDropdownOpen === incidentId ? null : incidentId);
    };
  
    /**
     * Cerrar dropdowns.
     */
    const closeDropdowns = () => {
      setMoreDropdownOpen(null);
    };
  
    // Cerrar dropdowns al hacer clic fuera
    useEffect(() => {
      const handleClickOutside = () => closeDropdowns();
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }, []);
  
    if (loading) {
      return <div className="loading">Cargando...</div>;
    }
  
    if (error) {
      return <div className="error-message">{error}</div>;
    }

  return (
    <div className="manage-incidents-container">
      <h2 className="manage-incidents-title">Administración de Incidentes</h2>
      <DropdownCategories/>
      {incidents.length === 0 ? 
      (<div className="no-users">No hay incidentes registrados</div>
      ) : (
        <>
            <div className="users-search-bar">
                <Search className="search-icon" />
                <input
                    type="text"
                    placeholder="Buscar en la tabla..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-users-search-bar outline-none bg-transparent"    
                />
            </div>
            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                        <th onClick={() => requestSort('incidenteid')}>
                            ID {sortConfig?.key === 'incidenteid' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => requestSort('categoriaid')}>
                            Categoría {sortConfig?.key === 'categoriaid' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => requestSort('descripcion')}>
                            Descripción {sortConfig?.key === 'descripcion' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => requestSort('fecha')}>
                            Fecha {sortConfig?.key === 'fecha' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => requestSort('hora')}>
                            Hora {sortConfig?.key === 'hora' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => requestSort('longitud')}>
                            Longitud {sortConfig?.key === 'longitud' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => requestSort('latitud')}>
                            Latitud {sortConfig?.key === 'latitud' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => requestSort('estado')}>
                            Estado {sortConfig?.key === 'estado' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th>Más</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedIncidents.length > 0 ? (paginatedIncidents.map(incident => (
                            <tr key={incident.incidenteid}>
                                <td>{incident.incidenteid}</td>
                                <td>{incident.categoriaid}</td>
                                <td>{incident.descripcion}</td>
                                <td>{incident.fecha}</td>
                                <td>{incident.hora}</td>
                                <td>{incident.longitud}</td>
                                <td>{incident.latitud}</td>
                                <td>
                                    <div className="status-cell">
                                        <Dropdown>
                                            <Dropdown.Toggle 
                                                className="dropdown-toggle" 
                                                as="button"
                                                variant="secondary"
                                                size="sm">
                                                {incident.estado}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="dropdown-menu">
                                                <Dropdown.Item onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateIncidentStatus(incident.incidenteid, 'creado');
                                                    closeDropdowns();
                                                }}>
                                                    Creado
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateIncidentStatus(incident.incidenteid, 'en revisión');
                                                    closeDropdowns();
                                                }}>
                                                    En revisión
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateIncidentStatus(incident.incidenteid, 'resuelto');
                                                    closeDropdowns();
                                                }}>
                                                    Resuelto
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </td>
                                <td>
                                    <Dropdown show={moreDropdownOpen === incident.incidenteid} onToggle={() => toggleMoreDropdown(incident.incidenteid)}>
                                        <Dropdown.Toggle 
                                        className="more-toggle" 
                                        as="button" 
                                        onClick={(e: any) => {
                                            e.stopPropagation();
                                            toggleMoreDropdown(incident.incidenteid);
                                        }}>
                                        ⋮
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="more-dropdown">
                                        <Dropdown.Item onClick={(e) => {
                                        e.stopPropagation();
                                        deleteIncident(incident.incidenteid);
                                        closeDropdowns();
                                        }}>
                                            Eliminar
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={(e) => {
                                        e.stopPropagation();
                                        console.log('Ver detalles', incident.incidenteid);
                                        closeDropdowns();
                                        }}>
                                            Ver detalles
                                        </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="no-results">
                                No se encontraron resultados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
                    
            <div className="pagination-controls">
                <div className="items-per-page">
                    <span>Mostrar:</span>
                        <select 
                            value={itemsPerPage} 
                            onChange={handleItemsPerPageChange}
                            onClick={(e) => e.stopPropagation()}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    <span>registros</span>
                </div>
                <div className="page-navigation">
                    <button 
                        onClick={() => goToPage(1)} 
                        disabled={currentPage === 1}>
                        «
                    </button>
                    <button 
                        onClick={() => goToPage(currentPage - 1)} 
                        disabled={currentPage === 1}>
                        ‹
                    </button>
                    <span>
                        Página {currentPage} de {totalPages}
                    </span>
                    <button 
                        onClick={() => goToPage(currentPage + 1)} 
                        disabled={currentPage === totalPages}>
                        ›
                    </button>
                    <button 
                        onClick={() => goToPage(totalPages)} 
                        disabled={currentPage === totalPages}>
                        »
                    </button>
                </div>
            </div>
        </>
      )}
    </div>
  );
};

/**
 * @module manage-incidents
 * 
 * Lay-out para manejo de incidentes.
 * 
 * @remarks Lay-out para pantalla especial para el manejo de incidentes.
 */
export default ManageIncidents;