export type IncidentStatus = 'reportado' | 'en revisión' | 'resuelto'; 

export interface IncidentDTO {
  incidenteid: number;
  clienteID: number;
  categoriaid: number;
  nombre: string;
  descripcion: string;
  fecha: string;     
  hora: string;     
  longitud: number;
  latitud: number;
  estado: IncidentStatus;
  likes: number;
}
