/**
 * Estados del incidente.
 * 
 * @see BDD `estado enum`.
 */
export type IncidentStatus = 'reportado' | 'revision' | 'resuelto'; 

/**
 * Modelo de incidente
 * 
 * @param {number} incidenteID - ID de incidente. 
 * @param {number} clienteID - ID de cliente.
 * @param {number} categoriaID - ID de categoría.
 * @param {string} nombre - Nombre del incidente.
 * @param {string} descripcion - Descripción del incidente.
 * @param {string} fecha - Fecha del incidente.
 * @param {string} hora - Hora del incidente.
 * @param {number} longitud - Longitud de la ubicación del incidente.
 * @param {number} latitud - Latitud de la ubicación del incidente.
 * @param {IncidentStatus} estado - Estado del incidente.
 * 
 * @interface
 */
export interface IncidentDTO {
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
