import { IncidentDTO, IncidentStatus} from "../models/dto-incident";

export class IncidentService {
  private static apiUrl = 'http://localhost:8080/v1/incident';
  private static mockIncidents: IncidentDTO[] = [
    {
      incidenteid: 2,
      clienteID: 102,
      categoriaid: 3,
      nombre: "Corte eléctrico",
      descripcion: "Zona sin luz por varias horas",
      fecha: "2025-04-24",
      hora: "09:30",
      latitud: 19.4060,
      longitud: -99.1635,
      estado: "en revisión",
      likes: 0
    },
    {
      incidenteid: 3,
      clienteID: 103,
      categoriaid: 2,
      nombre: "Semáforo descompuesto",
      descripcion: "Semáforo fuera de servicio en la esquina",
      fecha: "2025-04-23",
      hora: "18:20",
      latitud: 19.4068,
      longitud: -99.1630,
      estado: "resuelto",
      likes: 0
    }
  ];

  private static listeners: ((incidents: IncidentDTO[]) => void)[] = [];
  private static intervalId: number | null = null;

  static async connect(): Promise<void> {
    await this.fetchAndNotify();
    this.intervalId = window.setInterval(() => {
      this.fetchAndNotify();
    }, 5000);
  }
  
  private static async fetchAndNotify() {
    try {
      const incidents = await this.fetchIncidents();
      this.notifyListeners(incidents);
    } catch (error) {
      console.error("Error al obtener incidentes:", error);
    }
  }
  
  static subscribe(callback: (incidents: IncidentDTO[]) => void): void {
    this.listeners.push(callback);
    this.fetchAndNotify(); 
  }
  

  static disconnect(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  static unsubscribe(callback: (incidents: IncidentDTO[]) => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  private static notifyListeners(incidents: IncidentDTO[]): void {
    this.listeners.forEach(listener => listener(incidents));
  }

  static async fetchIncidents(): Promise<IncidentDTO[]> {
    const response = await fetch(`${this.apiUrl}/toolkit`);
    if (!response.ok) {
      throw new Error("Error al obtener los incidentes");
    }
    const data = await response.json();
    return data;
  }
  

  static async createIncident(incident: Omit<IncidentDTO, 'incidenteID'>): Promise<void> {
    // Aquí va la lógica del backend 
    const newIncident: IncidentDTO = {
      ...incident,
      incidenteid: Math.max(...this.mockIncidents.map(i => i.incidenteid), 0) + 1
    };
    this.mockIncidents.push(newIncident);
    this.notifyListeners([...this.mockIncidents]);
  }

  static async updateIncidentStatus(id: number, status: IncidentStatus): Promise<void> {
    // Aquí va la lógica del backend 
    const incident = this.mockIncidents.find(i => i.incidenteid === id);
    if (incident) {
      incident.estado = status;
      this.notifyListeners([...this.mockIncidents]);
    }
  }

  static async deleteIncident(id: number): Promise<void> {
    // Aquí va la lógica del backend 
    this.mockIncidents = this.mockIncidents.filter(i => i.incidenteid !== id);
    this.notifyListeners([...this.mockIncidents]);
  }


  static async getIncidentsByUser(userId: number): Promise<IncidentDTO[]> {
    try {
      const response = await fetch(`http://localhost:8080/v1/incident/user`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clienteid: userId }),
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener incidentes del usuario');
      }
      const incidents : IncidentDTO[] = await response.json();
      return incidents;
    } catch (error) {
      console.error('Error fetching user incidents:', error);
      throw error;
    }
  }
  
}