import { IncidentDTO, IncidentStatus} from "../models/dto-incident";

/**
 * @module incident.service
 * 
 * @global
 * Módulo de servicio para incidentes.
 * 
 * @apicall _ - `http://localhost:8080/v1/incident/toolkit`
 */
export class IncidentService {
  /**
   * API
   */
  private static apiUrl = 'http://localhost:8080/v1/incident';

  /**
   * @alpha
   */
  private static mockIncidents: IncidentDTO[] = [
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

  /**
   * Subscribers (Observers - Subscribers)
   */
  private static listeners: ((incidents: IncidentDTO[]) => void)[] = [];

  /**
   * ID del intervalo
   */
  private static intervalId: number | null = null;

  /**
   * Conectado.
   * 
   * @returns {Promise<void>} Representación del terminado con éxito de una operación asíncrona.
   */
  static async connect(): Promise<void> {
    await this.fetchAndNotify();
    this.intervalId = window.setInterval(() => {
      this.fetchAndNotify();
    }, 5000);
  }

  /**
   * Busca y notifica (Observer - Publisher)
   * 
   * @returns {Promise<void>} Representación del terminado con éxito de una operación asíncrona.
   */
  private static async fetchAndNotify() {
    try {
      const incidents = await this.fetchIncidents();
      this.notifyListeners(incidents);
    } catch (error) {
      console.error("Error al obtener incidentes:", error);
    }
  }

  /**
   * @callback callback
   * 
   * @param {IncidentDTO[]} incidents - Incidentes.
   */
  
  /**
   * Suscribirse (Observer - Subscriber).
   * 
   * @param callback 
   */
  static subscribe(callback: (incidents: IncidentDTO[]) => void): void {
    this.listeners.push(callback);
    this.fetchAndNotify(); 
  }
  

  /**
   * Desconectar.
   */
  static disconnect(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  /**
   * @callback callback
   * @param {IncidentDTO[]} incidents - Incidentes.
   */

  /**
   * Desuscribirse (Observer - Subscriber).
   * 
   * @param callback 
   */
  static unsubscribe(callback: (incidents: IncidentDTO[]) => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  /**
   * Notificar (Observer - Publisher).
   * 
   * @param incidents No
   */
  private static notifyListeners(incidents: IncidentDTO[]): void {
    this.listeners.forEach(listener => listener(incidents));
  }

  /**
   * Busca incidentes.
   * 
   * @apicall _ - `http://localhost:8080/v1/incident/toolkit`
   * 
   * @returns {Promise<IncidentDTO[]>} Representación del terminado con éxito de una operación asíncrona, junto con su resultado.
   */
  static async fetchIncidents(): Promise<IncidentDTO[]> {
    // ? Falta método
    const response = await fetch(`${this.apiUrl}/toolkit`);
    if (!response.ok) {
      throw new Error("Error al obtener los incidentes");
    }
    const data = await response.json();
    return data;
  }
  

  /**
   * Crear incidente,
   * 
   * @param {Omit<IncidentDTO, string>} incident - Incidente sin ID.
   * 
   * @returns {Promise<void>} Representación del terminado con éxito de una operación asíncrona.
   * 
   * @alpha
   */
  static async createIncident(incident: Omit<IncidentDTO, 'incidenteID'>): Promise<void> {
    // Aquí va la lógica del backend 
    const newIncident: IncidentDTO = {
      ...incident,
      incidenteID: Math.max(...this.mockIncidents.map(i => i.incidenteID), 0) + 1
    };
    this.mockIncidents.push(newIncident);
    this.notifyListeners([...this.mockIncidents]);
  }

  /**
   * Actualiza el estado del incidente,
   * 
   * @param {number} id - ID del incidente. 
   * @param {IncidentStatus} status - Nuevo estado.
   * 
   * @returns {Promise<void>} Representación del terminado con éxito de una operación asíncrona.
   * 
   * @alpha
   */
  static async updateIncidentStatus(id: number, status: IncidentStatus): Promise<void> {
    // Aquí va la lógica del backend 
    const incident = this.mockIncidents.find(i => i.incidenteID === id);
    if (incident) {
      incident.estado = status;
      this.notifyListeners([...this.mockIncidents]);
    }
  }

  /**
   * Borra un incidente.
   * 
   * @param {number} id - ID del incidente.
   * 
   * @returns {Promise<void>} Representación del terminado con éxito de una operación asíncrona.
   * 
   * @alpha 
   */
  static async deleteIncident(id: number): Promise<void> {
    // Aquí va la lógica del backend 
    this.mockIncidents = this.mockIncidents.filter(i => i.incidenteID !== id);
    this.notifyListeners([...this.mockIncidents]);
  }
}