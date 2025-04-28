import { IncidentDTO, IncidentStatus} from "../models/dto-incident";

export class IncidentService {
  private static mockIncidents: IncidentDTO[] = [
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
      estado: "reportado"
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
      estado: "revision"
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

  private static listeners: ((incidents: IncidentDTO[]) => void)[] = [];
  private static intervalId: number | null = null;

  static async connect(): Promise<void> {
    // Simulamos conexión WebSocket con un intervalo
    this.intervalId = window.setInterval(() => {
      this.notifyListeners([...this.mockIncidents]);
    }, 5000); // Actualiza cada 5 segundos
  }

  static disconnect(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  static subscribe(callback: (incidents: IncidentDTO[]) => void): void {
    this.listeners.push(callback);
    callback([...this.mockIncidents]); // Enviar datos inmediatamente al subscribirse
  }

  static unsubscribe(callback: (incidents: IncidentDTO[]) => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  private static notifyListeners(incidents: IncidentDTO[]): void {
    this.listeners.forEach(listener => listener(incidents));
  }

  static async fetchIncidents(): Promise<IncidentDTO[]> {
    // Aquí va la lógica del backend 
    return [...this.mockIncidents];
  }

  static async createIncident(incident: Omit<IncidentDTO, 'incidenteID'>): Promise<void> {
    // Aquí va la lógica del backend 
    const newIncident: IncidentDTO = {
      ...incident,
      incidenteID: Math.max(...this.mockIncidents.map(i => i.incidenteID), 0) + 1
    };
    this.mockIncidents.push(newIncident);
    this.notifyListeners([...this.mockIncidents]);
  }

  static async updateIncidentStatus(id: number, status: IncidentStatus): Promise<void> {
    // Aquí va la lógica del backend 
    const incident = this.mockIncidents.find(i => i.incidenteID === id);
    if (incident) {
      incident.estado = status;
      this.notifyListeners([...this.mockIncidents]);
    }
  }

  static async deleteIncident(id: number): Promise<void> {
    // Aquí va la lógica del backend 
    this.mockIncidents = this.mockIncidents.filter(i => i.incidenteID !== id);
    this.notifyListeners([...this.mockIncidents]);
  }
}