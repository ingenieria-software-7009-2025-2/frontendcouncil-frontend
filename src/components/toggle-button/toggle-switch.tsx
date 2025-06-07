import './toggle-switch.css';

interface ToggleSwitchProps {
  id: string;
  isOn: boolean; 
  onChange: (isOn: boolean) => void;
}

const ToggleSwitch = ({ id, isOn, onChange }: ToggleSwitchProps) => {
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Previene el cierre del dropdown
    e.stopPropagation(); // Evita que el evento se propague
    onChange(!isOn); // Usa el valor actual de la prop
  };

  return (
    <div className={`toggle-switch ${isOn ? 'on' : 'off'}`} onClick={handleToggle}>
      <div className="toggle-switch-slider"/>
    </div>
  );
};

export default ToggleSwitch;