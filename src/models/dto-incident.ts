export type IncidentStatus = 'reportado' | 'revision' | 'resuelto'; 

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
