import { useRef, useState, useEffect, type ReactNode } from 'react';

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className = '',
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;

      const isWithinPadding =
        e.clientX >= rect.left - padding &&
        e.clientX <= rect.right + padding &&
        e.clientY >= rect.top - padding &&
        e.clientY <= rect.bottom + padding;

      if (isWithinPadding) {
        setTransformStyle({
          transform: `translate3d(${distX / strength}px, ${distY / strength}px, 0)`,
          transition: activeTransition,
          willChange: 'transform',
        });
      } else {
        setTransformStyle({
          transform: 'translate3d(0, 0, 0)',
          transition: inactiveTransition,
          willChange: 'transform',
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [padding, strength, activeTransition, inactiveTransition]);

  return (
    <div ref={ref} style={transformStyle} className={className}>
      {children}
    </div>
  );
}
