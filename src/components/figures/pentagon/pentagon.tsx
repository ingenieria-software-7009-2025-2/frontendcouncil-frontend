import React from 'react';

interface PentagonProps {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  cornerRadius?: number;
  width?: number;
  height?: number;
}

const Pentagon: React.FC<PentagonProps> = ({
  fill = 'none',
  stroke = 'black',
  strokeWidth = 1,
  cornerRadius = 15,
  width = 315,   
  height = 276, 
}) => {
  // Puntos del pentágono (coordenadas originales, pero escalables)
  const points = [
    { x: 157.5, y: 12.5 },    
    { x: 302.5, y: 105.5 },   
    { x: 250.5, y: 263.5 },   
    { x: 64.5, y: 263.5 },    
    { x: 12.5, y: 105.5 },    
  ];

  // Función para generar el path con esquinas redondeadas
  const roundedPath = () => {
    let path = '';
    const len = points.length;

    for (let i = 0; i < len; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % len];
      const p0 = points[(i - 1 + len) % len];

      // Vectores y ángulos (igual que antes)
      const dx1 = p1.x - p0.x;
      const dy1 = p1.y - p0.y;
      const dx2 = p2.x - p1.x;
      const dy2 = p2.y - p1.y;
      const angle1 = Math.atan2(dy1, dx1);
      const angle2 = Math.atan2(dy2, dx2);
      const angleDiff = angle2 - angle1;
      const distance = cornerRadius / Math.tan(angleDiff / 2);

      // Puntos de control del redondeo
      const x1 = p1.x - distance * Math.cos(angle1);
      const y1 = p1.y - distance * Math.sin(angle1);
      const x2 = p1.x + distance * Math.cos(angle2);
      const y2 = p1.y + distance * Math.sin(angle2);

      if (i === 0) {
        path += `M ${x1} ${y1}`;
      } else {
        path += ` L ${x1} ${y1}`;
      }
      path += ` Q ${p1.x} ${p1.y}, ${x2} ${y2}`;
    }

    path += ' Z';
    return path;
  };

  return (
    <svg 
      width={width}     
      height={height}   
      viewBox="0 0 315 276"  // ViewBox fijo para mantener proporciones
      xmlns="http://www.w3.org/2000/svg">
      <path
        d={roundedPath()}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default Pentagon;