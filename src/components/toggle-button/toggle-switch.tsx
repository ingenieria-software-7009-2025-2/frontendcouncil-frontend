import { useState } from 'react';
import './toggle-switch.css';

/**
 * @global
 * Interfaz con las propiedades sobre el toggle-switch.
 * 
 * @param {string} id - Identificador.
 * @param {function} onChange - Función que realiza una acción ante cambio.
 * 
 * @interface
 */
interface ToggleSwitchProps {
  id: string;

  /**
   * Función que realiza una acción ante cambio.
   * @param {boolean} isOn - Esta activada.
   */
  onChange: (isOn: boolean) => void;
}

/**
 * @global
 * Constructor del toggle-switch.
 * 
 * @param {string} id - Identificador.
 * @param {fuction} onChange - Función que realiza una acción ante cambio.
 * 
 * @eventProperty
 */
const ToggleSwitch = ({ id, onChange }: ToggleSwitchProps) => {
  const [isOn, setIsOn] = useState(false);

  /**
   * Manejador de cambios en el mouse.
   * 
   * @param {React.MouseEvent} e - Evento proveniente mouse.
   * 
   * @eventProperty
   */
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Previene el cierre del dropdown
    e.stopPropagation(); // Evita que el evento se propague
    const newState = !isOn;
    setIsOn(newState);
    onChange(newState);
  };

  return (
    <div className={`toggle-switch ${isOn ? 'on' : 'off'}`} onClick={handleToggle}>
      <div className="toggle-switch-slider"/>
    </div>
  );
};

/**
 * @module toggle-switch
 * 
 * Interuptor.
 * 
 * @remarks Módulo especializado en el control y cambio del toggle-switch.
 */
export default ToggleSwitch;