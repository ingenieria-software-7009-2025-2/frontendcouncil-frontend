import L, { Icon } from 'leaflet';
import pin from '../../../assets/pin.png';
import { IncidentStatus } from '../../../models/dto-incident';
import './pin.css';

/**
 * @module pin
 * 
 * @global
 * Crea Pines para colocar en el mapa señalizando el incidente.
 */
export class IncidentPin {

  /**
   * Colores para los pines, según su estado.
   * 
   * @type {Record<IncidentStatus, string>}
   */
  private static colorMap: Record<IncidentStatus, string> = {
    reportado: '#FF4D4D',
    revision: '#FFAC4D',
    resuelto: '#8DE266'
  };

  /**
   * Regresa un elemento con el ícono.
   * 
   * @param {IncidentStatus} estado - Estado del inicidente
   * 
   * @returns {L.DivIcon} Ícono.
   */
  static getIcon(estado: IncidentStatus): Icon {
    const circleColor = this.colorMap[estado];
    const pinUrl = new URL(pin, import.meta.url).href;

    return L.divIcon({
      className: `incident-marker ${estado}`, // Añade clase de estado
      html: `
        <div class="pin-container">
          <img src="${pinUrl}" class="pin-image" />
          <div class="pin-status-indicator" style="background-color: ${circleColor};"></div>
        </div>
      `,
      iconSize: [40, 40],      // Tamaño base del icono
      iconAnchor: [20, 40],    // Punto de anclaje (centro en X, base en Y)
      popupAnchor: [0, -40]    // Posición del popup
    });
  }
}