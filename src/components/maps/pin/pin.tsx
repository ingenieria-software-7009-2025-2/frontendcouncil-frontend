import L, { Icon } from 'leaflet';
import pin from '../../../assets/pin.png';
import { IncidentStatus } from '../../../models/dto-incident';
import './pin.css';

export class IncidentPin {
  private static colorMap: Record<IncidentStatus, string> = {
    reportado: '#FF4D4D',     
    'en revisión': '#FFAC4D', 
    resuelto: '#8DE266'      
  };

  private static categoryIcons: Record<number, string> = {
    1: '🕳️',
    2: '💡',
    3: '🗑️',
    4: '💧',
    5: '🏴‍☠️',
    6: '❓'
  };

  static getIcon(estado: IncidentStatus, categoriaid: number): Icon {
    const circleColor = this.colorMap[estado];
    const pinUrl = new URL(pin, import.meta.url).href;
    const categoryIcon = this.categoryIcons[categoriaid] || '❓';

    return L.divIcon({
      className: `incident-marker ${estado}`,
      html: `
        <div class="pin-container">
          <img src="${pinUrl}" class="pin-image" />
          <div class="pin-status-indicator" style="background-color: ${circleColor};">
            <span class="category-icon">${categoryIcon}</span>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
  }
}