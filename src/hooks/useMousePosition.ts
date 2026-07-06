import { useEffect, useRef } from 'react';

export interface MousePosition {
  x: number; // Raw client X
  y: number; // Raw client Y
  ndcX: number; // Normalized Device Coordinate X (-1 to 1)
  ndcY: number; // Normalized Device Coordinate Y (-1 to 1)
}

export const useMousePosition = () => {
  const mouseRef = useRef<MousePosition>({ x: -1000, y: -1000, ndcX: -1000, ndcY: -1000 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      const ndcX = (x / window.innerWidth) * 2 - 1;
      const ndcY = -(y / window.innerHeight) * 2 + 1;

      mouseRef.current = { x, y, ndcX, ndcY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, ndcX: -1000, ndcY: -1000 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return mouseRef;
};
