import { useState } from 'react';
import './toggle-switch.css';

interface ToggleSwitchProps {
  id: string;
  onChange: (isOn: boolean) => void;
}

const ToggleSwitch = ({ id, onChange }: ToggleSwitchProps) => {
  const [isOn, setIsOn] = useState(false);

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

export default ToggleSwitch;