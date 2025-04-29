import React from "react";

interface MapPinProps {
  pinColor?: string; 
  size?: number; 
  className?: string; 
}

const SelectLocationPin: React.FC<MapPinProps> = ({
  pinColor = "#00A5C2", 
  size = 32,
  className = "",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Margen blanco delgado */}
      <path
        d="M16 1C10.9254 1 7 4.92537 7 10C7 15.254 16 27 16 27C16 27 25 15.254 25 10C25 4.92537 21.0746 1 16 1Z"
        fill="white"
        stroke="white"
      />
      
      {/* Parte principal del pin */}
      <path
        d="M16 3C11.5817 3 8 6.58172 8 11C8 15.725 16 26 16 26C16 26 24 15.725 24 11C24 6.58172 20.4183 3 16 3Z"
        fill={pinColor}
      />

      {/* Triángulo isósceles con bordes redondeados */}
      <path
        d="M16 7C14 7 13 9 13 11C13 13 16 15 16 15C16 15 19 13 19 11C19 9 18 7 16 7Z"
        fill="white"
      />

      {/* Círculo debajo del triángulo */}
      <circle cx="16" cy="18" r="1.5" fill="white" />
    </svg>
  );
};

export default SelectLocationPin;
